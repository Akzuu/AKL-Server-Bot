const Rcon = require('rcon-srcds');
const config = require('config');

const RCON_PASSWORD = config.get('rconPassword');

const sendRconCmd = async (host, port, cmd) => {
  const server = new Rcon({ host, port });

  await server.authenticate(RCON_PASSWORD);

  server.execute(cmd);
};

module.exports = {
  sendRconCmd,
};
