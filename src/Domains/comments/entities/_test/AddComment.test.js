const AddComment = require("../AddComment");

describe("a AddComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      threadId: "thread-999",
      owner: "user-123",
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      threadId: "thread-999",
      owner: "user-123",
      content: 999,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create addComment object correctly", () => {
    // Arrange
    const payload = {
      threadId: "thread-999",
      owner: "user-123",
      content: "comment test",
    };

    // Action
    const { threadId, owner, content } = new AddComment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(owner).toEqual(payload.owner);
    expect(content).toEqual(payload.content);
  });
});
