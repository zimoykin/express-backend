import * as express from 'express';
import { logger } from './middlewares/logger';

//init
export const app: express.Application = express();
//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

//routes
app.use("/", require("./routes/routes.ts"));


module.exports.app = app