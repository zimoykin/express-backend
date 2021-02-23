import { sign as jwt } from "jsonwebtoken";


const { userInfo } = require("os");
const { Interface } = require("readline");

const bcrypt = require('bcrypt')
require('dotenv').config();

export interface User {
    id:string
    username:string
    password:string
    email:string
}

export interface UserPublic {
    id: string
    username: string
    email: string
}
export interface UserAccess {
    id: string
    username: string
    email: string
    accessToken: string
    refreshToken: string
}

export const getAccess = (user: User) : UserAccess => {

   const jwt_secret = process.env.JWTSECRET

    let accessToken = jwt({
        id: user.id
      }, jwt_secret, { expiresIn: '1h' })
    let refreshToken = jwt({id: user.id}, jwt_secret)

    return { id: user.id, username: user.username, email: user.email, accessToken: accessToken, refreshToken: refreshToken }

}

export const index = (user: User) : UserPublic => {
    return { id: user.id, username: user.username, email: user.email }
}