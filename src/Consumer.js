require('dotenv').config();
const amqp = require('amqplib');
const PlaylistsService = require('./PlaylistsService');
const MailSender = require('./MailSender');
const ExportsListener = require('./ExportsListener');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new ExportsListener(playlistsService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);

  const channel = await connection.createChannel();
  await channel.assertQueue('exports:playlist', {
    durable: true,
  });

  channel.consume('exports:playlist', listener.listen, { noAck: true });
};

init();
