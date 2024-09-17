import net from "net";
import dgram from "dgram";
import { strict as assert } from "assert";
import makeRequest from "../../src/actions/network.mjs"; // Adjust the path to the makeRequest module
import { describe, it, after } from "node:test";
import {ACTIONS, ACTIONS_STATUSES} from '../../src/utils/const.mjs'

const tcpPort = 12346;
const udpPort = 54322;
const host = "127.0.0.1";
const message = "Hello, Test!";

// Create a simple TCP server for testing
function createTcpServer(port) {
  const server = net.createServer((socket) => {
    socket.on("data", (data) => {
      socket.write(`Received: ${data}`);
      socket.end();
    });
  });
  server.listen(port, "127.0.0.1");
  return server;
}

// Create a simple UDP server for testing
function createUdpServer(port) {
  const server = dgram.createSocket("udp4");
  server.on("message", (msg, rinfo) => {
    console.log(`Received ${msg} from ${rinfo.address}:${rinfo.port}`);
    server.send(`Received: ${msg}`, rinfo.port, rinfo.address);
  });
  server.bind(port);
  return server;
}

describe("TCP network request", async () => {
  const tcpServer = createTcpServer(tcpPort);

  after(() => {
    tcpServer.close();
  });

  it("successfully makes request", async () => {
    const tcpOptions = { protocol: "TCP", host, port: tcpPort, message };
    const result = await makeRequest(tcpOptions);

    assert.equal(result.action, ACTIONS.networkRequest);
    assert.equal(result.status, ACTIONS_STATUSES.success);
    assert.ok(typeof result.timestamp === 'string');
    assert.equal(result.protocol, 'TCP');
    assert.equal(result.destinationAddress, host);
    assert.equal(result.destinationPort, tcpPort);
    
    assert.equal(result.sourceAddress, '127.0.0.1'); 
    assert.ok(typeof result.sourcePort === 'number'); 
    assert.equal(result.bytesSent, 12); 
    assert.ok(typeof result.username === 'string');
    assert.ok(typeof result.execPath === 'string');
    assert.ok(typeof result.processId === 'number');
    assert.equal(result.errorMessage, undefined); 
  });
});

describe("UDP network request", async () => {
    const udpServer = createUdpServer(udpPort);
    // const tcpServer = createTcpServer(tcpPort);
  
    after(() => {
    //   tcpServer.close();
      udpServer.close();
    });
  
    it("successfully makes request", async () => {
      const tcpOptions = { protocol: "UDP", host, port: udpPort, message };
      const result = await makeRequest(tcpOptions);
  
      assert.equal(result.action, ACTIONS.networkRequest);
      assert.equal(result.status, ACTIONS_STATUSES.success);
      assert.ok(typeof result.timestamp === 'string');
      assert.equal(result.protocol, 'UDP');
      assert.equal(result.destinationAddress, host);
      assert.equal(result.destinationPort, udpPort);
      
      assert.equal(result.sourceAddress, '0.0.0.0'); 
      assert.ok(typeof result.sourcePort === 'number'); 
      assert.equal(result.bytesSent, 12); 
      assert.ok(typeof result.username === 'string');
      assert.ok(typeof result.execPath === 'string');
      assert.ok(typeof result.processId === 'number');
      assert.equal(result.errorMessage, undefined); 
    });
  });