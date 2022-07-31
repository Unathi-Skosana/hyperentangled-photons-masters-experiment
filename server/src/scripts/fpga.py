import serial
import io
import serial.tools.list_ports
import numpy as np
import time

ports = sorted(serial.tools.list_ports.comports())
usb_paths = list(map(lambda x: x[0], ports))
device_names = list(map(lambda x: x[1], ports))
hwids = list(map(lambda x: x[2], ports))
num_usb = len(usb_paths)

#print(device_names, usb_paths, hwids)
period = 10
rate = 0.1

with serial.Serial('/dev/ttyUSB0', 19200, timeout=1, stopbits=serial.STOPBITS_ONE) as ser:
    while True:
        accum = [0, 0, 0, 0, 0, 0, 0, 0]
        start_time = time.time()
        for i in range(0, 10 * period):
            b = ser.read(41)
            s = np.frombuffer(b, dtype=np.uint8)
            y = np.unpackbits(s) # Turns bytes into bit array.
            y = y[:-8]           # Remove last 8 bits - this is the termination byte
            y = (np.split(y, 8))  
            z = np.sum(np.packbits(y,1) * (1,128,256,384,512), 1)
            accum += z
            time.sleep(rate)
        print("--- %s seconds ---" % (time.time() - start_time))
        print(accum)
