const config = require('config');
const { Server } = require('../models');
const { logParser } = require('./log-parser');
const { chatCmdHandler } = require('./events');

const SERVER_PASSWORD = config.get('serverPassword');

const commandHandler = async (ip, port, log) => {
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
      });
    } catch (error) {
      log.error('Creating server failed! ', error);
      return;
    }
  }

  const commands = logParser(log);
  commands.forEach((cmd) => {
    switch (cmd.event) {
      case 'connected':
        break;
      case 'playerJoinTeam':
        break;
      case 'playerDiscconect':
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
        break;
      case 'chatCmd':
        chatCmdHandler(server, cmd.groups.user_name, cmd.groups.user_id,
          cmd.groups.steam_id, cmd.groups.user_team, cmd.groups.say_team,
          cmd.groups.text);
        break;
      default:
        break;
    }
  });
};

module.exports = commandHandler;
