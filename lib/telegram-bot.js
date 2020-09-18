process.env.NTBA_FIX_319 = 1;

const config = require('config');
const TelegramBot = require('node-telegram-bot-api');

const rcon = require('./rcon');

const TOKEN = config.get('telegramBotToken');
const ADMIN_CHAT_ID = config.get('adminChatId');

const bot = new TelegramBot(TOKEN, { polling: true });

const ipPortRegex = new RegExp(/(?<ip>\d+.\d+.\d+.\d+):(?<port>\d+)/);

// TODO: Make sure commands come from specific chat
const init = () => {
  bot.on('message', (msg) => {
    if (msg.reply_to_message && msg.reply_to_message.from.is_bot) {
      ipPortRegex.lastIndex = 0;

      const match = ipPortRegex.exec(msg.reply_to_message.text);
      rcon.sendRconCmd(match.groups.ip, match.groups.port, `say ${msg.text}`);
    }
  });
};

const sendMsgFromServer = async (serverIp, serverPort, sender, msg) => {
  await bot.sendMessage(ADMIN_CHAT_ID, `${serverIp}:${serverPort} > ${sender}: ${msg}`);
};

module.exports = {
  init,
  sendMsgFromServer,
};
