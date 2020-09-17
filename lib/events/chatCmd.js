const cmdAdmin = () => {

};

const cmdPause = () => {

};

const cmdStart = () => {

};

const cmdPick = () => {

};

const cmdBan = () => {

};

const cmdTacticalTimeout = () => {

};

const cmdRestore = () => {

};

const cmdStatus = () => {

};

const cmdReset = () => {

};

const cmdForceStart = () => {

};

const cmdReady = () => {

};

const cmdStay = () => {

};

const cmdSwap = () => {

};

const cmdForceQuitBot = () => {

};

const cmdChangeFormat = () => {

};

const cmdChangeBo = () => {

};

const chatCmdHandler = async (username, userId, steamId, team, command) => {
  switch (String(command)) {
    case 'admin':
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
