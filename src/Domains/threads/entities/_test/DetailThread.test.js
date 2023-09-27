const DetailThread = require("../DetailThread");

describe("a DetailThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      id: "ini id",
      title: "ini title",
      body: "ini body",
      date: "ini date",
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "ini id",
      title: "ini title",
      body: 999,
      date: "ini date",
      username: "ini username",
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError(
      "DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create detailThread object correctly", () => {
    // Arrange
    const payload = {
      id: "ini id",
      title: "ini title",
      body: "ini body",
      date: "ini date",
      username: "ini username",
    };

    // Action
    const { id, title, body, date, username } = new DetailThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
