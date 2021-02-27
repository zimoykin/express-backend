
import { sign as jwt } from "jsonwebtoken";
import * as mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const bcrypt = require("bcrypt");

require("dotenv").config();

export interface IUser extends mongoose.Document {
  id: string;
  username: string;
  password: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  created: Date;
  comparePassword(candidatePassword: string):Promise<boolean>;
}

//Schema
const userSchema = new mongoose.Schema<IUser>({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true
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
  active: {
    type: Boolean,
    required: true
  }
}, {timestamps : true});

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
  let refreshToken = jwt({ id: user }, jwt_secret, { expiresIn: "24h" });

  return { id: user, accessToken: accessToken, refreshToken: refreshToken };
};

export const index = (user: IUser): UserPublic => {
  if (!user) { throw Error('could nor convert user'); }
  else {  return { id: user.id, username: user.username, email: user.email }; }
};


userSchema.pre<IUser> ('save', function (next) {

  if(!this.isModified('password')){
    return next();
  } 

  bcrypt.genSalt(8, (err: Error, salt) => {
    if (err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  });

});

userSchema.pre<IUser>('validate', function(next) {
  if (this.password === '') {
      this.invalidate('', 'password couldnt be empty');
  }
  if (this.email === '') {
    this.invalidate('', 'email couldnt be empty');
  }

  next();
});

userSchema.methods.comparePassword = function(candidatePassword: string) : Promise<boolean>  {
  return new Promise ( (resolve, reject) => {
      bcrypt.compare(candidatePassword, this.password, (err: Error, success: boolean) => {
        if(err) reject(err)
        return resolve(success)
    })
  })

};


export interface UserModel extends mongoose.Model<IUser> {}
const User = mongoose.model<IUser, UserModel>('User', userSchema)
export default User

//CREATE ADMIN
let user = User.findOne({ email: process.env.ADMINEMAIL }).then((user) => {
  if (user == undefined) {
    const admin_id = uuidv4();

    const admin = new User({
      id: admin_id,
      username: "admin",
      email: process.env.ADMINEMAIL,
      password: process.env.ADMINPASSWORD,
      refreshToken: getAccess(admin_id).refreshToken,
      active: true
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
