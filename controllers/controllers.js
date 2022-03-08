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

//REFACTORED, DISCUSS LIMITATION/IMPORVEMENTS WITH TUTOR
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

//REFACTOR THIS, DISCUSS REFACTOR WITH TUTOR
exports.patchReviewId = (req, res, next) => {
  const id = req.params.id;
  const votes = req.body.inc_votes;

  queryValidation(req.body, ["inc_votes"])
    .then(() => {
      return checkReviewId(id);
    })
    .then((idExists) => {
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
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
    })
    .catch((err) => {
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
      console.log("REVIEWS", reviews);
      res.status(200).send({ reviews });
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

  reqParamIsNumber(id)
    .then(() => {
      return getAllReviewCommentsModel(id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const reviewId = req.params["id"];
  const { username, body } = req.query;

  queryValidation(req.query, ["username", "body"])
    .then(() => {
      return postCommentModel(reviewId, username, body);
    })
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
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
