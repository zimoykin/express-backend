import { logger } from './middlewares/logger'
import * as express from 'express';
import { authorization } from './middlewares/authorrization';

require('dotenv').config();

//init
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger)
//app.use(authorization)

const port = process.env.PORT || 8080

//routes
app.use('/',require('./routes/index.ts'));

//start
app.listen(port, () => {
    console.log(`server started on ${port}`)
})