const eventRegexPairs = {
  connected: new RegExp(/"(?<user_name>.+)[<](?<user_id>\d+)[>][<](?<steam_id>.*)[>]<>" connected/gm),
  playerJoinTeam: new RegExp(/"(?<user_name>.+)[<](?<user_id>\d+)[>][<](?<steam_id>.*)[>]" switched from team [<](?<user_team>CT|TERRORIST|Unassigned|Spectator)[>] to [<](?<new_team>CT|TERRORIST|Unassigned|Spectator)[>]/gm),
  playerDisconnect: new RegExp(/"(?<user_name>.+)[<](?<user_id>\d+)[>][<](?<steam_id>.*)[>][<](?<user_team>CT|TERRORIST|Unassigned|Spectator)[>]" disconnected/gm),
  mapLoading: new RegExp(/Loading map "(?<map>.*?)"/gm),
  mapStarted: new RegExp(/Started map "(?<map>.*?)"/gm),
  mapEnding: new RegExp(/Game Over:.*score (?<ct_score>\d+):(?<t_score>\d+).*/gm),
  roundStart: new RegExp(/World triggered "Round_Start"/gm),
  roundEnd: new RegExp(/Team "(?<team>.*)" triggered "SFUI_Notice_(?<team_win>Terrorists_Win|CTs_Win|Target_Bombed|Target_Saved|Bomb_Defused)" \(CT "(?<ct_score>\d+)"\) \(T "(?<t_score>\d+)"\)/gm),
  chatCmd: new RegExp(/"(?<user_name>.+)[<](?<user_id>\d+)[>][<](?<steam_id>.*)[>][<](?<user_team>CT|TERRORIST|Unassigned|Spectator|Console)[>]" say(?<say_team>_team)? "[!\.](?<text>.*)"/gm),
};

const logParser = (log) => {
  const matchedEvents = [];
  Object.keys(eventRegexPairs).forEach((event) => {
    const re = eventRegexPairs[event];
    re.lastIndex = 0;
    const match = re.exec(log);
    if (match) {
      matchedEvents.push({ event, groups: match.groups });
    }
  });

  return matchedEvents;
};

module.exports = {
  logParser,
};
