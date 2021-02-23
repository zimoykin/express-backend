import { User, UserPublic, UserAccess, getAccess, index } from '../../model/User'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

var router = require("express").Router();

//test database
let users: User[] = [{ id: uuidv4(), username: 'Admin', email: 'admin@goverment.com', password:"@dmin"}]


//index
router.get("/users", (req: Request, res: Response, next) => {
  return res.json( users.map( val => { return index(val) }) );
})

//register
router.post('/users/register', (req: Request, res: Response, next) => {

  let user: User = {id: uuidv4(), username: req.body.username, email: req.body.email, password: req.body.password}
  users.push( user )

  return res.json ( getAccess(user) )

})

//login
router.post('/users/login', (req: Request, res: Response, next) => {

  let user = users.filter( val => {
    return (val.email == req.body.email && val.password == req.body.password )
  })[0]
  if (user) {
    return res.json ( getAccess(user) )
  } else {
    return res.sendStatus(404)
  }

})

module.exports = router;
