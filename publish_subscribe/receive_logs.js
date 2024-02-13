const amqplib = require('amqplib');

const exchangeName = "logs";
const message = process.argv.slice(2).join(' ') || "Hello World";

const reveiveMsg = async () => {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, 'fanout', { durable: false });
    const q = await channel.assertQueue('', { exclusive: true }); // once connection closes delete the queue
    console.log('Waiting for messages in queue ', q.queue);
    channel.bindQueue(q.queue, exchangeName, '');
    channel.consume(q.queue, message => {
        if (message.content)
            console.log("The message is: ", message.content.toString());
    }, { noAck: true })

}

reveiveMsg();