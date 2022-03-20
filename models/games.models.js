const db = require("../db/connection");

const fs = require("fs/promises");

const pgformat = require("pg-format");

exports.getEndpointsModel = () => {
  return fs.readFile(`endpoints.json`, "utf8").then((endpoints) => {
    return endpoints;
  });
};

exports.getCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((res) => {
    return res.rows;
  });
};

exports.getReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=$1;`, [id])
    .then((res) => {
      return res.rows[0];
    });
};

exports.patchReviewById = (id, votes) => {
  return db
    .query(`SELECT review_id, votes FROM reviews WHERE review_id=$1;`, [id])
    .then((res) => {
      return res.rows[0]["votes"];
    })
    .then((currentVotes) => {
      const updatedVotes = currentVotes + votes;
      return db
        .query(
          `UPDATE reviews SET votes=${updatedVotes} WHERE review_id=$1 RETURNING *;`,
          [id]
        )
        .then((resp) => {
          return resp.rows[0];
        });
    });
};

exports.getAllReviewsModel = (
  sort_by = "created_at",
  order_by = "DESC",
  category
) => {
  if (category !== undefined && order_by === "DESC") {
    console.log("CASE 1");
    return db
      .query(
        `SELECT review_id, title, designer, review_img_url,votes,category,owner,created_at FROM reviews JOIN categories ON category=slug WHERE slug=$1 ORDER BY ${sort_by} DESC;`,
        [category]
      )
      .then((res) => {
        return res.rows;
      });
  } else if (category !== undefined && order_by === "ASC") {
    console.log("CASE 2");

    return db
      .query(
        `SELECT review_id, title, designer, review_img_url,votes,category,owner,created_at FROM reviews JOIN categories ON category=slug WHERE slug=$1 ORDER BY ${sort_by} ASC;`,
        [category]
      )
      .then((res) => {
        return res.rows;
      });
  } else if (category == undefined && order_by === "ASC") {
    console.log("CASE 3");

    return db
      .query(
        `SELECT review_id, title, designer, review_img_url,votes,category,owner,created_at FROM reviews ORDER BY ${sort_by} ASC;`
      )
      .then((res) => {
        return res.rows;
      });
  } else if (category == undefined && order_by === "DESC") {
    console.log("CASE 4");

    return db
      .query(
        `SELECT review_id, title, designer, review_img_url,votes,category,owner,created_at FROM reviews ORDER BY ${sort_by} DESC;`
      )
      .then((res) => {
        return res.rows;
      });
  } else {
    console.log("CASE ERROR");
  }
};

exports.getAllReviewCommentsModel = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE review_id=$1;`, [id])
    .then((res) => {
      return res.rows;
    });
};

exports.postCommentModel = (id, username, body) => {
  const createdAt = new Date();

  return db
    .query(
      `INSERT INTO comments (body,votes,author,review_id,created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *;`,
      [body, 0, username, id, createdAt]
    )
    .then((res) => {
      console.log("POST COMMENT", res);
      return res.rows;
    });
};

exports.deleteCommentModel = (id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *;`, [id])
    .then((res) => {
      return res.rows[0];
    });
};

exports.getUsersModel = () => {
  return db.query(`SELECT * FROM users;`).then((res) => {
    return res.rows;
  });
};

exports.getUsernameModel = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username='${username}';`)
    .then((res) => {
      return res.rows;
    });
};

exports.patchCommentModel = (commentId, votes) => {
  return db
    .query(`SELECT * FROM comments where comment_id=$1;`, [commentId])
    .then((res) => {
      const oldVotes = res.rows[0].votes;
      return oldVotes;
    })
    .then((oldVotes) => {
      return db.query(
        `UPDATE comments SET votes=$2 WHERE comment_id=$1 RETURNING *;`,
        [commentId, votes + oldVotes]
      );
    })
    .then((res) => {
      return res.rows;
    });
};
