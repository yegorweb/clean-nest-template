import mongoose from "mongoose"

export interface User {
  _id: mongoose.Types.ObjectId
  fullname: string
  email: string
  password: string
  roles: string[]
}
