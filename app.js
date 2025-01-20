const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Use dynamic port for deployment

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Endpoint for sending print jobs
app.post('/print', (req, res) => {
    //const printData = req.body.data;
    const printData = '\x1B\x40' + // Initialize
    'Hello, World!\x0A' + // Print "Hello, World!" and new line
    '\x1B\x64\x02' + // Feed paper by 2 lines
    '\x1D\x56\x41';  // Cut paper

    if (!printData) {
        return res.status(400).send('Error: No print data provided.');
    }

    const client = new net.Socket();

    // Track if a response has been sent
    let responseSent = false;

    client.connect(9100, '192.168.20.5', () => {
        console.log(`Connected to printer`);
        client.write(printData, () => {
            console.log('Print data sent successfully');
            client.end();
        });
    });

    client.on('error', (error) => {
        console.error(`Error connecting to printer: ${error.message}`);
        if (!responseSent) {
            responseSent = true;
            res.status(500).send(`Error connecting to printer: ${error.message}`);
        }
    });

    client.on('close', () => {
        console.log('Connection to printer closed');
        if (!responseSent) {
            responseSent = true;
            res.send('Print job sent successfully!');
        }
    });
});

// Example route to log hostname dynamically
app.get('/', (req, res) => {
    const hostname = req.get('host'); // Get the hostname from the request
    console.log(`Request received on hostname: ${hostname}`);
    res.send(`Server is running on hostname: ${hostname}`);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
