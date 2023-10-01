const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const TokenJwtTestHelper = require("../../../../tests/TokenJwtTestHelper");
const createServer = require("../createServer");
const container = require("../../container");

describe("/threads endpoint", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("when POST /threads", () => {
    it("should response 201 and persisted new thread", async () => {
      // Arrange
      const payload = {
        title: "Manusia Api",
        body: "Saya akan membakar semua koruptor di dunia ini!",
      };

      // create server
      const server = await createServer(container);

      // get jwt token
      const jwtToken = await TokenJwtTestHelper.getAccessToken(server, {});

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it("should response 401 when authentication (jwt) wrong", async () => {
      // Arrange
      const payload = {
        title: "title",
        body: "some body",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual("Unauthorized");
    });

    it("should response 400 when request payload not contain needed property", async () => {
      // Arrange
      const payload = {
        title: "title",
      };

      // create server
      const server = await createServer(container);

      // get jwt token
      const jwtToken = await TokenJwtTestHelper.getAccessToken(server, {});

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
      );
    });

    it("should response 400 when request payload not meet data type spec", async () => {
      // Arrange
      const payload = {
        title: "title",
        body: 100,
      };

      // create server
      const server = await createServer(container);

      // get jwt token
      const jwtToken = await TokenJwtTestHelper.getAccessToken(server, {});

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: payload,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toEqual(
        "tidak dapat membuat thread baru karena tipe data tidak sesuai"
      );
    });
  });
});
