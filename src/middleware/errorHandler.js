const errorHandler = (err, req, res, next) => {
  console.error("errror aa rhi h ",err.stack);
  res.status(500).json({ message: err.message });
};

export default errorHandler;
