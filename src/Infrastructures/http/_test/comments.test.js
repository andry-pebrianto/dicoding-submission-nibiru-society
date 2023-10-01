const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const TokenJwtTestHelper = require("../../../../tests/TokenJwtTestHelper");
const container = require("../../container");
const createServer = require("../createServer");

describe("/comments endpoint", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and persisted new comment", async () => {
      // Arrange

      // membuat data palsu user & thread
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const payload = {
        content: "saya adalah calon programmer handal",
      };

      // create server
      const server = await createServer(container);

      // get jwt token
      const jwtToken = await TokenJwtTestHelper.getAccessToken(server, {
        username: "gojosatorueitsbagidua",
        password: "gojoenaktau",
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-999/comments",
        payload: payload,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });
});
