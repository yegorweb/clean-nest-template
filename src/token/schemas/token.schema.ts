import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TokenDocument = HydratedDocument<TokenClass>

@Schema()
export class TokenClass {
  @Prop({ 
    type: String, 
    required: true 
  })
  refreshToken: string
}

export const TokenSchema = SchemaFactory.createForClass(TokenClass)
