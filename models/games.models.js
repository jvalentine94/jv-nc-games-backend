const db = require("../db/connection");

exports.getCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((res) => {
    return res.rows;
  });
};

exports.getReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id=${id};`)
    .then((res) => {
      return res.rows[0];
    })
    .catch((err) => {});
};

exports.patchReviewById = (params, query) => {
  const { inc_votes } = query;
  const numVotes = Number(inc_votes);
  const { id } = params;

  return (
    db
      .query(`SELECT review_id, votes FROM reviews WHERE review_id=${id};`)
      .then((res) => {
        return res.rows[0]["votes"];
      })
      .then((currentVotes) => {
        const updatedVotes = currentVotes + numVotes;
        return db
          .query(
            `UPDATE reviews SET votes=${updatedVotes} WHERE review_id=${id} RETURNING *;`
          )
          .then((resp) => {
            return resp.rows[0];
          });
      })
      .catch((err) => {
        console.log(err);
      })
  );
};

exports.getAllReviewsModel = (sort_by = 'created_at', order_by = 'DESC',category) => {
  if (category !== undefined) {

    return db
      .query(`SELECT * FROM reviews JOIN categories ON category=slug WHERE slug=$1 ORDER BY $2 $3;`,[category,sort_by,order_by])
      .then((res) => {
        console.log('MODEL RES 1',res)
        return res.rows;
      })
      .catch((err)=>{
        console.log('MODEL ERR 1',err)
        return Promise.reject(err)
      });
  } else {

    return db
    .query(`SELECT * FROM reviews ORDER BY ${sort_by} ${order_by};`)
    .then((res) => {
      return res.rows;
    })
    .catch((err)=>{
      console.log('MODEL ERR 2',err)
      return Promise.reject(err)
    });
  }
};


exports.getAllReviewCommentsModel = (id) => {
  return db.query(`SELECT * FROM comments WHERE review_id=$1;`,[id])
  .then((res) => {
    return res.rows;
  })
  .catch((err)=>{
    Promise.reject(err)
  })
}

exports.postCommentModel = (id,username,body) => {

const createdAt = new Date()

  return db
  .query(`INSERT INTO comments (body,votes,author,review_id,created_at) VALUES ($1,$2,$3,$4,$5) RETURNING *;`,[body,0,username,id,createdAt])
  .then((res) => {
    return res.rows;
  })

}

exports.deleteCommentModel = (id) => {
  
    return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *;`,[id])
    .then((res) => {
      return res.rows;
    })
  
}

exports.getUsersModel = () => {
  return db.query(`SELECT * FROM users;`).then((res) => {
    return res.rows;
  });
};

exports.getUsernameModel = (username) => {
  return db.query(`SELECT * FROM users WHERE username='${username}';`,).then((res) => {
    return res.rows;
  });
};

exports.patchCommentModel = (commentId,votes) => {
  return db.query(`SELECT * FROM comments where comment_id=$1;`,[commentId])
  .then((res) => {
    const oldVotes=res.rows[0].votes;
    return oldVotes
  })
  .then((oldVotes)=>{
    return db.query(`UPDATE comments SET votes=$2 WHERE comment_id=$1 RETURNING *;`,[commentId,votes+oldVotes])
  })
  .then((res) => {
    return res.rows;
  })
};