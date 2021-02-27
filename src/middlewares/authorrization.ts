import { NextFunction, Request, Response } from "express";
import User, { index, IUser } from "../model/User";

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
        await User.findOne(
          { id: payload.id, active: true },
          function (err: Error, val: IUser) {
            if (err) throw err;
            if (val) {
              (req as any).user = index(val);
              next();
            } else {
              res.sendStatus(404);
            }
          }
        );
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    console.log("missing auth data");
    res.sendStatus(401);
  }
};

export async function checkRefToken(ref: string): Promise<IUser> {
  return new Promise((resolve, reject) => {
    let payload = jwt.decode(ref);
    if (!payload) {
      reject("could not read token");
    }

    if (Date.now() >= payload.exp * 1000) {
      reject("token is expired");
    }

    User.findOne(
      { id: payload.id, active: true },
      (err: Error, result: IUser) => {
        if (err) reject(err);
        if (!result) reject("user not found");
        resolve(result);
      }
    );
  });
}
