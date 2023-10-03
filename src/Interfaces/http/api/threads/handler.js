const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetDetailThreadWithCommentsUseCase = require("../../../../Applications/use_case/GetDetailThreadWithCommentsUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const payload = {
      ...request.payload,
      owner: request.auth.credentials.id,
    };

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(payload);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const getDetailThreadWithCommentsUseCase = this._container.getInstance(
      GetDetailThreadWithCommentsUseCase.name
    );
    const thread = await getDetailThreadWithCommentsUseCase.execute(
      request.params.id
    );

    const response = h.response({
      status: "success",
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
