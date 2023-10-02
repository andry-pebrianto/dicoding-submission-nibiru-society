const GetDetailThreadWithCommentsUseCase = require("../GetDetailThreadWithCommentsUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");

describe("GetDetailThreadWithCommentsUseCase", () => {
  it("should orchestrating the get detail thread with comments correctly", async () => {
    // Arrange

    // payload dari request (id param)
    const useCasePayload = { id: "thread-999" };

    const dateDummy = new Date();
    const mockDetailThread = {
      id: "thread-999",
      title: "siapakah pembunuh wiji thukul?",
      body: "saya rasa dalangnya adalah Soeh- so bakso!",
      date: dateDummy,
      username: "ham-hunter",
      comments: [
        {
          id: "comment-777",
          username: "bambang",
          date: dateDummy,
          content: "komentar telah dihapus",
        },
        {
          id: "comment-888",
          username: "lukas",
          date: dateDummy,
          content: "mari kita tanyakan pada FBI?",
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn(() =>
      Promise.resolve(
        new DetailThread({
          id: "thread-999",
          title: "siapakah pembunuh wiji thukul?",
          body: "saya rasa dalangnya adalah Soeh- so bakso!",
          date: dateDummy,
          username: "ham-hunter",
        })
      )
    );
    mockCommentRepository.getCommentsByThreadId = jest.fn(() =>
      Promise.resolve([
        // content tidak akan muncul
        {
          id: "comment-777",
          username: "bambang",
          date: dateDummy,
          content: "saya yang membunuhnya :), kenapa? kamu mau ikut mati?",
          is_deleted: true,
        },
        // content akan muncul
        {
          id: "comment-888",
          username: "lukas",
          date: dateDummy,
          content: "mari kita tanyakan pada FBI?",
          is_deleted: false,
        },
      ])
    );

    const getDetailThreadWithCommentsUseCase =
      new GetDetailThreadWithCommentsUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

    // Action
    const detailThreadWithComments =
      await getDetailThreadWithCommentsUseCase.execute(useCasePayload.id);

    // Assert
    expect(detailThreadWithComments).toStrictEqual(mockDetailThread);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.id
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.id
    );
  });
});
