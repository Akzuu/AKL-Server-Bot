const config = require('config');

const fastify = require('fastify');
const fastifySwagger = require('fastify-swagger');
const fastifyHelmet = require('fastify-helmet');
const routes = require('./routes');

const APPLICATION_PORT = config.get('port');
const ROUTE_PREFIX = config.get('routePrefix');
const FASTIFY_OPTIONS = config.get('fastifyOptions');

// Initialize swagger
const initSwagger = () => {
  const swaggerOptions = config.get('swagger');

  return {
    routePrefix: `${ROUTE_PREFIX}/documentation`,
    swagger: {
      info: {
        title: '',
        description: '',
        version: '1.0.0',
      },
      host: swaggerOptions.host,
      schemes: swaggerOptions.schemes,
      securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        {
          name: 'Server',
          description: '...',
        }, {
          name: 'Utility',
          description: 'Utility endpoints',
        },
      ],
    },
    exposeRoute: true,
  };
};

// Routes
const serverRoute = async (server) => {
  Object.keys(routes.server).forEach((key) => {
    routes.server[key](server);
  });
};

const utilityRoute = async (server) => {
  Object.keys(routes.utility).forEach((key) => {
    routes.utility[key](server);
  });
};

/**
 * Init server
 * @param {Object} options Optional.
 */
const initServer = async () => {
  const server = fastify({
    logger: FASTIFY_OPTIONS.logger,
    ignoreTrailingSlash: FASTIFY_OPTIONS.ignoreTrailingSlash,
    ajv: {
      customOptions: {
        removeAdditional: 'all', // Remove additional params from the body etc
      },
    },
  });

  // Register plugins and routes
  server
    .register(fastifySwagger, initSwagger())
    .register(fastifyHelmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ['\'self\''],
          styleSrc: ['\'self\'', '\'unsafe-inline\''],
          imgSrc: ['\'self\'', 'data:', 'validator.swagger.io'],
          scriptSrc: ['\'self\'', 'https: \'unsafe-inline\''],
        },
      },
    })
    .register(serverRoute, { prefix: `${ROUTE_PREFIX}/server` })
    .register(utilityRoute, { prefix: `${ROUTE_PREFIX}/utility` });

  return {
    start: async () => {
      await server.listen(APPLICATION_PORT, '0.0.0.0');
      return server;
    },
  };
};

module.exports = {
  initServer,
};
