const { commandHandler } = require('../../lib');

const schema = {
  description: 'Server logs will be sent to this addr',
  summary: 'Server logs',
  tags: ['Server'],
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
  commandHandler(req.ip, req.headers['x-server-addr'].split(':')[1], req.body);

  reply.send({
    status: 'OK',
  });
};

module.exports = async function (fastify) {
  fastify.route({
    method: 'POST',
    url: '/log',
    handler,
    schema,
  });
};
