import { sign as jwt } from "jsonwebtoken";
import * as mongoose from "mongoose";

const { userInfo } = require("os");
const { Interface } = require("readline");

const bcrypt = require("bcrypt");
require("dotenv").config();

interface IUser extends mongoose.Document {
  id: string;
  username: string;
  password: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  created: Date;
}

//Schema
const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

export const Users = mongoose.model<IUser>("User", UserSchema);

//addiction interfaces

export interface UserPublic {
  id: string;
  username: string;
  email: string;
}
export interface UserAccess {
  id: string;
  accessToken: string;
  refreshToken: string;
}

export const getAccess = (user: string): UserAccess => {
  const jwt_secret = process.env.JWTSECRET;

  let accessToken = jwt({ id: user }, jwt_secret, { expiresIn: "1h" });
  let refreshToken = jwt({ id: user }, jwt_secret);

  return { id: user, accessToken: accessToken, refreshToken: refreshToken };
};

export const index = (user: IUser): UserPublic => {
  return { id: user.id, username: user.username, email: user.email };
};
