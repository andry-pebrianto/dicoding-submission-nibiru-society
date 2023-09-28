const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end;
  });

  describe("an insertThread function", () => {
    it("should persist new thread to db and return added thread correctly", async () => {
      // Arrange

      // create user
      await UsersTableTestHelper.addUser({});
      const threadData = new AddThread({
        title: "thread example",
        body: "lorem ipsum dolor sit amet",
        owner: "user-123",
      });
      // stub id generator
      const fakeIdGenerator = () => "999";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres({
        pool,
        fakeIdGenerator,
      });

      // Action
      await threadRepositoryPostgres.addThread(threadData);
      const thread = await ThreadsTableTestHelper.findThreadsById("thread-999");

      // Assert
      expect(thread).toHaveLength(1);
    });
  });
});
