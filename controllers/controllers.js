const { getCategories } = require("../models/games.models.js");

const { getReviewById } = require("../models/games.models.js");

const { patchReviewById } = require("../models/games.models.js");

const { getAllReviewsModel } = require("../models/games.models.js");

const { getAllReviewCommentsModel } = require("../models/games.models.js");

const { postCommentModel } = require("../models/games.models.js");

const { deleteCommentModel } = require("../models/games.models.js");

const { getUsersModel } = require("../models/games.models.js");

const { getUsernameModel } = require("../models/games.models.js");

const { patchCommentModel } = require("../models/games.models.js");

const { checkReviewId, queryValidation } = require("../db/utils/util-funcs");

const { isCategory } = require("../db/utils/util-funcs");

const { reqParamIsNumber } = require("../db/utils/util-funcs");

const { checkCommentPostParams } = require("../db/utils/util-funcs");

const { checkUserExists } = require("../db/utils/util-funcs");

exports.getReviewId = (req, res, next) => {
  const { id } = req.params;

  return checkReviewId(id)
    .then((idExists) => {
      if (idExists === true) {
        getReviewById(id).then((reviewData) => {
          res.status(200).send({ review: reviewData });
        });
      } else if (idExists === false) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else if (idExists === undefined) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewId = (req, res, next) => {
  const id = req.params.id;
  const votes = req.body.inc_votes;

  queryValidation(req.body, ["inc_votes"])
    .then(() => {
      console.log("NO ERR");
      return checkReviewId(id);
    })
    .then((idExists) => {
      console.log(" ERR");
      const testRE = RegExp(/^\W?[0-9]+$/);
      if (testRE.test(votes)) {
        if (idExists === true) {
          return patchReviewById(id, votes).then((review) => {
            res.status(200).send({ review });
          });
        } else if (idExists === false) {
          return Promise.reject({ status: 404, msg: "Not Found" });
        } else if (idExists === undefined) {
          return Promise.reject({ status: 400, msg: "Bad Request" });
        }
      } else {
        if (typeof votes === "string") {
          return Promise.reject({ status: 400, msg: "Bad Request" });
        } else {
          return patchReviewById(id, 0).then((review) => {
            res.status(200).send({ review });
          });
        }
      }
    })
    .catch((err) => {
      console.log("BIG ERR");
      next(err);
    });
};

exports.getAllReviews = (req, res, next) => {
  const { sort_by, order_by, category } = req.query;

  isCategory(category)
    .then(() => {
      return getAllReviewsModel(sort_by, order_by, category);
    })
    .then((reviews) => {
      if (reviews.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        res.status(200).send({ reviews });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCategory = (req, res) => {
  return getCategories().then((items) => {
    res.status(200).send({ categories: items });
  });
};

exports.getUsers = (req, res) => {
  return getUsersModel().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUsername = (req, res) => {
  const username = req.params.username;

  return getUsernameModel(username).then((user) => {
    res.status(200).send({ user });
  });
};

exports.getAllReviewComments = (req, res, next) => {
  const { id } = req.params;

  if (checkReviewId(id) === false) {
    console.log("ID DONT EXIST");
    throw { status: 404, msg: "Not Found" };
  } else if (reqParamIsNumber(id) === false) {
    console.log("ID AINT NUMBER");
    throw { status: 400, msg: "Bad Request" };
  } else {
    getReviewById(id)
      .then((review) => {
        if (review === undefined) {
          return Promise.reject({ status: 404, msg: "Not Found" });
        }
      })
      .then(() => {
        return getAllReviewCommentsModel(id);
      })
      .then((comments) => {
        res.status(200).send({ comments });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.postComment = (req, res, next) => {
  const reviewId = req.params["id"];
  const { username, body } = req.body;

  if (queryValidation(req.body, ["username", "body"])) {
    checkReviewId(reviewId)
      .then((idExists) => {
        if (idExists === false) {
          return Promise.reject({ status: 400, msg: "Bad Request" });
        }
      })
      .then(() => {
        return checkUserExists(username);
      })
      .then(() => {
        return postCommentModel(reviewId, username, body);
      })
      .then((comment) => {
        res.status(200).send({ comment });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    throw { status: 400, msg: "Bad Request" };
  }
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params["commentid"];

  deleteCommentModel(commentId).then((comment) => {
    res.status(200).send({ comment });
  });
};

exports.patchComment = (req, res) => {
  const votes = req.query.inc_votes;
  const commentId = req.params.comment_id;

  return patchCommentModel(commentId, votes).then((comment) => {
    res.status(200).send({ comment });
  });
};
