/* istanbul ignore file */
const TokenJwtTestHelper = {
  async getAccessToken(
    server,
    { username = "dicoding", password = "secret" },
    alsoReturningId = false
  ) {
    const responseUser = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: username,
        password: password,
        fullname: "Dicoding Indonesia",
      },
    });

    const responseJwt = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: username,
        password: password,
      },
    });

    if (alsoReturningId) {
      const { id } = JSON.parse(responseUser.payload).data.addedUser;
      const { accessToken } = JSON.parse(responseJwt.payload).data;
      return {
        id,
        accessToken,
      };
    } else {
      const { accessToken } = JSON.parse(responseJwt.payload).data;
      return accessToken;
    }
  },
};

module.exports = TokenJwtTestHelper;
