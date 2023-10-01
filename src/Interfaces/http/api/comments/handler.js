const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { threadId } = request.params;
    const { content } = request.payload;
    const payload = {
      content,
      threadId,
      owner: request.auth.credentials.id,
    };

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute(payload);

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
