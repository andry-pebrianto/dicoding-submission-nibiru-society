/* istanbul ignore file */
const TokenJwtTestHelper = {
  async getAccessToken(server) {
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      },
    });

    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: "dicoding",
        password: "secret",
      },
    });
    const { accessToken } = JSON.parse(response.payload).data;
    return accessToken;
  },
};

module.exports = TokenJwtTestHelper;
