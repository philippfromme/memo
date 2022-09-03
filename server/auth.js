module.exports = function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.set("WWW-Authenticate", 'Basic realm="Access to Index"');
    res.status(401).send("Unauthorised access");

    return;
  }

  const [_, encoded] = authorization.split(" ");

  if (!encoded) {
    res.set("WWW-Authenticate", 'Basic realm="Access to Index"');
    res.status(401).send("Unauthorised access");

    return;
  }

  const [username, password] = Buffer.from(encoded, "base64")
    .toString()
    .split(":");

  if (
    process.env.MEMO_USERNAME &&
    username === process.env.MEMO_USERNAME &&
    process.env.MEMO_PASSWORD &&
    password === process.env.MEMO_PASSWORD
  ) {
    return next();
  }

  res.set("WWW-Authenticate", 'Basic realm="Access to Index"');
  res.status(401).send("Unauthorised access");
};