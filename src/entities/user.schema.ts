import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const schema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('user', schema);