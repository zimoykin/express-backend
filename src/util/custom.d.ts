import { UserPublic } from "../model/User";

declare global {
  namespace Express {
    export interface Request {
      user?: UserPublic;
    }
  }
}

// export default interface ICustomRequset extends Request {
//     user?: UserPublic
// }