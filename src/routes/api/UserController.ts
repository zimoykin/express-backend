import {UserPublic} from '../../model/User'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

var router = require("express").Router();

//test
let user: UserPublic[] = [{ id: uuidv4(), username: 'Admin', email: 'admin@goverment.com'}]

router.get("/users", (req: Request, res: Response, next) => {
  return res.json( user );
});

module.exports = router;
