import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "../schemas/user.schema";

let UserModel = MongooseModule.forFeature([{ name: 'User', schema: UserSchema, collection: 'users' }])
export default UserModel