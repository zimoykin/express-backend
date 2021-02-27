import { v4 as uuidv4 } from "uuid";
import { Todos, ITodo} from "../../model/Todo";
import { Request, Response } from "express";
import { authorization } from "../../middlewares/authorrization";
import User from "../../model/User";

var router = require("express").Router();
router.use(authorization)

//index
router.get('/', async (req: Request, res: Response) => {
    const todos = await Todos.find().sort({ createdAt: -1});
    return res.json(todos.map( (todo) => {
        return ({ id: todo.id, title: todo.title, description: todo.description, created: todo.createdAt })
    }))
})
//get one
router.get('/:todoid', async (req: Request, res: Response) => {

    let todoid = req.params.todoid 
    if (!todoid) throw Error ('could not read params')
    const todo = await Todos.findOne({ id: todoid });

    if (!todo) {
        return res.sendStatus(404)
    }

    return res.json ({ id: todo.id, title: todo.title, description: todo.description, created: todo.createdAt})
    
})

//create
router.post('/', async (req: Request, res: Response) => {

    let userId = (req as any).user.id

    return User.findOne({ id: userId }).map ( (user) => {
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
});

router.put('/:todoid', async (req: Request, res: Response) => {

        let todoid = req.params.todoid
        if (!todoid) throw Error('could not read id in request')

        return Todos.findOneAndUpdate( { id:todoid }, req.body, { }, (err, result) => {
          if (err) throw err;
          if (!result) return res.sendStatus(404)
          return res.json( result )
        })

    }
)

router.delete('/:todoid', async (req: Request, res: Response) => {
    let todoid = req.params.todoid
    if (todoid) {
        let todo = await Todos.findOne ({id: todoid})
        if (todo) {
            todo.delete()
            return res.sendStatus(200)
        } else {
            return res.sendStatus(404)
        }
    } else {
        return res.sendStatus(400)
    }
})

module.exports = router;