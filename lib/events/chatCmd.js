// const config = require('config');
const { Server } = require('../../models');
const telegramBot = require('../telegram-bot');
const rcon = require('../rcon');
const log = require('../logger');
const utils = require('../utils');
const rconCmds = require('../rcon-commands');

const cmdAdmin = async (ip, port, username, message) => {
  try {
    await telegramBot.sendMsgFromServer(ip, port, username, message);
  } catch (error) {
    log.error('Error sending message to sever!', error);
  }
};

/**
 * WHAT: Start pick ban sequence
 * FLOW:
 * 1. Pick random team to start picking and set it as currentPickBanSide
 * 2. Print options to players
 */
const cmdStart = async (ip, port, gameState) => {
  if (!gameState.live && gameState.currentPicker === 'NONE') {
    const currentPicker = utils.getRandom(['CT', 'TERRORIST']);

    try {
      await rcon.sendMessageToAll(ip, port, ` \x10Starting map veto. All picks are final! ${currentPicker}, \x06!ban\x10 the first map. (\x06${gameState.mapPool}\x10)`);
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
      try {
        await rcon.sendMessageToAll(ip, port, ' \x10Something went wrong, contact admin via !admin command!');
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
        return;
      }
    }
  } else {
    try {
      await rcon.sendMessageToAll(ip, port, ' \x10Can not use start when maps have been picked! Use !ready to start match or !admin for help!');
    } catch (error) {
      log.error('Error when trying to send cmd to server! ', error);
    }
  }
};

/**
 * WHAT: Pick maps to be played
 * FLOW:
 * 1. Check if game is live (It must not be)
 * 2. Make sure its teams turn to pick
 * 3. Make sure its time to pick (and not to ban)
 * 3.1 Pick sequence must be determined from map pool, picked maps,
 *     banned maps, gamemode and game format
 * 4. Send error msg to server if users try to do something stupid
 * 5. Make sure picked map is in map pool
 * 6. Remove map from map pool and move it to pickedMaps
 */
const cmdPick = async (ip, port, gameState, team, map) => {
  if (!gameState.live && gameState.currentPicker !== 'NONE') {
    if (gameState.currentPicker !== team) {
      rcon.sendMessageToAll(ip, port, ` \x10It's not your turn, ${team}!`);
      return;
    }

    // Bo3 & Bo5 logic here
  }
};

/**
 * WHAT: Ban maps from map pool
 * FLOW:
 * 1. Check if game is live (It must not be)
 * 2. Make sure its teams turn to ban
 * 3. Make sure its time to ban (and not to pick)
 * 3.1 Pick sequence must be determined from map pool, picked maps,
 *     banned maps, gamemode and game format
 * 4. Send error msg to server if users try to do something stupid
 * 5. Make sure banned map is in map pool
 * 6. Remove map from map pool and move it to bannedMaps
 */
const cmdBan = async (ip, port, gameState, team, map) => {
  if (!gameState.live && gameState.currentPicker !== 'NONE') {
    if (gameState.currentPicker !== team) {
      try {
        await rcon.sendMessageToAll(ip, port, ` \x10It's not your turn, ${team}!`);
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
      }
      return;
    }

    if (!map) {
      try {
        await rcon.sendMessageToAll(ip, port, ' \x10What map would you like to ban? Commmand usage !ban MAP_NAME_HERE');
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
      }
      return;
    }

    if (!gameState.mapPool.includes(map)) {
      try {
        await rcon.sendMessageToAll(ip, port, ' \x10Map not bannable!');
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
      }
      return;
    }

    const updatePayload = {
      $pull: {},
      $push: {},
      $set: {},
    };

    let nextMove;
    if (gameState.format === 'bo1') {
      updatePayload.$push['gameState.bannedMaps'] = map;
      nextMove = 'ban';
    } else if (gameState.format === 'bo3') {
      // LOGIC
    } else if (gameState.format === 'bo5') {
      // LOGIC
    }

    updatePayload.$pull['gameState.mapPool'] = map;
    updatePayload.$set['gameState.currentPicker'] = gameState.currentPicker === 'CT' ? 'TERRORIST' : 'CT';

    let lastPickedMap;
    if (gameState.mapPool.length === 2) {
      // eslint-disable-next-line prefer-destructuring
      lastPickedMap = gameState.mapPool.filter((elem) => elem !== map)[0];
      updatePayload.$push['gameState.pickedMaps'] = lastPickedMap;
      updatePayload.$set['gameState.currentPicker'] = 'MAPS_PICKED';

      const maps = gameState.pickedMaps;
      maps.push(lastPickedMap);
      updatePayload.$set['gameState.maps'] = maps;
    }

    let ser;
    try {
      ser = await Server.findOneAndUpdate({
        ip,
        port,
      }, updatePayload, {
        new: true,
      });
    } catch (error) {
      log.error('Failed to update server data! ', error);
      return;
    }

    if (!ser) {
      try {
        await rcon.sendMessageToAll(ip, port, ' \x10Something went wrong, contact admin via !admin command!');
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
        return;
      }
    }

    // Start the match
    if (lastPickedMap) {
      try {
        await rcon.sendMessageToAll(ip, port, ` \x10Starting the match! Next map: ${lastPickedMap}. Maps picked: ${ser.gameState.pickedMaps}`);
        setTimeout(async () => {
          await rcon.sendRconCmd(ip, port, `changeLevel ${ser.gameState.pickedMaps[0]}`);
        }, 5000);
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
      }
    } else {
      try {
        await rcon.sendMessageToAll(ip, port, ` \x10${map} banned. ${ser.gameState.currentPicker}, it\'s your turn to ${nextMove} a map!`);
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
      }
    }
  }
};

/**
 * WHAT: Ready to start match. When both are ready, start match
 * FLOW:
 * 1. Check if !ready can be used (game has not started)
 * 2. Set team ready in database
 * 3. Check if both teams are ready and start match if so!
 */
const cmdReady = async (ip, port, gameState, team) => {
  if (!gameState.live) {
    if (gameState.ready[team.toLowerCase()]) {
      try {
        await rcon.sendMessageToAll(ip, port, ` \x10${team} ready to rock\'n roll!`);
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
      }
      return;
    }

    let updatePayload;
    let startMatch = false;
    if (team === 'CT') {
      if (gameState.ready.terrorist) {
        startMatch = true;
      } else {
        updatePayload = {
          $set: { 'gameState.ready.ct': true },
        };
      }
    } else if (team === 'TERRORIST') {
      if (gameState.ready.ct) {
        startMatch = true;
      } else {
        updatePayload = {
          $set: { 'gameState.ready.terrorist': true },
        };
      }
    }

    if (startMatch) {
      updatePayload = {
        $set: {
          'gameState.ready.ct': false,
          'gameState.ready.terrorist': false,
          'gameState.live': true,
        },
      };

      // Last map, set knife true
      if (gameState.maps.length === 1) {
        updatePayload.$set['gameState.knife'] = true;
      }
    }

    let ser;
    try {
      ser = await Server.findOneAndUpdate({
        ip,
        port,
      }, updatePayload, {
        new: true,
      });
    } catch (error) {
      log.error('Failed to update server data! ', error);
      return;
    }

    if (!ser) {
      try {
        await rcon.sendMessageToAll(ip, port, ' \x10Something went wrong, contact admin via !admin command!');
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
        return;
      }
    }

    if (startMatch) {
      // Run RCON commands to start match
      if (ser.gameState.knife) {
        try {
          await rcon.sendRconCmd(ip, port, rconCmds.START_KNIFE_ROUND);
        } catch (error) {
          log.error('Error when trying to send cmd to server! ', error);
          return;
        }
      } else {
        try {
          await rcon.sendRconCmd(ip, port, rconCmds.START_MATCH);
        } catch (error) {
          log.error('Error when trying to send cmd to server! ', error);
          return;
        }
      }
    } else {
      try {
        await rcon.sendMessageToAll(ip, port, ` \x10${team} is ready. Waiting for opponent to be ready...`);
      } catch (error) {
        log.error('Error when trying to send cmd to server! ', error);
      }
    }
  } else {
    try {
      await rcon.sendMessageToAll(ip, port, ' \x10Forgetting something? Game is not in a state where the command ready could be used!');
    } catch (error) {
      log.error('Error when trying to send cmd to server! ', error);
    }
  }
};

/**
 * WHAT: Technical pause. Set game to paused and continnue when both teams say !ready
 * FLOW:
 * 1. Check if game is live (it must be)
 * 2. Set server gameState to paused (paused: true, unpause both team false)
 * 3. Run RCON commands to set pause ingame
 * 4. Print message to player that game is set to pause on next freezetime (when round ends)
 * 5. Print message about !admin help command
 */
// const cmdPause = () => {

// };

/**
 * WHAT: Give players ability to take tactical timeout for 60 seconds
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdTacticalTimeout = () => {

// };

/**
 * WHAT: Restore previous round if smth fucks up
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdRestore = () => {

// };

/**
 * WHAT: Print status of server to game (stats etc)
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdStatus = () => {

// };

/**
 * WHAT: Reset gameState to default. Can be used when server is not live e.g. during pickban
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdReset = () => {

// };

/**
 * WHAT: Force starting game. Must be admin
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdForceStart = () => {

// };

/**
 * WHAT: After knife round, winner chooses if team wants to stay or change side
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdStay = () => {

// };

/**
 * WHAT: After knife round, winner chooses if team wants to stay or change side
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdSwap = () => {

// };

/**
 * WHAT: Make bot quit from the server. Probably will not be implemented
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdForceQuitBot = () => {

// };

/**
 * WHAT: Change gameformat to something else
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdChangeFormat = () => {

// };

/**
 * WHAT: Change best of
 * FLOW:
 * TO BE DETERMINED
 */
// const cmdChangeBo = () => {

// };

const chatCmdHandler = async (server, username, userId, steamId, team, sayTeam, message) => {
  const [command, extra] = message.split(' ');
  const { ip, port, gameState } = server;

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
      cmdStart(ip, port, gameState);
      break;
    case 'force':
      break;
    case 'resume':
    case 'ready':
    case 'rdy':
    case 'unpause':
      cmdReady(ip, port, gameState, team);
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
      cmdBan(ip, port, gameState, team, extra);
      break;
    case 'pick':
      cmdPick(ip, port, gameState, team, extra);
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
