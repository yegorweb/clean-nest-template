import { Request } from "express";
import { User } from "src/user/interfaces/user.interface";

type RequestWithUserOrNot = Request & { user: User | undefined }
export default RequestWithUserOrNot