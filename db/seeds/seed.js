const format = require("pg-format");

const db = require("../connection");

const { objectValues } = require("../utils/seed-functions");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  return (
    db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS reviews;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS categories;`);
      })
      .then(() => {
        return db.query(`CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    description TEXT NOT NULL
  );`);
      })
      .then(() => {
        return db.query(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    avatar_url TEXT NOT NULL,
    name TEXT NOT NULL
  );`);
      })
      .then(() => {
        return db.query(`CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    review_body TEXT NOT NULL,
    designer TEXT NOT NULL,
    review_img_url TEXT NOT NULL,
    votes INT DEFAULT 0,
    category TEXT NOT NULL,
    owner TEXT NOT NULL,
    created_at DATE DEFAULT CURRENT_TIMESTAMP
    );`);
      })
      .then(() => {
        return db.query(`CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    author TEXT NOT NULL,
    review_id SMALLINT NOT NULL,
    votes SMALLINT DEFAULT 0,
    created_at DATE DEFAULT CURRENT_TIMESTAMP,
    body TEXT NOT NULL
  );`);
      })
      // 2. insert data
      .then(() => {
        const sql = format(
          "INSERT INTO categories (slug, description) VALUES %L;",
          objectValues(categoryData)
        );
        return db.query(sql);
      })
      .then(() => {
        const sql = format(
          "INSERT INTO users (username, name, avatar_url) VALUES %L;",
          objectValues(userData)
        );
        return db.query(sql);
      })
      .then(() => {
        const sql = format(
          "INSERT INTO reviews (title, designer, owner, review_img_url, review_body, category, created_at, votes) VALUES %L;",
          objectValues(reviewData)
        );
        return db.query(sql);
      })
      .then(() => {
        const sql = format(
          "INSERT INTO comments (body,votes, author, review_id, created_at) VALUES %L;",
          objectValues(commentData)
        );
        return db.query(sql);
      })
  );
};

module.exports = seed;
