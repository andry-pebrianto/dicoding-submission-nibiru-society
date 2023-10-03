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

  async verifyAvailableComment(id) {
    const query = {
      text: `SELECT id FROM comments WHERE id=$1 AND is_deleted=$2`,
      values: [id, false],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
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

  async softDeleteCommentById(id) {
    const query = {
      text: "UPDATE comments SET is_deleted=$1 WHERE id=$2",
      values: [true, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("komentar tidak ditemukan");
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_deleted FROM comments JOIN users ON users.id=comments.owner WHERE comments.thread_id=$1 ORDER BY comments.date`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = CommentRepositoryPostgres;
