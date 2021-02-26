import { NextFunction, Request, Response } from "express";
import { index, UserModel } from "../model/User";

const jwt = require("jsonwebtoken");

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;

  if (auth) {
    let payload = jwt.decode(auth.replace("Bearer ", ""));
    if (payload) {
      if (Date.now() >= payload.exp * 1000) {
        res.statusCode = 401;
        return res.json({ error: "token is expired!" });
      } else {
        (req as any).user = index(await UserModel.findOne({ id: payload.id }));
        next();
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    console.log("missing auth data");
    res.sendStatus(401);
  }
  
};
