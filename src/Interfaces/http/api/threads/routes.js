const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'nibirusociety_jwt_auth',
    },
  },
]);

module.exports = routes;
