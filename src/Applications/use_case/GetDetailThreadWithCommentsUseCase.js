const DetailComment = require("../../Domains/comments/entities/DetailComment");

class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(id) {
    const thread = await this._threadRepository.getThreadById(id);
    let comments = await this._commentRepository.getCommentsByThreadId(id);

    comments = comments.map((comment) => ({
      ...new DetailComment(comment),
    }));

    return { ...thread, comments };
  }
}

module.exports = GetThreadByIdUseCase;
