import mongoose from "mongoose"

export interface RefreshToken {
  _id: mongoose.Types.ObjectId
  token: string
  user: mongoose.Types.ObjectId
}
