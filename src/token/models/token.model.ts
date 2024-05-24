import { MongooseModule } from "@nestjs/mongoose";
import { TokenSchema } from "../schemas/token.schema";

let TokenModel = MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema, collection: 'tokens' }])
export default TokenModel