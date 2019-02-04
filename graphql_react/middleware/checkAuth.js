import { verifyToken } from "../helpers/utils";

export const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isUserAuth = false;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isUserAuth = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = verifyToken(token);
  } catch (err) {
    req.isUserAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isUserAuth = false;
    return next();
  }
  req.isUserAuth = true;
  req.userId = decodedToken.userId;
  next();
};
