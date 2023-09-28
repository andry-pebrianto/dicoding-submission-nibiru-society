/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: "NOW()",
    },
  });

  pgm.addConstraint(
    "threads",
    "fk-threads.owner-users.id",
    "FOREIGN KEY(owner) REFERENCES threads(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("threads");
};
