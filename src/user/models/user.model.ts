import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../schemas/user.schema";

export const UserModel = MongooseModule.forFeature([{ name: 'User', schema: UserSchema, collection: 'users' }])
