import { logger } from './middlewares/logger'
import * as express from 'express';

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger)
const port = process.env.PORT || 8080

app.use('/',require('./routes/index.ts'));

app.listen(port, () => {
    console.log(`server started on ${port}`)
})