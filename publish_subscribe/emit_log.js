const amqplib = require('amqplib');

const exchangeName = "logs";
const msg = process.argv.slice(2).join(' ') || "Publish_Subscribe";

const sendMsg = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'fanout', { durable: false }); // check if exchangeName exists or not
    channel.publish(exchangeName, '', Buffer.from(msg));
    console.log('sent', msg);
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 1000);
}

sendMsg();