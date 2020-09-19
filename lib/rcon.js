const Rcon = require('rcon-srcds');
const config = require('config');

const RCON_PASSWORD = config.get('rconPassword');

const authenticateWithServer = async (host, port) => {
  const server = new Rcon({ host, port });

  await server.authenticate(RCON_PASSWORD);

  return server;
};

const sendRconCmd = async (host, port, cmd) => {
  const server = await authenticateWithServer(host, port);

  server.execute(cmd);
};

const sendMessageToAll = async (host, port, message) => {
  const server = await authenticateWithServer(host, port);

  server.execute(`script ScriptPrintMessageChatAll("${message}")`);
};

module.exports = {
  sendRconCmd,
  sendMessageToAll,
};
