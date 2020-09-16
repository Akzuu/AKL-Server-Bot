const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  ip: {
    type: String,
    required: true,
  },
  port: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  serverID: {
    type: String,
    unique: true,
    required: true,
  },
  gameState: {
    clanNames: {
      terrorist: {
        type: String,
        default: 'TERRORIST',
      },
      ct: {
        type: String,
        default: 'COUNTER-TERRORIST',
      },
    },
    live: {
      type: Boolean,
      default: false,
    },
    currentMap: {
      type: String,
      default: 'de_dust2',
    },
    maps: [{
      type: String,
    }],
    mapPool: [{
      type: String,
    }],
    bannedMaps: [{
      type: String,
    }],
    pickedMaps: [{
      type: String,
    }],
    knife: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Number,
      default: 0,
      min: 0,
    },
    paused: {
      type: Boolean,
      default: false,
    },
    freezed: {
      type: Boolean,
      default: false,
    },
    unpause: {
      terrorist: {
        type: Boolean,
        default: false,
      },
      ct: {
        type: Boolean,
        default: false,
      },
    },
    ready: {
      terrorist: {
        type: Boolean,
        default: false,
      },
      ct: {
        type: Boolean,
        default: false,
      },
    },
    players: [{
      steamID64: {
        type: String,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    }],
    format: {
      type: String,
      enum: ['bo1', 'bo3', 'bo5'],
      default: 'bo1',
    },
    gameMode: {
      type: String,
      enum: ['5on5', '2on2', '1on1'],
      default: '5on5',
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('servers', schema);
