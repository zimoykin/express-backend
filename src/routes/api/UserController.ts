import { User, UserPublic, UserAccess, getAccess, index, UserModel } from '../../model/User'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { mongoose } from '../../app';

var router = require("express").Router();
//var MongoClient = require('mongodb').MongoClient;

//test database :)
let users: User[] = [{ id: uuidv4(), username: 'Admin', email: 'admin@goverment.com', password:"@dmin"}]


//index
router.get("/users", async ( req: Request, res: Response, next) => {
  const users = await UserModel.find()
  return res.json(users)
})

//register
router.post('/users/register', async (req: Request, res: Response, next) => {

  let user: User = {id: uuidv4(), username: req.body.username, email: req.body.email, password: req.body.password}
  let userAccess = getAccess(user)

  await new UserModel({ id: user.id, username: user.username, password: user.password, email: user.email, accessToken: userAccess.accessToken, refreshToken: userAccess.refreshToken})
  .save( () => {
      console.log ('user saved!')
  })

  return res.json (getAccess(user))

})

//login
router.post('/users/login', (req: Request, res: Response, next) => {

  let user = users.filter( val => {
    return (val.email == req.body.email && val.password == req.body.password )
  })[0]
  if (user) {
    return res.json (getAccess(user))
  } else {
    return res.sendStatus(404)
  }

})

module.exports = router;
