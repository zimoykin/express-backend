import { v4 as uuidv4 } from "uuid";
import { Todos } from "../../model/Todo";
import { Request, Response } from "express";
import { authorization } from "../../middlewares/authorrization";
import { Users } from "../../model/User";

var router = require("express").Router();
router.use(authorization)

//index
router.get("/", async (req: Request, res: Response) => {
    console.log ('index todos')
    const todos = await Todos.find();
    return res.json(todos.map( (todo) => {
        return ({ id: todo.id, title: todo.title, description: todo.description, created: todo.created })
    }))
})

//create
router.post("/", async (req: Request, res: Response) => {
    console.log ('create todos')

    let userId = (req as any).user.id

    return Users.findOne({ id: userId }).map ( (user) => {
        const todos = new Todos ({ 
            id: uuidv4(),
            user: user,
            title: req.body.title,
            description: req.body.description
        }).save( (err, saved) => {
            if (err) {
                res.statusCode = 400
                return res.json({ error: err })
            } else {
                return res.json(saved)
            }
        })
    })
})


module.exports = router;