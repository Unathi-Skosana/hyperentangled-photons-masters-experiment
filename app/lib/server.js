const URL = "" // ngrok server URL;

async function ping() {
  await fetch(URL + "/ping")
    .then((r) => r.json())
    .catch((e) => console.error(e));
}

async function home(device) {
  const resp = await fetch(URL + "/home", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ device }),
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));

  return resp;
}

async function path_projector(proj = "-", period = 1, threshold = 20) {
  const resp = await fetch(URL + "/path_projector", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ proj, period, threshold }),
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));

  return resp;
}

async function path_block(proj = "I", period = 1, threshold = 20) {
  const resp = await fetch(URL + "/path_block", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ proj, period, threshold }),
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));

  return resp;
}

async function sequencer(
  sequence,
  cycles = 1,
  acquire = 0,
  period = 10,
  rounds = 2,
  dwell = 0
) {
  const resp = await fetch(URL + "/moveseqq", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sequence, cycles, acquire, period, rounds, dwell }),
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));

  return resp;
}

async function devices() {
  const resp = await fetch(URL + "/devices", {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));

  return resp;
}

async function settings() {
  const resp = await devices();
  const motors = resp.devices;
  const idx = motors.map((_, i) => i);
  const res = [];
  const urls = [
    URL + "/info?",
    URL + "/status?",
    URL + "/velocity?",
    URL + "/home?",
    URL + "/jog?",
    URL + "/genmove?",
    URL + "/relmove?",
    URL + "/absmove?",
    URL + "/position?",
  ];

  for (const i of idx) {
    const items = [];
    await urls.reduce(async (acc, url) => {
      return acc.then((j) => {
        return fetch(url + `device=${i}`, {
          method: "GET",
        })
          .then((result) => result.json())
          .then((data) => {
            items.push(data);
          });
      });
    }, Promise.resolve());
    res.push(items);
  }

  return res.map((items, j) => {
    return Object.fromEntries(
      items.map((item) => {
        if (item.msg === "hw_get_info") {
          return [
            item.msg,
            {
              ...item,
              name: motors[j].name,
              path: motors[j].path,
              hwid: motors[j].hwid,
            },
          ];
        }
        return [item.msg, item];
      })
    );
  });
}

async function put(path, values) {
  const resp = await fetch(URL + "/" + path, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
    .then((r) => r.json())
    .catch((e) => console.error(e));

  return resp;
}

export default {
  ping,
  home,
  devices,
  settings,
  put,
  sequencer,
  path_block,
  path_projector,
};
