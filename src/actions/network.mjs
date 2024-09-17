import net from "net";
import dgram from "dgram";
import os from "os";
import { ACTIONS, ACTIONS_STATUSES } from "../utils/const.mjs";

export default async function makeRequest(options) {
  const { protocol } = options;
  let results = {};

  try {
    if (protocol === "TCP") {
      results = await initiateTcpRequest(options);
    } else if (protocol === "UDP") {
      results = await initiateUdpRequest(options);
    } else {
      throw new Error("invalid protocol");
    }
  } catch (error) {
    results = makeResults({ ...options, error });
  }

  return results;
}

function makeResults({
  protocol,
  host,
  port,
  message,
  error,
  sourcePort,
  sourceAddress,
  timestamp,
}) {

  let status = error ? ACTIONS_STATUSES.fail : ACTIONS_STATUSES.success;

  return {
    action: ACTIONS.networkRequest,
    status,
    timestamp,
    protocol,
    destinationAddress: host,
    destinationPort: port,
    sourceAddress,
    sourcePort,
    bytesSent: Buffer.byteLength(message, "utf8"),
    username: os.userInfo().username,
    execPath: process.execPath,
    processId: process.pid,
    errorMessage: error?.message,
  };
}


function initiateTcpRequest(options) {
  const { host, port, message } = options;
  return new Promise((resolve, reject) => {
    let timestamp = new Date().toISOString();
    let sourceAddress = "";
    let sourcePort = 0;
    let error = null

    const client = new net.Socket();

    client.connect(port, host, () => {

      // Capture source host and port after connection is established
      sourceAddress = client.localAddress;
      sourcePort = client.localPort;

      client.write(message);
    });

    client.on("data", () => {
      client.end();
    });

    client.on("close", () => {
      resolve(
        makeResults({ ...options, sourceAddress, sourcePort, timestamp, error })
      );
    });

    client.on("error", (e) => {
      error = e
    });
  });
}

function initiateUdpRequest(options) {
  const { host, port, message } = options;

  // This only get resolved due to the nature of UDP
  return new Promise((resolve) => {

    let timestamp = new Date().toISOString();
    let sourceAddress = "";
    let sourcePort = 0;

    const udpClient = dgram.createSocket("udp4");

    udpClient.on("listening", () => {
      const hostInfo = udpClient.address();
      sourceAddress = hostInfo.address;
      sourcePort = hostInfo.port;

      udpClient.send(message, port, host, (error) => {
        if (error) {
          resolve(
            makeResults({ ...options, sourceAddress, sourcePort, timestamp, error })
          );
        }
        udpClient.close();
      });
    });

    udpClient.on("close", () => {
      resolve(
        makeResults({ ...options, sourceAddress, sourcePort, timestamp })
      );
    });

    udpClient.on("error", (error) => {
      resolve(
        makeResults({ ...options, sourceAddress, sourcePort, timestamp, error })
      );
    });

    udpClient.bind(); // Bind to a random port to enable listening
  });
}
