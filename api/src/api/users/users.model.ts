import mongoose, { Schema } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

const UserSchema: Schema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    wallet_address: { type: String },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export = mongoose.model('users', UserSchema);
