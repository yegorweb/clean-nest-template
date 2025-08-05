import type { Request } from "express";
import { UserFromClient } from "src/user/interfaces/user-from-client.interface";
import { User } from "src/user/interfaces/user.interface";

export type RequestWithUserOrNot = Request & { user?: User | UserFromClient }