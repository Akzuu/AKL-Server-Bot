const rcon = require('../rcon');
const rconCmds = require('../rcon-commands');
const { Server } = require('../../models');

const roundEnd = async (server, team, winnerTeam, ctScore, tScore) => {
  const { ip, port, gameState } = server;

  // Check if round was knife round
  if (gameState.knife) {
    await rcon.sendRconCmd(ip, port, rconCmds.KNIFE_WON);
    await rcon.sendMessageToAll(ip, port, ` \x06${winnerTeam} \x10won the knife round! \x10Do you want to \x06!stay\x10 or \x06!swap\x10?`);

    const ser = await Server.findOneAndUpdate({
      ip,
      port,
    }, {
      $set: { 'gameState.knife': false, 'gameState.knifeWinner': winnerTeam },
    });

    if (!ser) {
      await rcon.sendMessageToAll(ip, port, ' \x10Something really fucked up is going on. Use !admin to get help');
    }
    return;
  }

  console.log(team, winnerTeam, ctScore, tScore);
};

module.exports = {
  roundEnd,
};
