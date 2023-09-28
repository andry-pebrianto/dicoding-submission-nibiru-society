/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({
    id = "test-id",
    title = "test-title",
    body = "test-body",
    owner = "test-owner",
  }) {
    const query = {
      text: "INSERT INTO threads(id, title, body, owner) VALUES($1, $2, $3, $4)",
      values: [id, title, body, owner],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
