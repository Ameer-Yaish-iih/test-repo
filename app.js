const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');

const app = express();
const PORT = 3000; // Port for the server
const printerIP = '192.168.20.5'; // Printer's IP address
const printerPort = 9100; // Printer's port (default: 9100)

// Middleware
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

// API Endpoint for sending print jobs
app.post('/print', (req, res) => {
    const printData = req.body.data;

    if (!printData) {
        return res.status(400).send('Error: No print data provided.');
    }

    const client = new net.Socket();

    client.connect(printerPort, printerIP, () => {
        console.log(`Connected to printer at ${printerIP}:${printerPort}`);
        client.write(printData, () => {
            console.log('Print data sent successfully');
            client.end(); // Close connection
        });
    });

    client.on('error', (error) => {
        console.error(`Error connecting to printer: ${error.message}`);
        res.status(500).send(`Error connecting to printer: ${error.message}`);
    });

    client.on('close', () => {
        console.log('Connection to printer closed');
        res.send('Print job sent successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    // Log the domain dynamically if available
    const domain = process.env.HOST || `http://localhost:${PORT}`;
    console.log(`Server is publicly accessible at ${domain}`);
});
