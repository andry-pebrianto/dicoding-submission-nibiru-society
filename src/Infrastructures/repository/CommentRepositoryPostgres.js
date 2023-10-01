const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async insertComment(dataComment) {
    const { content, threadId, owner } = dataComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO comments(id,thread_id,owner,content) VALUES($1,$2,$3,$4) RETURNING id, content, owner`,
      values: [id, threadId, owner, content],
    };

    const { rows } = await this._pool.query(query);

    return new AddedComment(rows[0]);
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: "SELECT id FROM comments WHERE id=$1 AND owner=$2",
      values: [id, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError(
        "anda tidak punya akses terhadap komentar ini"
      );
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: "UPDATE comments SET is_deleted=$1 WHERE id=$2",
      values: [true, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }
}

module.exports = CommentRepositoryPostgres;
