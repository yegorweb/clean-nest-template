import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserClass>

@Schema()
export class UserClass {
  @Prop({ 
    type: String, 
    required: true,
    min: 2
  })
  fullname: string

  @Prop({ 
    type: String, 
    required: true,
    unique: true,
  })
  email: string

  @Prop({ 
    type: String, 
    required: true,
  })
  password: string

  @Prop({
    type: [String], 
    default: [],
    required: true
  })
  roles: string[]
}

export const UserSchema = SchemaFactory.createForClass(UserClass)
