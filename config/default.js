module.exports = {
  port: 3004,
  swagger: {
    host: 'localhost:3004',
    schemes: ['http', 'https'],
  },
  routePrefix: '/akl-bot',
  fastifyOptions: {
    logger: false,
    ignoreTrailingSlash: true,
  },
  database: {
    mongo: {
      options: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
    },
  },
  maps: ['de_dust2', 'cs_office', 'de_cbble'],
};
