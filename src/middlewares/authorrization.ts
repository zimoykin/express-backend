import { Request, Response }  from 'express';
import { 
    decode
} from 'jsonwebtoken'

export const authorization = (req: Request, res: Response, next) => {
    const auth = req.headers.authorization;
    if (auth) {
        
        next()
    } else { 
        console.log ('missing auth data')
        res.sendStatus(401)
    }
} 