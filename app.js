const express = require('express');
const bodyParser = require('body-parser');
const net = require('net');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Use dynamic port for deployment

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API Endpoint for sending print jobs
app.post('/print', (req, res) => {
    const printData = req.body.data;

    if (!printData) {
        return res.status(400).send('Error: No print data provided.');
    }

    const client = new net.Socket();

    client.connect(9100, '192.168.20.5', () => {
        console.log(`Connected to printer`);
        client.write(printData, () => {
            console.log('Print data sent successfully');
            client.end();
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