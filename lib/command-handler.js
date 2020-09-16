const { logParser } = require('./log-parser');

const commandHandler = async (ip, port, log) => {
  const commands = logParser(log);

  console.log(commands);
};

module.exports = commandHandler;
