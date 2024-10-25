import mongoose from "mongoose"
import { User } from "src/user/interfaces/user.interface"

export interface PopulatedToken {
  _id: mongoose.Types.ObjectId
  token: string
  user: User
}