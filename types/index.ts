import {z} from 'zod';
import { insertProductSchema, cartItemSchema, insertCartSchema } from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
    id: string,
    rating: string,
    createdAt: Date,
}

//here we are inferring the carts schemas type to create a TypeScript type
export type Cart = z.infer<typeof insertCartSchema>

export type CartItem = z.infer<typeof cartItemSchema>