import { Request } from "express";
import { UserFromClient } from "src/user/interfaces/user-from-client.interface";

type RequestWithUser = Request & { user: UserFromClient }
export default RequestWithUser