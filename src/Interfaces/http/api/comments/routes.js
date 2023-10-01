const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.postCommentHandler,
    options: {
      auth: "nibirusociety_jwt_auth",
    },
  },
];

module.exports = routes;
