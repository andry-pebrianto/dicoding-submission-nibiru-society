const DeleteComment = require("../DeleteComment");

describe("a DeleteComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      commentId: "comment-777",
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      "DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      commentId: "comment-777",
      userId: 999,
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError(
      "DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create deleteComment object correctly", () => {
    // Arrange
    const payload = {
      commentId: "comment-777",
      userId: "user-123",
    };

    // Action
    const { commentId, userId } = new DeleteComment(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(userId).toEqual(payload.userId);
  });
});
