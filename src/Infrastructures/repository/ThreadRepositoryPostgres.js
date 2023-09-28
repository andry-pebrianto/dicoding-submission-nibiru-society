const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const DetailThread = require("../../Domains/threads/entities/DetailThread");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async insertThread(dataThread) {
    const { title, body, owner } = dataThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO threads VALUES($1,$2,$3,$4) RETURNING id, title, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);
    return new AddedThread(result.rows[0]);
  }

  async verifyAvailableThread(id) {
    const query = {
      text: "SELECT id FROM threads WHERE id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }
  }

  async getThreadById(id) {
    const query = {
      text: "SELECT threads.id, threads.title, threads.body, threads.date, users.username FROM threads JOIN users ON users.id=threads.owner WHERE threads.id=$1",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError("thread tidak ditemukan");
    }

    console.log(result.rows);

    return new DetailThread(result.rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
