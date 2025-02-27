// not found
const notFound = (req, res, next) => {
  res.status(404).json({
    msg: `Url not found - ${req.originalUrl}`,
  });
};

// Error Handling
const errorHandler = (err, req, res, next) => {
  // console.error(err.stack)
  err.status = err.status || 500;
  res.status(err.status).json({
    con: false,
    msg: err.message,
  });
};

module.exports = { errorHandler, notFound };
