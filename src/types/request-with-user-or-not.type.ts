import { Request } from "express";
import { UserFromClient } from "src/user/interfaces/user-from-client.interface";

type RequestWithUserOrNot = Request & { user: UserFromClient | undefined }
export default RequestWithUserOrNot