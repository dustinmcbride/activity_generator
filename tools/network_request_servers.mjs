import net from 'net';
import dgram from 'dgram';

// TCP Server
const tcpPort = 12345;
const tcpServer = net.createServer((socket) => {
    console.log('New TCP connection established.');

    socket.on('data', (data) => {
        console.log('Received TCP data:', data.toString());
        // Echo the data back to the client
        socket.write(`TCP Server received: ${data}`);
    });

    socket.on('end', () => {
        console.log('TCP client disconnected.');
    });

    socket.on('error', (err) => {
        console.error('TCP Error:', err);
    });
});

tcpServer.listen(tcpPort, () => {
    console.log(`TCP Server is listening on port ${tcpPort}`);
});

// UDP Server
const udpPort = 54321;
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
    console.log(`Received UDP message from ${rinfo.address}:${rinfo.port} - ${msg}`);
    // Echo the message back to the sender
    udpServer.send(`UDP Server received: ${msg}`, rinfo.port, rinfo.address, (err) => {
        if (err) console.error('UDP Error:', err);
    });
});

udpServer.on('error', (err) => {
    console.error('UDP Error:', err);
    udpServer.close();
});

udpServer.bind(udpPort, () => {
    console.log(`UDP Server is listening on port ${udpPort}`);
});
