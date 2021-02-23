const { userInfo } = require("os");
const { Interface } = require("readline");

const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

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