const config = require('config');
const { Server } = require('../models');
const { logParser } = require('./log-parser');
const { chatCmdHandler, roundEnd } = require('./events');
const log = require('./logger');

const SERVER_PASSWORD = config.get('serverPassword');
const MAPS = config.get('maps');

// TODO: Rename this to eventhandler
const commandHandler = async (ip, port, logs) => {
  // Figure out if this is a new server
  let server;
  try {
    server = await Server.findOne({
      ip,
      port,
    });
  } catch (error) {
    log.error('Finding server failed! ', error);
    return;
  }

  if (!server) {
    try {
      server = await Server.create({
        ip,
        port,
        password: SERVER_PASSWORD,
        gameState: {
          mapPool: MAPS,
        },
      });
    } catch (error) {
      log.error('Creating server failed! ', error);
      return;
    }
  }

  const commands = logParser(logs);
  commands.forEach((cmd) => {
    switch (cmd.event) {
      case 'connected':
        break;
      case 'playerJoinTeam':
        break;
      case 'playerDisconnect':
        break;
      case 'mapLoading':
        break;
      case 'mapStarted':
        break;
      case 'mapEnding':
        break;
      case 'roundStart':
        break;
      case 'roundEnd':
        try {
          roundEnd(server, cmd.groups.team, cmd.groups.team_win,
            cmd.groups.ct_score, cmd.groups.t_score);
        } catch (error) {
          log.error('Handling round end event failed! ', error);
          return;
        }
        break;
      case 'chatCmd':
        try {
          chatCmdHandler(server, cmd.groups.user_name, cmd.groups.user_id,
            cmd.groups.steam_id, cmd.groups.user_team, cmd.groups.say_team,
            cmd.groups.text);
        } catch (error) {
          log.error('Handling chat event failed! ', error);
          return;
        }
        break;
      default:
        break;
    }
  });
};

module.exports = commandHandler;
