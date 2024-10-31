import mongoose from "mongoose"

export interface RefreshToken {
  _id: mongoose.Types.ObjectId
  refreshToken: string
  user: mongoose.Types.ObjectId
}
