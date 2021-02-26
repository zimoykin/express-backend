
import { sign as jwt } from "jsonwebtoken";
import * as mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
const userSchema = new mongoose.Schema({
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

// userSchema.methods.generateHash = (password) : string => {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// userSchema.methods.validPassword = (password) => {
//   return bcrypt.compareSync(password, password);
// };

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


userSchema.pre<IUser> ('save', function (next) {

  if(!this.isModified('password')){
    return next();
  } 

  bcrypt.genSalt(8, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });

});


export const UserModel = mongoose.model<IUser>("User", userSchema);

//CREATE ADMIN
let user = UserModel.findOne({ email: process.env.ADMINEMAIL }).then((user) => {
  if (user == undefined) {
    const admin_id = uuidv4();

    const admin = new UserModel({
      id: admin_id,
      username: "admin",
      email: process.env.ADMINEMAIL,
      password: process.env.ADMINPASSWORD,
      refreshToken: getAccess(admin_id).refreshToken,
    });

    admin.save(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(`success! ${data}`);
      }
    });
  }
});
