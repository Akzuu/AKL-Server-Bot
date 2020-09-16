const { rcon, log } = require('../../lib');

const schema = {
  description: 'Send cmd to server',
  summary: 'Send cmd',
  tags: ['Server'],
  body: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
        },
      },
    },
  },
};

const handler = async (req, reply) => {
  try {
    await rcon.sendRconCmd('0.0.0.0', '27015', req.body.command);
  } catch (error) {
    log.error('Error sending command!', error);
    reply.status(500).send({
      status: 'ERROR',
      error: 'Internal Server Error',
    });
    return;
  }

  reply.send({
    status: 'OK',
  });
};

module.exports = async function (fastify) {
  fastify.route({
    method: 'POST',
    url: '/cmd',
    handler,
    schema,
  });
};
