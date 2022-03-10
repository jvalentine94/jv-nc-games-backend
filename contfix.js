checkReviewId(id)
  .then((idExists) => {
    if (queryValidation(req.body, ["inc_votes"]) === false) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    } else if (idExists === false) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  })
  .then(() => {
    return patchReviewById(id, 0);
  })
  .then((review) => {
    res.status(200).send({ review });
  });
