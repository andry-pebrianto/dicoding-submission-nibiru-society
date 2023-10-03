const DetailComment = require("../DetailComment");

describe("a DetailComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-777",
      username: "arnek49",
      date: new Date(),
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-777",
      username: 999,
      date: new Date(),
      content: "saya suka kaltsit",
      is_deleted: "false",
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError(
      "DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create detailComment object correctly", () => {
    // Arrange
    const payload1 = {
      id: "comment-777",
      username: "arnek49",
      date: new Date(),
      content: "saya suka kaltsit",
      is_deleted: false,
    };

    const payload2 = {
      id: "comment-777",
      username: "arnek49",
      date: new Date(),
      content: "saya suka kaltsit",
      is_deleted: true,
    };

    // Action
    const payload1After = new DetailComment(payload1);
    const payload2After = new DetailComment(payload2);

    // Assert
    expect(payload1After.id).toEqual(payload1.id);
    expect(payload1After.username).toEqual(payload1.username);
    expect(payload1After.date).toEqual(payload1.date);
    expect(payload1After.content).toEqual(payload1.content);

    expect(payload2After.id).toEqual(payload2.id);
    expect(payload2After.username).toEqual(payload2.username);
    expect(payload2After.date).toEqual(payload2.date);
    expect(payload2After.content).toEqual("**komentar telah dihapus**");
  });
});
