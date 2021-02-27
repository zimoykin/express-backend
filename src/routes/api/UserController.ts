import { getAccess, index, IUser, UserModel } from "../../model/User";
import { NextFunction, Request, Response, Router } from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../../model/User";
import { checkRefToken } from "../../middlewares/authorrization";

var router: Router = require("express").Router();
const jwt = require("jsonwebtoken");

//index
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  return User.find((err, users) => {
    if (err) {
      return res.sendStatus(401);
    } else {
      return res.json(
        users.map((val) => {
          return index(val);
        })
      );
    }
  });
});

//register
router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    let userAccess = getAccess(uuidv4());

    let user = new User({
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
  }
);

//login
router.post("/login", (req: Request, res: Response) => {
    return User.findOne({ email: req.body.email }, function (err: Error, user: IUser) {
        if (err) throw err;
        return user.comparePassword(req.body.password).then( (val) => {
          const access = getAccess(user.id)
          return user.update({refreshToken: access.refreshToken}).then ( (val) => {
            return res.json(access)
          })
        }).catch ( (err) => {
          throw err;
        })
      }
    )
  }
);

//refresh
router.post ('/refresh', (req: Request, res: Response) => {

  let refreshToken = req.body.ref
  if(!refreshToken) throw Error('refresh token not found in body')

  return checkRefToken(refreshToken)
  .then ( (user) => {
    const access = getAccess(user.id)
    return user.update( {refreshToken: access.refreshToken }).then ( (val) => {
      return res.json(access)
    })
  })
  .catch ( (err) => {
    res.statusCode = 400
    return res.json({error: err})
  })


})

//delete
router.delete("/:userid", async (req: Request, res: Response) => {
  let userid = req.params.userid;
  if (!userid) {
    return res.sendStatus(400);
  } else {
    
    let user = await User.findOne({ id: userid });

    if (user) {
      user.delete();
      return res.sendStatus(200);
    } else {
      return res.sendStatus(404);
    }
  }
});

module.exports = router;
