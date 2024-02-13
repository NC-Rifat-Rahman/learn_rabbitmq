const amqplib = require('amqplib');

const queueName = "task";

const consumeTask = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1) /// do not send another message until the previous message is processed and acknowldeged
    console.log(`Waiting for messages in queue:${queueName}`);
    channel.consume(queueName, msg => {
        const secs = msg.content.toString().split('.').length - 1;
        console.log("[X] Received:", msg.content.toString());
        setTimeout(() => {
            console.log("Done Resizing Image");
            channel.ack(msg); /// acknowledge the message after the task is done
        }, secs * 1000);
    }, { noAck: false }); /// set false to avoid automatic acknowledgement
}

consumeTask();