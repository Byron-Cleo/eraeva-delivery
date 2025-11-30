import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//convert prisma object into regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format number with decimal places
export function formatnumberWithDeciaml(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

//Format sign up errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error instanceof z.ZodError) {
    //Handle zod errors
    const fieldErrors = Object.keys(error.issues).map((issue) => {
      // return {
      //   path: error.issues[issue].path[0],
      //   message: error.issues[issue].message,
      // };
      return error.issues[issue].message;
    });
    // const nameError = fieldErrors.filter((msg) => msg.path === "name")[0].message;

    return fieldErrors.join(", ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    //handle prisma error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  } else {
    //Handle other errors
    return typeof error.message === "string" ? error.message : JSON.stringify(error.message);
  }
}
