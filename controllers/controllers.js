const {
  getCategories,
  getReviewById,
  patchReviewById,
  getAllReviewsModel,
  getAllReviewCommentsModel,
  postCommentModel,
  deleteCommentModel,
  getUsersModel,
  getUsernameModel,
  patchCommentModel,
  getEndpointsModel,
} = require("../models/games.models.js");

const {
  checkReviewId,
  queryValidation,
  isCategory,
  reqParamIsNumber,
  checkCommentPostParams,
  checkUserExists,
  checkCommentId,
} = require("../db/utils/util-funcs");

exports.getEndpoints = (req, res, next) => {
  getEndpointsModel().then((endpoints) => {
    res.status(200).send(endpoints);
  });
};

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

  checkReviewId(id)
    .then((idExists) => {
      const testRE = RegExp(/^\W?[0-9]+$/);
      if (queryValidation(req.body, ["inc_votes"]) === false) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      } else if (idExists === false) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else if (testRE.test(votes) === false) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
    })
    .then(() => {
      return patchReviewById(id, votes);
    })
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviews = (req, res, next) => {
  const { sort_by, order_by, category } = req.query;

  isCategory(category)
    .then(() => {
      if (order_by !== undefined && order_by !== "ASC" && order_by !== "DESC") {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
    })
    .then(() => {
      const validSortBys = [
        "title",
        "review_body",
        "designer",
        "review_img_url",
        "votes",
        "category",
        "owner",
        "created_at",
      ];
      if (sort_by !== undefined && validSortBys.indexOf(sort_by) == -1) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
    })
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

exports.getUsername = (req, res, next) => {
  const username = req.params.username;

  return getUsernameModel(username)
    .then((user) => {
      if (user.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllReviewComments = (req, res, next) => {
  const { id } = req.params;
  return getReviewById(id)
    .then((review) => {
      if (reqParamIsNumber(id) === false) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      } else if (review === undefined) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    })
    .then(() => {
      return checkReviewId(id).then((idCheck) => {
        if (idCheck == false) {
          return Promise.reject({ status: 400, msg: "Bad Request" });
        }
      });
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

  checkCommentId(commentId)
    .then((commentExists) => {
      if (commentExists === false) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    })
    .then(() => {
      return deleteCommentModel(commentId);
    })
    .then((oldComment) => {
      res.status(200).send({ oldComment: oldComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const votes = req.body.inc_votes;
  const commentId = req.params.comment_id;

  const numberRegEx = RegExp(/^\W?[0-9]+$/);

  if (numberRegEx.test(votes) === false) {
    throw { status: 400, msg: "Invalid votes" };
  } else if (numberRegEx.test(commentId) === false) {
    throw { status: 400, msg: "Invalid ID" };
  } else {
    checkCommentId(commentId)
      .then((idExists) => {
        if (idExists === false) {
          return Promise.reject({ status: 404, msg: "Not Found" });
        }
      })
      .then(() => {
        return patchCommentModel(commentId, votes).then((comment) => {
          res.status(200).send({ comment });
        });
      })
      .catch((err) => {
        next(err);
      });
  }
};
