import { Schema, model, Document } from 'mongoose';

export interface IOrderStatus extends Document {
  name: string;
}

const orderStatusSchema = new Schema<IOrderStatus>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
});

export const OrderStatus = model<IOrderStatus>('OrderStatus', orderStatusSchema);