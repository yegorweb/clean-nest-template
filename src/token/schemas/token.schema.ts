import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type TokenDocument = HydratedDocument<TokenClass>

@Schema()
export class TokenClass {
  @Prop({ 
    type: String, 
    required: true 
  })
  refreshToken: string

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  })
  user: Types.ObjectId
}

export const TokenSchema = SchemaFactory.createForClass(TokenClass)
