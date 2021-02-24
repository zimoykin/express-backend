import { getAccess, index, Users } from "../../model/User";
import { Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { authorization } from "../../middlewares/authorrization";

var router: Router = require("express").Router();

//index
router.get("/", async (req: Request, res: Response, next) => {
  console.log ('index users')
    const users = await Users.find();
    return res.json(
      users.map((val) => {
        return index(val);
      })
    );
  });

//register
router.post("/register", async (req: Request, res: Response, next) => {

  let userAccess = getAccess(uuidv4());

  let user = new Users({
    id: userAccess.id,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    refreshToken: userAccess.refreshToken,
  });

  return user.save((err, saved) => {
    if (err) {
      //could not create model
      res.statusCode = 422;
      return res.send({ error: err });
    } else {
      console.log("user saved!");
      return res.json(userAccess);
    }
  });

});

//login
router.post("/login", async (req: Request, res: Response, next) => {
  let user = await Users.findOne({ email: req.body.email });

  if (user) {
    if (user.password != req.body.password) {
      return res.sendStatus(401);
    } else {
      return res.json(getAccess(user.id));
    }
  } else {
    return res.sendStatus(404);
  }
});

module.exports = router;
