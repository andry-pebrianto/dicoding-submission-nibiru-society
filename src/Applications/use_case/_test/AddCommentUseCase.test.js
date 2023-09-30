const AddCommentUseCase = require("../AddCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");

describe("AddCommentUseCase", () => {
  it("should orchestrating the add comment correctly", async () => {
    // Arrange

    // create payload
    const useCasePayload = {
      threadId: "thread-999",
      owner: "user-123",
      content: "ini komentar",
    };

    // mock hasil setelah data insert ke db
    const mockAddedComment = new AddedComment({
      id: "comment-777",
      owner: useCasePayload.owner,
      content: useCasePayload.content,
    });

    // membuat mock repo yang diperlukan
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    // memastikan thread benar ada
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    // mock method insertComment dengan mock data di atas dijadikan response
    mockCommentRepository.insertComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    // menginisiasi use case
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(mockAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.insertComment).toBeCalledWith(
      new AddComment(useCasePayload)
    );
  });
});
