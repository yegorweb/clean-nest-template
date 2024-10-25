import { Request } from "express";
import { User } from "src/user/interfaces/user.interface";

type RequestWithUser = Request & { user: User }
export default RequestWithUser