// const config = require('config');
const { Server } = require('../../models');
const telegramBot = require('../telegram-bot');
const rcon = require('../rcon');
const log = require('../logger');
const utils = require('../utils');

const cmdAdmin = async (ip, port, username, message) => {
  try {
    await telegramBot.sendMsgFromServer(ip, port, username, message);
  } catch (error) {
    log.error('Error sending message to sever!', error);
  }
};

/**
 * FLOW:
 * 1. Pick random team to start picking and set it as currentPickBanSide
 * 2. Determine the pickban sequence by format (bo1 / bo3 / bo5)
 * 3. Determine maps by gamemode (5on5 / 2on2 / 1on1)
 * 4. Print options to players
 */
const cmdStart = async (ip, port, server) => {
  const { gameState } = server;
  if (!gameState.live && gameState.currentPicker === 'NONE') {
    const currentPicker = utils.getRandom(['CT', 'TERRORISTS']);

    try {
      await rcon.sendMessageToAll(ip, port, `\x10Starting map veto. All picks are final! ${currentPicker}, \x06!ban\x10 the first map. (\x06${gameState.mapPool}\x10)`);
    } catch (error) {
      log.error('Error when trying to send cmd to server! ', error);
      return;
    }

    let ser;
    try {
      ser = await Server.findOneAndUpdate({
        ip,
        port,
      }, {
        'gameState.currentPicker': currentPicker,
      });
    } catch (error) {
      log.error('Failed to update server data! ', error);
      return;
    }

    if (!ser) {
      console.log('???');
      return;
    }
  }
};

// const cmdPause = () => {

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
  const { ip, port } = server;

  switch (String(command)) {
    case 'admin':
      cmdAdmin(ip, port, username, extra);
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
      cmdStart(ip, port, server);
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
