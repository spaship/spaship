function finishAuth(req, res, next) {
  if (req.user && req.user.error) {
    res.status(401).send({ msg: `JWT authentication failed. ${req.user.error.message}` });
  } else if (req.apikey && req.apikey.error) {
    res.status(401).send({ msg: `API key authentication failed. ${req.apikey.error.message}` });
  } else if (!req.user && !req.apikey) {
    res.status(401).send({ msg: "authentication failed" });
  } else if (req.user && !req.user.error) {
    next();
  } else if (req.apikey && !req.apikey.error) {
    next();
  } else {
    res.status(401).send({ msg: "authentication failed" });
  }
}

function authMiddleware(...authMethods) {
  if (authMethods.length) {
    const authChain = authMethods.concat(finishAuth);
    console.log(authChain);
    return authChain;
  } else {
    throw new Error("authMiddleware requires at least one authentication middleware, but none were passed in.");
  }
}

module.exports = authMiddleware;
