import { string, z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "@/lib/constants";

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Price must have exactly two decimal places",
  );

//schema for inserting products
export const insertMenuSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  // stock: z.coerce.number(),
  stock: z.coerce.number<number>(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

//schema for updating products
export const updateMenuSchema = insertMenuSchema.extend({
  id: z.string().min(1, "ID is required"),
});

//Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(5, "Password must be at least 5 characters."),
});

//Schema for signing up a users
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(5, "Password must be at least 5 characters."),
    confirmPassword: z
      .string()
      .min(5, "Confirm password must be at least 5 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

//schema for inserting menu accompaniments (starches/vegetables)
export const insertAccompanimentSchema = z.object({
  name: z.string().min(1, "Name is required."),
  category: z.string().min(1, "Category is required."),
  description: z.string().nullable(),
  price: currency.nullable(),
  image: z.string().nullable(),
  isDefault: z.boolean().optional().default(false),
});

//cart schemas
export const cartItemSchema = z.object({
  menuId: z.string().min(1, "Product is required."),
  name: z.string().min(1, "Name is required."),
  slug: z.string().min(1, "Slug is required."),
  qty: z.number().int().nonnegative("Quantity must be a positive number."),
  image: z.string().min(1, "Image is required."),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  sessionCartId: z.string().min(1, "Session Cart ID is required."),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  streetAddress: z.string().min(3, "Address must be at least 3 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters."),
  country: z.string().min(3, "Country must be at least 3 characters."),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

//schema for payment method
export const paymentMethodSchema = z
  .object({ type: z.string().min(1, "Payment method is required.") })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

//schemma for inserting order
// this is the schema that is actually needd to be inserted into the application
//through the form
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User is required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

//schema for inserting an order item
export const insertOrderItemSchema = z.object({
  menuId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

//schema for paypal payment result
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

//schema for updating user profile
export const updateUserProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().min(3, "Email must be at least 3 characters."),
});

//schema to update users
export const updateUserSchema = updateUserProfileSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.string().min(1, "Role is required"),
});

//schema to insert reviews
export const insertReviewSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  menuId: z.string().min(1, "Product is required"),
  userId: z.string().min(1, "User is required"),
  rating: z.coerce
    .number<number>()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});
