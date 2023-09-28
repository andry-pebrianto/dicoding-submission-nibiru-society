const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddThreadUseCase = require("../AddThreadUseCase");

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange

    // payload dari request
    const useCasePayload = {
      title: "ini title",
      body: "ini body",
      owner: "ini owner",
    };

    // mock hasil setelah data insert ke db
    const mockAddedThread = new AddedThread({
      id: "ini id",
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    });

    // mock method insertThread dengan mock data di atas dijadikan response
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.insertThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    // create thread use case
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: "ini id",
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      })
    );

    expect(mockThreadRepository.insertThread).toBeCalledWith(
      new AddThread(useCasePayload)
    );
  });
});
