const net = require('net');

exports.handler = async (event, context) => {
    try {
        // Parse the POST data
        const body = JSON.parse(event.body);
        const printData = body.data;
        console.log(printData);
        return {
            statusCode: 500,
            body: printData,
        };
        if (!printData) {
            return {
                statusCode: 400,
                body: 'Error: No print data provided.',
            };
        }

        const printerIP = '192.168.20.5';
        const printerPort = 9100;

        // Connect to the printer
        return new Promise((resolve, reject) => {
            const client = new net.Socket();

            client.connect(printerPort, printerIP, () => {
                console.log(`Connected to printer`);
                client.write(printData, () => {
                    console.log('Print data sent successfully');
                    client.end();
                    resolve({
                        statusCode: 200,
                        body: 'Print job sent successfully!',
                    });
                });
            });

            client.on('error', (error) => {
                console.error(`Error connecting to printer: ${error.message}`);
                reject({
                    statusCode: 500,
                    body: `Error connecting to printer: ${error.message}`,
                });
            });

            client.on('close', () => {
                console.log('Connection to printer closed');
            });
        });
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: 'Internal server error',
        };
    }
};
