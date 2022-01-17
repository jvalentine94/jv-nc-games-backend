const format=require('pg-format')

const db=require('../connection')

const {objectValues} = require('../utils/seed-functions')

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  return db.query(`DROP TABLE IF EXISTS categories;`)
  .then(()=>{
  return db.query(`DROP TABLE IF EXISTS users;`)
  })
  .then(()=>{
  return db.query(`DROP TABLE IF EXISTS reviews;`)
  })
  .then(()=>{
  return db.query(`DROP TABLE IF EXISTS comments;`)
  })
  .then(()=>{
  return db.query(`CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    description TEXT
  );`)
  })
  .then(()=>{
  return db.query(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    avatar_url TEXT,
    name TEXT
  );`)
  })
  .then(()=>{
  return db.query(`CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    title TEXT,
    review_body TEXT,
    designer TEXT,
    review_img_url TEXT,
    votes INT,
    category TEXT,
    owner TEXT,
    created_at DATE
    );`)
    })
    .then(()=>{
    return db.query(`CREATE TABLE IF NOT EXISTS comments (
    comment_id SERIAL PRIMARY KEY,
    author TEXT,
    review_id SMALLINT,
    votes SMALLINT,
    created_at DATE,
    body TEXT
  );`)
  })
  // 2. insert data
  .then(()=>{
    const sql=format('INSERT INTO categories (slug, description) VALUES %L;',objectValues(categoryData))
    return  db.query(sql)
  })
  .then(()=>{
    const sql=format('INSERT INTO users (username, avatar_url, name) VALUES %L;',objectValues(userData))
    return  db.query(sql)
  })
  .then(()=>{
    const sql=format('INSERT INTO reviews (title, designer, owner, review_img_url, review_body, category, created_at, votes) VALUES %L;',objectValues(reviewData))
    return db.query(sql)
  })
  .then(()=>{
    const sql=format('INSERT INTO comments (body,votes, author, review_id, created_at) VALUES %L;',objectValues(commentData))
    return db.query(sql)
  })
};

module.exports = seed;