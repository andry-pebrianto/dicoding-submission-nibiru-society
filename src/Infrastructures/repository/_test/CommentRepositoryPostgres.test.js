const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

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

  describe("verifyAvailableCommentInThread function", () => {
    it("should return NotFoundError when comment is not available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment(
          "comment-666",
          "thread-999"
        )
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return nothing when comment are available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment(
          "comment-777",
          "thread-999"
        )
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should return AuthorizationError when user wasn't comment owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-777", "user-321")
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should return nothing when user was owner", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => {});

      // Action & Arrange
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-777", "user-123")
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("softDeleteCommentById function", () => {
    it("should return NotFoundError when comment is not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.softDeleteCommentById("777")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should delete (soft/is_deleted=true) comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        () => {}
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.softDeleteCommentById("comment-777")
      ).resolves.not.toThrowError(NotFoundError);

      const deletedComment = await CommentsTableTestHelper.findCommentById(
        "comment-777"
      );
      expect(deletedComment[0].is_deleted).toEqual(true);
    });
  });
});
