module.exports = {
  START_KNIFE_ROUND: 'mp_unpause_match;mp_warmup_pausetimer 0;mp_warmuptime 6;mp_warmup_start;mp_maxmoney 0;mp_t_default_secondary "";mp_ct_default_secondary "";mp_free_armor 1;mp_give_player_c4 0;log on;tv_stoprecord;tv_record "{0}";script ScriptPrintMessageChatAll(" \x10Both teams are \x06!ready\x10, starting knife round!");',
  START_MATCH: 'mp_maxmoney 16000;mp_unpause_match;mp_warmup_pausetimer 0;mp_warmuptime 6;mp_warmup_start;log on;tv_stoprecord;tv_record "{0}";script ScriptPrintMessageChatAll(" \x10Both teams are \x06!ready\x10, starting match!");',
  KNIFE_STARTED: 'script ScriptPrintMessageChatAll(" \x10Knife round started! GL HF!")',
  KNIFE_WON:
  'mp_pause_match;mp_maxmoney 16000;mp_t_default_secondary "weapon_glock";mp_ct_default_secondary "weapon_hkp2000";mp_free_armor 0;mp_give_player_c4 1;)',
  KNIFE_STAY: 'mp_unpause_match;mp_restartgame 1;script ScriptPrintMessageChatAll(" \x10Match started! GL HF!")',
  KNIFE_SWAP: 'mp_unpause_match;mp_swapteams;script ScriptPrintMessageChatAll(" \x10Match started! GL HF!")',

};
