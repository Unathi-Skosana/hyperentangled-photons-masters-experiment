#!flask/bin/python

import threading
from werkzeug.exceptions import HTTPException
from flask import Flask, json, request, jsonify, send_file
from flask_cors import CORS
from constants import VEL_SCALE, ACCEL_SCALE,ENC_CNT,\
            TRANS_STAGE, PROJ_ONE_POS, PROJ_ZERO_POS,\
            PROJ_BOTH_POS, ANGLES
import io
import os
import time
import numpy as np
import requests
import logging
import argparse
import serial
import serial.tools.list_ports
import thorlabs_apt_protocol as apt

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

ports = sorted(serial.tools.list_ports.comports())
usb_paths = list(map(lambda x: x[0], ports))
device_names = list(map(lambda x: x[1], ports))
hwids = list(map(lambda x: x[2], ports))
num_usb = len(usb_paths)

# thorlabs apt protocol
source = 1
dest = 80
chan_ident = 0

# fpga conunter
fpga = None
period = 10
rate = 0.1
retries = 1000

# lock
sem = threading.Semaphore()

logging.info("{} devices found:".format(num_usb))
devices = [None] * 7 
serials = ["27254145", "27600162", "27253947", "27501379",
        "27259259", "27259066", "27504812"]

for i in range(num_usb):
    if device_names[i] == "USB-Serial Controller D":
        logging.info("Device {} - {} - {}".format(i, device_names[i], hwids[i]))
        fpga = serial.Serial(usb_paths[i], 19200, timeout=1, stopbits=serial.STOPBITS_ONE)
    elif "Motor" in device_names[i] or "Kinesis" in device_names[i]:
            logging.info("Device {} - {} - {}".format(i, device_names[i], hwids[i]))
            device = serial.Serial(usb_paths[i], 115200, rtscts=True, timeout=0.1)
            device.rts = True
            device.reset_input_buffer()
            device.reset_output_buffer()
            device.rts = False
            device.write(apt.hw_no_flash_programming(source=source, dest=dest))
            ser = hwids[i].split(" ")[-2].split("=")[-1]
            idx = serials.index(ser)
            devices[idx] = device

# ---       ----
# --- utils ----
# ---       ----
def opp_proj(proj):
    if proj == "+":
        return "-"
    elif proj == "-":
        return "+"
    elif proj == "i":
        return  "-i"
    elif proj == "-i":
        return "i"
    return "+"

def clear_buffer(device):
    device.rts = True
    device.reset_input_buffer()
    device.reset_output_buffer()
    device.rts = False

def is_not_moving(message):
    not_moving = hasattr(message, 'moving_forward') and not (message.moving_forward or message.moving_reverse)
    not_homing = hasattr(message, 'homing')  and  not message.homing
    not_jogging = hasattr(message, 'jogging_forward') and not (message.jogging_forward or message.jogging_reverse)

    return (not_jogging and not_homing and not_moving)

def block_til_finished(device, log_message):
    time.sleep(1)
    while True:  # potential for an infinite block, living dangerously.
        clear_buffer(device)
        device.write(
            apt.mot_req_dcstatusupdate(source=source, dest=dest, chan_ident=chan_ident)
        )

        unpacker = apt.Unpacker(device)
        for message in unpacker:
            if is_not_moving(message):
                logging.info(log_message)
                return

def block_path(proj="0"):
    z_t_stage = devices[5]

    position = PROJ_BOTH_POS

    if proj == "0":
        position = PROJ_ZERO_POS
    elif proj == "1":
        position = PROJ_ONE_POS

    clear_buffer(z_t_stage)
    z_t_stage.write(
        apt.mot_move_absolute(
            source=source,
            dest=dest,
            chan_ident=chan_ident,
            position=int(np.ceil(position * ENC_CNT)),
        )
    )

    logging.info("Z basis translation stage is moving.")

    block_til_finished(z_t_stage, "Z basis translation stage is done moving")

def project_path(proj="+", period=1, threshold=20):
    z_t_stage = devices[5]

    position = PROJ_BOTH_POS

    clear_buffer(z_t_stage)
    z_t_stage.write(
        apt.mot_move_absolute(
            source=source,
            dest=dest,
            chan_ident=chan_ident,
            position=int(np.ceil(position * ENC_CNT)),
        )
    )

    logging.info("Z basis translation stage is moving.")

    block_til_finished(z_t_stage, "Z basis translation stage is done moving")

    proj = opp_proj(proj)
    proj_angle = ANGLES[proj]

    HWP0 = devices[0]
    HWP1 = devices[2]
    QWP1 = devices[3]
    HWP2 = devices[4]

    clear_buffer(HWP0)
    clear_buffer(HWP1)
    clear_buffer(QWP1)
    clear_buffer(HWP2)

    HWP0.write(
        apt.mot_move_absolute(
            source=source,
            dest=dest,
            chan_ident=chan_ident,
            position=int(np.ceil(0 * ENC_CNT)),
        )
    )

    HWP1.write(
        apt.mot_move_absolute(
            source=source,
            dest=dest,
            chan_ident=chan_ident,
            position=int(np.ceil(proj_angle[0] * ENC_CNT)),
        )
    )

    QWP1.write(
        apt.mot_move_absolute(
            source=source,
            dest=dest,
            chan_ident=chan_ident,
            position=int(np.ceil(proj_angle[1] * ENC_CNT)),
        )
    )

    HWP2.write(
        apt.mot_move_absolute(
            source=source,
            dest=dest,
            chan_ident=chan_ident,
            position=int(np.ceil(45 * ENC_CNT)),
        )
    )

    block_til_finished(HWP0, "HWP0 is done moving")
    block_til_finished(QWP1, "QWP0 is done moving")
    block_til_finished(HWP1, "HWP1 is done moving")
    block_til_finished(HWP2, "HWP1 is done moving")

    mzi_t_stage = devices[6]

    clear_buffer(mzi_t_stage)
    mzi_t_stage.write(
            apt.mot_set_jogparams(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                jog_mode=2,
                stop_mode=2,
                step_size=2, # 0.00006 mm
                min_velocity=int(np.ceil(0  * VEL_SCALE)),
                acceleration=int(np.ceil(10 * ACCEL_SCALE)),
                max_velocity=int(np.ceil(10 * VEL_SCALE)),
            )
        )

    time.sleep(1)
    logging.info("Jog parameters set.")

    direction = np.random.choice([1,2])  # randomly decide in which direction to jog

    if fpga is not None:
        r = 0
        accum = None

        while True:
            accum = [0, 0, 0, 0, 0, 0, 0, 0]
            for _ in range(0, 10 * period):
                clear_buffer(fpga)

                b = fpga.read(41)
                s = np.frombuffer(b, dtype=np.uint8)
                y = np.unpackbits(s) # Turns bytes into bit array.
                y = y[:-8]           # Remove last byte - this is the termination byte
                y = (np.split(y, 8)) # Split bits into bytes
                z = np.sum(np.packbits(y,1) * (1, 128, 256, 384, 512), 1)
                accum += z
                time.sleep(rate)

            logging.info(accum)
            doubles = accum[4]
            if  doubles < threshold:
                break

            clear_buffer(mzi_t_stage)

            mzi_t_stage.write(
                apt.mot_move_jog(
                    source=source, dest=dest, chan_ident=chan_ident, direction=direction
                )
            )

            logging.info("Translation is jogging.")

            block_til_finished(mzi_t_stage, "Translation is done jogging.")

    # doubles = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    # l = 0
    # while True:
    #     if  doubles[l] < threshold:
    #         break

    #     clear_buffer(mzi_t_stage)
    #     mzi_t_stage.write(
    #         apt.mot_move_jog(
    #             source=source, dest=dest, chan_ident=chan_ident, direction=direction
    #         )
    #     )

    #     logging.info("Translation is jogging.")

    #     clear_buffer(mzi_t_stage)
    #     mzi_t_stage.write(
    #         apt.mot_req_dcstatusupdate(source=source, dest=dest, chan_ident=chan_ident)
    #     )

    #     block_til_finished(mzi_t_stage, "Translation is done jogging.")
    #     l += 1

    HWP2.write(
        apt.mot_move_absolute(
            source=source,
            dest=dest,
            chan_ident=chan_ident,
            position=int(np.ceil(90 * ENC_CNT)),
        )
    )

    block_til_finished(HWP2, "HWP2 is done moving")

@app.before_first_request
def bootstrap():
    sem.acquire()

    for i in range(len(devices)):
        if devices[i] is None:
            continue

        clear_buffer(devices[i])
        if i == 5 or i == 6:
            if i == 5:
                devices[i].write(
                    apt.mot_set_velparams(
                        source=source,
                        dest=dest,
                        chan_ident=chan_ident,
                        min_velocity=int(np.ceil(0 * VEL_SCALE)),
                        acceleration=int(np.ceil(60 * ACCEL_SCALE)),
                        max_velocity=int(np.ceil(100 * VEL_SCALE)),
                    )
                )

                devices[i].write(
                        apt.mot_set_homeparams(
                        source=source,
                        dest=dest,
                        chan_ident=chan_ident,
                        home_dir=2,
                        limit_switch=1,
                        home_velocity=int(np.ceil(50 * VEL_SCALE)),
                        offset_distance=int(np.ceil(0 * ENC_CNT)),
                    )
                )
            else:
                devices[i].write(
                        apt.mot_set_jogparams(
                            source=source,
                            dest=dest,
                            chan_ident=chan_ident,
                            jog_mode=2,
                            stop_mode=2,
                            step_size=2, # 0.00006 mm
                            min_velocity=int(np.ceil(0  * VEL_SCALE)),
                            acceleration=int(np.ceil(10 * ACCEL_SCALE)),
                            max_velocity=int(np.ceil(10 * VEL_SCALE)),
                    )
                )

            continue

        devices[i].write(
            apt.mot_set_homeparams(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                home_dir=2,
                limit_switch=1,
                home_velocity=int(np.ceil(50 * VEL_SCALE)),
                offset_distance=int(np.ceil(4 * ENC_CNT)),
            )
        )

        devices[i].write(
            apt.mot_set_velparams(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                min_velocity=int(np.ceil(0 * VEL_SCALE)),
                acceleration=int(np.ceil(40 * ACCEL_SCALE)),
                max_velocity=int(np.ceil(100 * VEL_SCALE)),
            )
        )


    logging.info("Motors are homing.")

    for i in range(len(devices)):
        if devices[i] is None:
            continue

        if i == 6:
            continue

        clear_buffer(devices[i])
        devices[i].write(apt.mot_move_home(source=source, dest=dest, chan_ident=chan_ident))

    for i in range(len(devices)):
        if devices[i] is None:
            continue

        block_til_finished(devices[i], "Motor {} is done homing".format(i))

    # new home for device 4
    if devices[4] is not None:
        clear_buffer(devices[4])
        devices[4].write(
            apt.mot_move_absolute(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                position=int(np.ceil(90 * ENC_CNT)),
            )
        )

        block_til_finished(devices[4], "Motor {} is done homing".format(4))
        logging.info("Motors are done homing.")

    sem.release()

@app.errorhandler(Exception)
def handle_error(e):
    sem.release()
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return jsonify(error=str(e)), code

@app.route("/")
def hello():
    return "Hi!"

@app.route("/ping", methods=["GET"])
def ping():
    bootstrap()
    return jsonify({"status": "pong"}), 200

@app.route("/devices", methods=["GET"])
def req_devices():
    device_objs = []
    for i in range(0, num_usb):
        if "Motor" in device_names[i] or "Kinesis" in device_names[i]:
            device_objs.append({
                "name": device_names[i].split(" - ")[0],
                "hwid": hwids[i],
                "path": usb_paths[i]
            })

    return jsonify({ "devices": device_objs }), 200

@app.route("/info", methods=["GET"])
def req_info():
    device = int(request.args.get("device", 0))
    port = devices[device]

    if port is None:
        return jsonify({"status": "error", "error": "Device unavailable"}), 500

    sem.acquire()
    for i in range(retries):
        clear_buffer(port)
        port.write(apt.hw_req_info(source=source, dest=dest))
        unpacker = apt.Unpacker(port)
        for message in unpacker:  # success
            if hasattr(message, "msg") and message.msg == "hw_get_info":
                logging.info(message)
                sem.release()
                return jsonify(message)
    sem.release()
    logging.error("Could not retrieve port information")
    return jsonify({"status": "error", "error": "Could not get port information"}), 500


@app.route("/status", methods=["GET"])
def status():
    device = int(request.args.get("device", 0))
    port = devices[device]

    if port is None:
        return jsonify({"status": "error", "error": "Device unavailable"}), 500

    sem.acquire()
    for i in range(retries):
        clear_buffer(port)
        port.write(
            apt.mot_req_dcstatusupdate(source=source, dest=dest, chan_ident=chan_ident)
        )
        unpacker = apt.Unpacker(port)
        for message in unpacker:  # success
            if hasattr(message, 'msg') and message.msg == "mot_get_dcstatusupdate":
                logging.info(message)
                sem.release()
                return jsonify(message)

    sem.release()
    logging.error("Could not retrieve device status")
    return jsonify({"status": "error", "error": "Could not get device status"}), 500


# TODO: Found what this exactly does

@app.route("/disconnect", methods=["GET"])
def disconnect():
    device = int(request.args.get("device", 0))
    port = devices[device]

    if port is None:
        return jsonify({"status": "error", "error": "Device unavailable"}), 500

    sem.acquire()

    clear_buffer(port)
    port.write(apt.hw_disconnect(source=source, dest=dest))

    unpacker = apt.Unpacker(port)
    for message in unpacker:
        sem.release()
        logging.info(message)
        return jsonify(message)

    sem.release()
    logging.info("Successfully disconnected.")
    return jsonify({"status": "ok"}), 200


@app.route("/stop", methods=["GET"])
def stop():
    device = int(request.args.get("device", 1))
    stop_mode = int(request.args.get("stop_mode", 2))
    port = devices[device]

    if port is None:
        return jsonify({"status": "error", "error": "Device unavailable"}), 500

    sem.acquire()

    clear_buffer(port)
    port.write(
        apt.mot_move_stop(
            source=source, dest=dest, chan_ident=chan_ident, stop_mode=stop_mode
        )
    )

    unpacker = apt.Unpacker(port)
    for message in unpacker:  # probably error
        sem.release()
        logging.info(message)
        return jsonify(message), 500

    sem.release()
    logging.info("Motor is stopping.")
    return jsonify({"status": "ok"}), 200


@app.route("/home", methods=["GET", "POST", "PUT"])
def home():
    if request.method == "GET":
        device = int(request.args.get("device", 0))
        port = devices[device]

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        for i in range(retries):
            clear_buffer(port)
            port.write(
                apt.mot_req_homeparams(source=source, dest=dest, chan_ident=chan_ident)
            )

            unpacker = apt.Unpacker(port)
            for message in unpacker:
                if hasattr(message, 'msg') and message.msg == "mot_get_homeparams":
                    sem.release()
                    logging.info(message)
                    return jsonify(message), 200

        sem.release()
        return (
            jsonify({"status": "error", "error": "Could not get home parameters"}),
            500,
        )
    elif request.method == "POST":
        device = int(request.json.get("device", 0))
        port = devices[device]

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        clear_buffer(port)
        port.write(apt.mot_move_home(source=source, dest=dest, chan_ident=chan_ident))

        logging.info("Motor is homing.")

        block_til_finished(port, "Motor is done homing")

        sem.release()
        return jsonify({"status": "ok"}), 200
    else:
        device = int(request.json.get("device", 0))
        port = devices[device]
        home_dir = int(request.json.get("home_dir", 2))
        limit_switch = int(request.json.get("limit_switch", 1))
        home_velocity = request.json.get("home_velocity", 2)
        offset_distance = request.json.get("offset_distance", 0)

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()

        clear_buffer(port)
        port.write(
            apt.mot_set_homeparams(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                home_dir=home_dir,
                limit_switch=limit_switch,
                home_velocity=int(np.ceil(home_velocity * VEL_SCALE)),
                offset_distance=int(np.ceil(offset_distance * ENC_CNT)),
            )
        )

        sem.release()
        logging.info("Home parameters set.")
        return jsonify({"status": "ok"}), 200


@app.route("/velocity", methods=["GET", "POST", "PUT"])
def velocity():
    if request.method == "GET":
        device = int(request.args.get("device", 1))
        port = devices[device]

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        for i in range(retries):
            clear_buffer(port)
            port.write(
                apt.mot_req_velparams(source=source, dest=dest, chan_ident=chan_ident)
            )

            unpacker = apt.Unpacker(port)
            for message in unpacker:
                if hasattr(message, "msg") and message.msg == "mot_get_velparams":
                    sem.release()
                    logging.info(message)
                    return jsonify(message), 200

        sem.release()
        logging.error("Could not get velocity parameters")
        return (
            jsonify({"status": "error", "error": "Could not get velocity parameters"}),
            500,
        )
    elif request.method == "POST":
        device = int(request.json.get("device", 1))
        port = devices[device]
        direction = int(request.json.get("direction", 1))

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()

        clear_buffer(port)
        port.write(
            apt.mot_move_velocity(
                source=source, dest=dest, chan_ident=chan_ident, direction=direction
            )
        )

        logging.info("Motor is moving.")

        block_til_finished(port, "Motor is done moving.")

        sem.release()
        return jsonify({"status": "ok"}), 200
    else:
        device = int(request.json.get("device", 1))
        port = devices[device]
        min_velocity = request.json.get("min_velocity", 0)
        acceleration = request.json.get("acceleration", 1)
        max_velocity = request.json.get("max_velocity", 1)

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        clear_buffer(port)
        port.write(
            apt.mot_set_velparams(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                min_velocity=int(np.ceil(min_velocity * VEL_SCALE)),
                acceleration=int(np.ceil(acceleration * ACCEL_SCALE)),
                max_velocity=int(np.ceil(max_velocity * VEL_SCALE)),
            )
        )

        sem.release()
        logging.info("Velocity parameters set.")
        return jsonify({"status": "ok"}), 200


@app.route("/jog", methods=["GET", "POST", "PUT"])
def jog():
    if request.method == "GET":
        device = int(request.args.get("device", 0))
        port = devices[device]

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        for i in range(retries):
            clear_buffer(port)
            port.write(
                apt.mot_req_jogparams(source=source, dest=dest, chan_ident=chan_ident)
            )
            unpacker = apt.Unpacker(port)
            for message in unpacker:
                if hasattr(message, "msg") and message.msg == "mot_get_jogparams":
                    sem.release()
                    logging.info(message)
                    return jsonify(message), 200

        sem.release()
        return (
            jsonify({"status": "error", "error": "Could not get jog parameters"}),
            500,
        )
    elif request.method == "POST":
        device = int(request.json.get("device", 0))
        port = devices[device]
        direction = int(request.json.get("direction", 1))

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        clear_buffer(port)
        port.write(
            apt.mot_move_jog(
                source=source, dest=dest, chan_ident=chan_ident, direction=direction
            )
        )

        logging.info("Motor is done jogging.")

        block_til_finished(port, "Motor is done jogging.")

        sem.release()
        return jsonify({"status": "ok"}), 200
    else:
        device = int(request.json.get("device", 0))
        port = devices[device]

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        jog_mode = int(request.json.get("jog_mode", 2))
        stop_mode = int(request.json.get("stop_mode", 2))
        step_size = request.json.get("step_size", 1)
        min_velocity = request.json.get("min_velocity", 0)
        acceleration = request.json.get("acceleration", 1)
        max_velocity = request.json.get("max_velocity", 1)

        sem.acquire()

        clear_buffer(port)
        port.write(
            apt.mot_set_jogparams(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                jog_mode=jog_mode,
                step_size=int(np.ceil(step_size * ENC_CNT)),
                min_velocity=int(np.ceil(min_velocity * VEL_SCALE)),
                acceleration=int(np.ceil(acceleration * ACCEL_SCALE)),
                max_velocity=int(np.ceil(max_velocity * VEL_SCALE)),
                stop_mode=stop_mode,
            )
        )

        sem.release()
        logging.info("Jog parameters set.")
        return jsonify({"status": "ok"}), 200

# NOT SURE THIS DOES, BETTER NOT TOUCH.
# @app.route("/power", methods=["GET", "PUT"])
# def power():
#     if request.method == "GET":
#         device = int(request.args.get("device", 0))
#         port = devices[device]
#         port.write(
#             apt.mot_req_powerparams(source=source, dest=dest, chan_ident=chan_ident)
#         )
#         unpacker = apt.Unpacker(port)
#         for message in unpacker:
#             logging.info(message)
#             return jsonify(message), 200
#         return (
#             jsonify({"status": "error", "error": "Could not get power parameters"}),
#             500,
#         )

@app.route("/position", methods=["GET"])
def position():
    device = int(request.args.get("device", 0))
    port = devices[device]

    if port is None:
        return jsonify({"status": "error", "error": "Device unavailable"}), 500

    sem.acquire()
    for i in range(retries):
        clear_buffer(port)
        port.write(apt.mot_req_poscounter(source=source, dest=dest, chan_ident=chan_ident))
        unpacker = apt.Unpacker(port)
        for message in unpacker:
            if hasattr(message, "msg") and message.msg == "mot_get_poscounter":
                sem.release()
                logging.info(message)
                return jsonify(message), 200

    sem.release()
    return (
        jsonify({"status": "error", "error": "Could not get position counter"}),
        500,
    )

@app.route("/genmove", methods=["GET", "PUT"])
def genmove():
    if request.method == "GET":
        device = int(request.args.get("device", 0))
        port = devices[device]

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        for i in range(retries):
            clear_buffer(port)
            port.write(
                apt.mot_req_genmoveparams(source=source, dest=dest, chan_ident=chan_ident)
            )
            unpacker = apt.Unpacker(port)
            for message in unpacker:
                if hasattr(message, "msg") and message.msg == "mot_get_genmoveparams":
                    sem.release()
                    logging.info(message)
                    return jsonify(message), 200

        sem.release()
        return (
            jsonify(
                {"status": "error", "error": "Could not get general move parameters"}
            ),
            500,
        )
    else:
        device = int(request.json.get("device", 0))
        port = devices[device]
        backlash_distance = request.json.get("backlash_distance", 1)

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        clear_buffer(port)
        port.write(
            apt.mot_set_genmoveparams(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                backlash_distance=int(np.ceil(backlash_distance * ENC_CNT)),
            )
        )

        sem.release()
        logging.info("General parameters set.")
        return jsonify({"status": "ok"}), 200


@app.route("/relmove", methods=["GET", "POST", "PUT"])
def relmove():
    if request.method == "GET":
        device = int(request.args.get("device", 0))
        port = devices[device]

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        for i in range(retries):
            clear_buffer(port)
            port.write(
                apt.mot_req_moverelparams(source=source, dest=dest, chan_ident=chan_ident)
            )
            unpacker = apt.Unpacker(port)
            for message in unpacker:
                if hasattr(message, "msg") and message.msg == "mot_get_moverelparams":
                    sem.release()
                    logging.info(message)
                    return jsonify(message), 200

            sem.release()
        logging.error("Could not get relative move parameters")
        return (
            jsonify(
                {"status": "error", "error": "Could not get relative move parameters"}
            ),
            500,
        )
    elif request.method == "POST":
        device = int(request.json.get("device", 0))
        port = devices[device]
        distance = request.json.get("distance", 1)

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()

        clear_buffer(port)
        port.write(
            apt.mot_move_relative(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                distance=int(np.ceil(distance * ENC_CNT)),
            )
        )

        logging.info("Motor is moving.")

        while True:  # potential for an infinite block, living dangerously.
            clear_buffer(port)
            port.write(
                apt.mot_req_dcstatusupdate(source=source, dest=dest, chan_ident=chan_ident)
            )
            unpacker = apt.Unpacker(port)
            for message in unpacker:
                logging.info(message)
                if hasattr(message, 'moving_forward') and not (message.moving_forward or message.moving_reverse):
                    sem.release()
                    logging.info("Motor is done moving.")
                    return jsonify({"status": "ok"}), 200
    else:
        device = int(request.json.get("device", 0))
        port = devices[device]
        relative_distance = request.json.get("relative_distance", 1)

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()

        clear_buffer(port)
        port.write(
            apt.mot_set_moverelparams(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                relative_distance=int(np.ceil(relative_distance * ENC_CNT)),
            )
        )

        sem.release()
        logging.info("Relative parameters set.")
        return jsonify({"status": "ok"}), 200

@app.route("/absmove", methods=["GET", "POST", "PUT"])
def absmove():
    if request.method == "GET":
        device = int(request.args.get("device", 0))
        port = devices[device]

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        for i in range(retries):
            clear_buffer(port)
            port.write(
                apt.mot_req_moveabsparams(source=source, dest=dest, chan_ident=chan_ident)
            )
            unpacker = apt.Unpacker(port)
            for message in unpacker:
                if hasattr(message, "msg") and message.msg == "mot_get_moveabsparams":
                    sem.release()
                    logging.info(message)
                    return jsonify(message), 200

        sem.release()
        logging.error("Could not get absolute move parameters")
        return (
            jsonify(
                {"status": "error", "error": "Could not get absolute move parameters"}
            ),
            500,
        )
    elif request.method == "POST":
        device = int(request.json.get("device", 0))
        port = devices[device]
        position = request.json.get("position", 2)

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        clear_buffer(port)
        port.write(
            apt.mot_move_absolute(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                position=int(np.ceil(position * ENC_CNT)),
            )
        )

        logging.info("Motor is done moving.")

        while True:  # potential for an infinite block, living dangerously.
            clear_buffer(port)
            port.write(
                apt.mot_req_dcstatusupdate(source=source, dest=dest, chan_ident=chan_ident)
            )
            unpacker = apt.Unpacker(port)
            for message in unpacker:
                logging.info(message)
                if hasattr(message, 'moving_forward') and not (message.moving_forward or message.moving_reverse):
                    sem.release()
                    logging.info("Motor is done moving.")
                    return jsonify({"status": "ok"}), 200

        sem.release()
        return jsonify({"status": "ok"}), 200
    else:
        device = int(request.json.get("device", 0))
        port = devices[device]
        absolute_position = request.json.get("position", 2)

        if port is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

        sem.acquire()
        clear_buffer(port)
        port.write(
            apt.mot_set_moveabsparams(
                source=source,
                dest=dest,
                chan_ident=chan_ident,
                absolute_position=int(np.ceil(ENC_CNT * absolute_position)),
            )
        )

        sem.release()
        logging.info("Absolute parameters set.")
        return jsonify({"status": "ok"}), 200

@app.route("/moveseqq", methods=["POST"])
def moveseqq():
    sequence = request.json.get("sequence", [])
    cycles = int(request.json.get("cycles", 1))
    dwell = int(request.json.get("dwell", 0))
    acquire = int(request.json.get("acquire", 0))
    period = int(request.json.get("period", 10))
    rounds = int(request.json.get("rounds", 2))

    coincidences = []
    ports = []
    start_time = time.time()

    sem.acquire()
    for _ in range(cycles):
        for moves in sequence:
            moves.sort(key=lambda x: x["device"], reverse=True)
            for move in moves:
                device = move.get("device", 0)
                distance = move.get("distance", 1)
                port = devices[device]

                if port is None:
                    sem.release()
                    return jsonify({"status": "error", "error": "Device unavailable"}), 500

                if device == 5 or device == 6:
                    if device == 5:
                        proj = move.get("proj", "0")
                        block_path(proj)
                    else:
                        proj = move.get("proj", "+")
                        threshold = int(move.get("threshold", 20))
                        project_path(proj, period, threshold)
                    continue

                clear_buffer(port)
                port.write(
                    apt.mot_move_absolute(
                        source=source,
                        dest=dest,
                        chan_ident=chan_ident,
                        position=int(np.ceil(distance * ENC_CNT)),
                    )
                )

                logging.info("Motors are moving.")

            for i in range(len(devices)):
                # for move them to finish
                if devices[i] is None:
                    continue
                block_til_finished(devices[i], "Motor is done moving.")
                logging.info("Motor {} is finished moving.".format(i))

            # TODO : Check if command above is successful
            logging.info("Motor is dwelling.")
            time.sleep(dwell)
            logging.info("Motor is done dwelling.")

            # acquire somewhere  data here
            if acquire:
                if fpga is None:
                    sem.release()
                    return jsonify({"status": "error", "error": "Device unavailable"}), 500

                r = 0
                accum = [0, 0, 0, 0, 0, 0, 0, 0]
                while r < rounds:
                    for _ in range(0, 10 * period):
                        clear_buffer(fpga)

                        b = fpga.read(41)
                        s = np.frombuffer(b, dtype=np.uint8)
                        y = np.unpackbits(s) # Turns bytes into bit array.
                        y = y[:-8]           # Remove last byte - this is the termination byte
                        y = (np.split(y, 8)) # Split bits into bytes
                        z = np.sum(np.packbits(y,1) * (1, 128, 256, 384, 512), 1)
                        accum += z
                        time.sleep(rate)
                    r += 1
                coincidences.append(int(accum[4]/rounds))

    sem.release()
    duration = time.time() - start_time

    return jsonify({"duration": duration, "coincidences": coincidences, "status": "ok"}), 200

@app.route("/path_projector", methods=["POST"])
def path_projector():
    proj = request.json.get("proj", '+')
    period = int(request.json.get("period", 1))
    threshold = int(request.json.get("threshold", 20))

    sem.acquire()

    start_time = time.time()

    for i in range(2, 7):
        if devices[i] is None:
            return jsonify({"status": "error", "error": "Device unavailable"}), 500

    project_path(proj, period, threshold)

    duration = time.time() - start_time

    sem.acquire()

    return jsonify({"duration": duration, "status": "ok"}), 200

@app.route("/path_block", methods=["POST"])
def path_blocker():
    proj = request.json.get("proj", "0")

    sem.acquire()

    start_time = time.time()

    if devices[5] is None:
        return jsonify({"status": "error", "error": "Device unavailable"}), 500

    block_path(proj)

    duration = time.time() - start_time

    sem.release()

    return jsonify({"duration": duration, "status": "ok"}), 200

@app.route("/moveseq", methods=["POST"])
def moveseq():
    sequence = request.json.get("sequence", [])
    cycles = int(request.json.get("cycles", 1))
    acquire = int(request.json.get("acquire", 0))
    period = int(request.json.get("period", 10))
    rounds = int(request.json.get("rounds", 2))

    start_time = time.time()
    coincidences = []

    sem.acquire()
    for _ in range(cycles):
        for move in sequence:
            relative = int(move.get("relative", 1))
            min_velocity = move.get("min_velocity", 0)
            acceleration = move.get("acceleration", 1)
            max_velocity = move.get("max_velocity", 1)
            distance = move.get("distance", 1)
            reset = int(move.get("reset", 1))

            device = int(move.get("device", 0))
            port = devices[device]

            if port is None:
                sem.release()
                return jsonify({"status": "error", "error": "Device unavailable"}), 500

            clear_buffer(port)
            port.write(
                apt.mot_set_velparams(
                    source=source,
                    dest=dest,
                    chan_ident=chan_ident,
                    min_velocity=int(np.ceil(min_velocity * VEL_SCALE)),
                    acceleration=int(np.ceil(acceleration * ACCEL_SCALE)),
                    max_velocity=int(np.ceil(max_velocity * VEL_SCALE))
                )
            )

            prev_position = None
            clear_buffer(port)
            port.write(
                apt.mot_req_dcstatusupdate(
                    source=source, dest=dest, chan_ident=chan_ident
                )
            )

            unpacker = apt.Unpacker(port)
            for message in unpacker:
                logging.info(message)
                prev_position = message.position

            clear_buffer(port)
            port.write(
                apt.mot_move_relative(
                    source=source,
                    dest=dest,
                    chan_ident=chan_ident,
                    distance=int(np.ceil(distance * ENC_CNT)),
                )
            ) if relative else port.write(
                apt.mot_move_absolute(
                    source=source,
                    dest=dest,
                    chan_ident=chan_ident,
                    position=int(np.ceil(distance * ENC_CNT)),
                )
            )

            logging.info("Motor is moving.")

            block_til_finished(port, "Motor is done moving.")

            logging.info("Motor is dwelling.")

            # acquire somewhere  data here
            dwell = int(move.get("dwell", 2))
            time.sleep(dwell)

            logging.info("Motor is done dwelling.")

            if acquire:
                if fpga is None:
                    sem.release()
                    return jsonify({"status": "error", "error": "Device unavailable"}), 500

                r = 0
                accum = [0, 0, 0, 0, 0, 0, 0, 0]
                while r < rounds:
                    for _ in range(0, 10 * period):
                        clear_buffer(fpga)
                        b = fpga.read(41)
                        s = np.frombuffer(b, dtype=np.uint8)
                        y = np.unpackbits(s) # Turns bytes into bit array.
                        y = y[:-8]           # Remove last byte - this is the termination byte
                        y = (np.split(y, 8)) # Split bits into bytes
                        z = np.sum(np.packbits(y,1) * (1, 128, 256, 384, 512), 1)
                        accum += z
                        time.sleep(rate)
                    r += 1
                coincidences.append(int(accum[4]/rounds))

            if reset and prev_position:
                clear_buffer(port)
                port.write(
                    apt.mot_move_absolute(
                        source=source,
                        dest=dest,
                        chan_ident=chan_ident,
                        position=int(np.ceil(prev_position)),
                    )
                )

                logging.info("Motor is returning to previous position.")

                block_til_finished(port, "Motor is done returning to previous position.")

    sem.release()
    duration = time.time() - start_time

    return jsonify({"duration": duration, "coincidences": coincidences, "status": "ok"}), 200

if __name__ == "__main__":
    os.environ["FLASK_ENV"] = "development"
    port_num = int(os.environ.get("PORT", 8080))
    app.run(debug=True, host="0.0.0.0", port=port_num)
