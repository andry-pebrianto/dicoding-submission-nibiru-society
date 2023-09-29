const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("an insertThread function", () => {
    it("should persist new thread to db and return added thread correctly", async () => {
      // Arrange

      // create user
      await UsersTableTestHelper.addUser({});
      const threadData = new AddThread({
        title: "thread-example",
        body: "lorem ipsum dolor sit amet",
        owner: "user-123",
      });
      // stub id generator
      const fakeIdGenerator = () => "999";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.insertThread(threadData);
      const thread = await ThreadsTableTestHelper.findThreadsById("thread-999");

      // Assert
      expect(thread).toHaveLength(1);
    });

    it("should return added thread correctyl", async () => {
      // Arrange

      // create user
      await UsersTableTestHelper.addUser({});
      const threadData = new AddThread({
        title: "thread-example",
        body: "lorem ipsum dolor sit amet",
        owner: "user-123",
      });
      // stub id generator
      const fakeIdGenerator = () => "999";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.insertThread(
        threadData
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-999",
          title: "thread-example",
          owner: "user-123",
        })
      );
    });
  });

  describe("an verifyAvailableThread function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("none")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return nothing if thread found", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: "thread-999" });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyAvailableThread("thread-999")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("an getThreadById function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById("none")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return thread data correctly", async () => {
      // Assert
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        () => {}
      );

      // insert users test
      await UsersTableTestHelper.addUser({ username: "manusia api" });

      // insert thread test
      const exampleDate = new Date();
      await ThreadsTableTestHelper.addThread({
        id: "thread-999",
        title: "thread-example",
        body: "lorem ipsum dolor sit amet",
        owner: "user-123",
        date: exampleDate,
      });

      const thread = await threadRepositoryPostgres.getThreadById("thread-999");
      expect(thread).toStrictEqual(
        new DetailThread({
          id: "thread-999",
          title: "thread-example",
          body: "lorem ipsum dolor sit amet",
          username: "manusia api",
          date: exampleDate,
        })
      );
    });
  });
});
