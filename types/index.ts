import {z} from 'zod';
import { insertProductSchema, cartItemSchema, insertCartSchema, shippingAddressSchema } from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
    id: string,
    rating: string,
    createdAt: Date,
}

//here we are inferring the carts zod schema type to create a TypeScript type
export type Cart = z.infer<typeof insertCartSchema>

export type CartItem = z.infer<typeof cartItemSchema>

export type ShippingAddress = z.infer<typeof shippingAddressSchema>