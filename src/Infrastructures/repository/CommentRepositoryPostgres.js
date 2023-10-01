const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");

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
}

module.exports = CommentRepositoryPostgres;
