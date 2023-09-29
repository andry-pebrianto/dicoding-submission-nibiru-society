/* istanbul ignore file */
const TokenJwtTestHelper = {
  async getAccessToken(server, { username = "dicoding", password = "secret" }) {
    await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username,
        password,
        fullname: "Dicoding Indonesia",
      },
    });

    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username,
        password,
      },
    });
    const { accessToken } = JSON.parse(response.payload).data;
    return accessToken;
  },
};

module.exports = TokenJwtTestHelper;
