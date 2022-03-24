exports.handlesStandardErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlesCustomErrors = (err, req, res, next) => {
  if (err.code == "42703") {
    res.status(400).send({ msg: "Bad Request" });
  }
  if (err.code == "42601") {
    res.status(400).send({ msg: "Bad Request" });
  }
  if (err.code == "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  }
  if (err.code == "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
};

exports.handlesUnspecifiedErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
};
