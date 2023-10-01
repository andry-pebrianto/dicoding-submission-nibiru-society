const DeleteComment = require("../../Domains/comments/entities/DeleteComment");

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { commentId, userId } = new DeleteComment(payload);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, userId);
    await this._commentRepository.softDeleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
