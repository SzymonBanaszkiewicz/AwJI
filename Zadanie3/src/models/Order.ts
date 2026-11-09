
import { Schema, model, Types, Document } from 'mongoose';

export interface IOrderedItem {
    productId: Types.ObjectId;
    quantity: number;
    unitPrice: number;
}

export interface IOrder extends Document {
    creationTime: Date;
    confirmationTime: Date | null;
    orderState: Types.ObjectId;
    username: string;
    email: string;
    phoneNumber: string;
    orderedItems: IOrderedItem[];
}

const orderedItemSchema = new Schema<IOrderedItem>({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer'
        }
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
    creationTime: {
        type: Date,
        default: Date.now,
        required: true
    },
    confirmationTime: {
        type: Date,
        default: null
    },
    orderState: {
        type: Schema.Types.ObjectId,
        ref: 'OrderStatus',
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    orderedItems: {
        type: [orderedItemSchema],
        required: true,
        validate: {
            validator: (items: IOrderedItem[]) => items.length > 0,
            message: 'Order must contain at least one item'
        }
    }
});

export const Order = model<IOrder>('Order', orderSchema);
