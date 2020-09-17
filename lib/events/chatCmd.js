const telegramBot = require('../telegram-bot');
const log = require('../logger');

const cmdAdmin = async (ip, port, username, message) => {
  try {
    await telegramBot.sendMsgFromServer(ip, port, username, message);
  } catch (error) {
    log.error('Error sending message to sever!', error);
  }
};

// const cmdPause = () => {

// };

// const cmdStart = () => {

// };

// const cmdPick = () => {

// };

// const cmdBan = () => {

// };

// const cmdTacticalTimeout = () => {

// };

// const cmdRestore = () => {

// };

// const cmdStatus = () => {

// };

// const cmdReset = () => {

// };

// const cmdForceStart = () => {

// };

// const cmdReady = () => {

// };

// const cmdStay = () => {

// };

// const cmdSwap = () => {

// };

// const cmdForceQuitBot = () => {

// };

// const cmdChangeFormat = () => {

// };

// const cmdChangeBo = () => {

// };

const chatCmdHandler = async (server, username, userId, steamId, team, sayTeam, message) => {
  const [command, extra] = message.split(' ');
  switch (String(command)) {
    case 'admin':
      cmdAdmin(server.ip, server.port, username, extra);
      break;
    case 'restore':
    case 'replay':
      break;
    case 'status':
    case 'stats':
    case 'score':
    case 'scores':
      break;
    case 'restart':
    case 'reset':
    case 'warmup':
      break;
    case 'maps':
    case 'map':
    case 'start':
    case 'match':
    case 'startmatch':
      break;
    case 'force':
      break;
    case 'resume':
    case 'ready':
    case 'rdy':
    case 'unpause':
      break;
    case 'pause':
      break;
    case 'stay':
      break;
    case 'swap':
    case 'switch':
      break;
    case 'knife':
      break;
    case 'disconnect':
    case 'quit':
    case 'leave':
      break;
    case 'say':
      break;
    case 'whitelist':
      break;
    case 'debug':
      break;
    case 'ban':
      break;
    case 'pick':
      break;
    case 'bo1':
      break;
    case 'bo3':
      break;
    case 'matchformat':
      break;
    case 'team':
      break;
    default:
      break;
  }
};

module.exports = {
  chatCmdHandler,
};
