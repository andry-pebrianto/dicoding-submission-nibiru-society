const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment correctly", async () => {
    // Arrange

    // payload dari request
    const useCasePayload = {
      commentId: "comment-777",
      userId: "user-123",
    };

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.softDeleteCommentById = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).resolves.not.toThrowError();
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    );
    expect(mockCommentRepository.softDeleteCommentById).toBeCalledWith(
      useCasePayload.commentId
    );
  });
});
