import mongoose from "mongoose"

export interface Token {
  _id: mongoose.Types.ObjectId
  refreshToken: string
}
