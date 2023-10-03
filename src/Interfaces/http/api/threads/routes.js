const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadHandler,
    options: {
      auth: "nibirusociety_jwt_auth",
    },
  },
  {
    method: "GET",
    path: "/threads/{id}",
    handler: handler.getThreadByIdHandler,
  },
];

module.exports = routes;
