import { Category } from "../models/Category";
import { OrderStatus } from "../models/OrderStatus";

const categories = [
  { name: 'Elektronika' },
  { name: 'Odzież' },
  { name: 'Książki' },
  { name: 'Sport' },
];

const orderStatuses = [
  { name: 'NIEZATWIERDZONE' },
  { name: 'ZATWIERDZONE' },
  { name: 'ANULOWANE' },
  { name: 'ZREALIZOWANE' },
];

export async function initializeData() {
    if (await Category.countDocuments() === 0) {
        await Category.insertMany(categories);
    }
    if (await OrderStatus.countDocuments() === 0) {
        await OrderStatus.insertMany(orderStatuses);
    }
}