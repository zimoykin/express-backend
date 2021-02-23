const { v4: uuidv4 } = require("uuid");
var router = require("express").Router();

let users = [
  {
    id: uuidv4(),
    username: "Dmitry Zimoykin",
  },
  {
    id: uuidv4(),
    username: "Harley Davidson",
  },
];

router.get("/users", (req, res, next) => {
  return res.json({ users: users });
});

module.exports = router;
