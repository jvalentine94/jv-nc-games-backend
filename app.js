const express = require("express");

const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const {
  getEndpoints,
  getCategory,
  getReviewId,
  patchReviewId,
  getAllReviews,
  getAllReviewComments,
  postComment,
  deleteComment,
  getUsers,
  getUsername,
  patchComment,
} = require("./controllers/controllers.js");

const {
  handlesStandardErrors,
  handlesCustomErrors,
  handlesUnspecifiedErrors,
} = require("./controllers/error.controllers.js");

//DATA CONTROLLERS
app.get("/api", getEndpoints);

app.get("/api/categories", getCategory);

app.get("/api/reviews/:id", getReviewId);

app.patch("/api/reviews/:id", patchReviewId);

app.get("/api/reviews", getAllReviews);

app.get("/api/reviews/:id/comments", getAllReviewComments);

app.post("/api/reviews/:id/comments", postComment);

app.delete("/api/comments/:commentid", deleteComment);

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUsername);

app.patch("/api/comments/:comment_id", patchComment);

//ERROR HANDLERS

app.use(handlesStandardErrors);

app.use(handlesCustomErrors);

app.all(handlesUnspecifiedErrors);

module.exports = app;
