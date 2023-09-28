const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const addThread = new AddThread(payload);
    return this._threadRepository.insertThread(addThread);
  }
}

module.exports = AddThreadUseCase;
