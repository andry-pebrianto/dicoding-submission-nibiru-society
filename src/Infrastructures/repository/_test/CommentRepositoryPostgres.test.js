const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("insertComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const newComment = new AddComment({
        content: "komentar sarkas",
        threadId: "thread-999",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "777";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.insertComment(
        newComment
      );

      // kebutuhan assert di bawah
      const comment = await CommentsTableTestHelper.findCommentById(
        "comment-777"
      );

      // Assert
      expect(comment).toHaveLength(1);
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-777",
          content: "komentar sarkas",
          owner: "user-123",
        })
      );
    });
  });
});
