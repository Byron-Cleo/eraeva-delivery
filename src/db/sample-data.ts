import { hashSync } from "bcrypt-ts-edge";
import { MealPeriod } from "@prisma/client";

// Pre-defined UUIDs allow cross-referencing between seeded records
// without querying the database between inserts (e.g. Menu.accompanyId → ID.ugali).
const ID = {
  // Menus
  beefFry: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  chickenFry: "f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c",
  // MenuAccompaniment rows
  ugali: "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
  rice: "b2c3d499-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
  chapati: "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
  // MealType rows
  lunchType: "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
  dinnerType: "e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b",
} as const;

const sampleData = {
  users: [
    {
      name: "Byron",
      email: "admin@example.com",
      password: hashSync("12345", 10),
      role: "admin",
      address: {
        fullName: "Byron Ochara",
        streetAddress: "Nairobi, Kenya",
        city: "Nairobi",
        postalCode: "00100",
        country: "Kenya",
      },
    },
    {
      name: "Maxin Ochara",
      email: "user@example.com",
      password: hashSync("12345", 10),
      role: "user",
      address: {
        fullName: "Maxin Ochara",
        streetAddress: "Mombasa, Kenya",
        city: "Mombasa",
        postalCode: "00200",
        country: "Kenya",
      },
    },
  ],

  // ── MenuAccompaniment ────────────────────────────────────────────────────────
  // Seeded before menus because Menu.accompanyId is a FK into this table.
  accompaniments: [
    {
      id: ID.ugali,
      name: "Ugali",
      category: "starch",
      description: "Kenyan staple made from maize flour — firm and filling",
      price: null,
      image: "/images/sample-meals/ugali.jpg",
    },
    {
      id: ID.chapati,
      name: "Chapati",
      category: "starch",
      description: "Soft, layered flatbread — a popular Kenyan accompaniment",
      price: null,
      image: "/images/sample-meals/chapati.jpg",
    },
    {
      id: ID.rice,
      name: "Rice",
      category: "starch",
      description: "Fluffy steamed white rice — light and versatile",
      price: null,
      image: "/images/sample-meals/rice.jpg",
    },
  ],

  // ── MealType ───────────────────────────────────────────────────────────────
  // One row per MealPeriod enum value currently in use.
  // sortOrder drives the left-to-right tab order rendered on the UI.
  mealTypes: [
    { id: ID.lunchType, name: MealPeriod.LUNCH, sortOrder: 1 },
    { id: ID.dinnerType, name: MealPeriod.DINNER, sortOrder: 2 },
  ],

  // ── Menu ──────────────────────────────────────────────────────────────────
  // accompanyId → the default starch served with this dish (Ugali).
  // Chapati is also seeded above as an option the customer can swap to.
  // vegetableId is null — no vegetable side defined for this menu item yet.
  menus: [
    {
      id: ID.beefFry,
      name: "Beef Fry",
      slug: "beef-fry",
      category: "Beef",
      description:
        "Tender pieces of beef stir-fried with onions, tomatoes, and Kenyan spices. Best enjoyed with ugali or chapati.",
      images: [
        "/images/sample-meals/beef-fry-rice.png",
        "/images/sample-meals/beef-fry-chapati.png",
        "/images/sample-meals/beef-fry-ugali.png",
      ],
      price: "12.99",
      brand: "Eraeva Kitchen",
      rating: "4.8",
      numReviews: 24,
      stock: 20,
      isFeatured: true,
      banner: "banner-beef-fry.jpg",
      // Default starch is Ugali. Chapati is a valid alternative (also seeded).
      accompanyId: ID.ugali,
      vegetableId: null,
    },

    {
      id: ID.chickenFry,
      name: "Chicken Fry",
      slug: "chicken-fry",
      category: "Chicken",
      description:
        "Tender pieces of chicken stir-fried with onions, tomatoes, and Kenyan spices. Best enjoyed with ugali or chapati.",
      images: [
        "/images/sample-meals/chicken-fry-rice.png",
        "/images/sample-meals/chicken-fry-chapati.png",
        "/images/sample-meals/chicken-fry-ugali.png",
      ],
      price: "12.99",
      brand: "Eraeva Kitchen",
      rating: "4.8",
      numReviews: 24,
      stock: 20,
      isFeatured: true,
      banner: "banner-chicken-fry.jpg",
      // Default starch for chicken is Rice. Ugali/Chapati are also available.
      accompanyId: ID.rice,
      vegetableId: null,
    },
  ],

  // ── MenuMealType (join table) ──────────────────────────────────────────────
  // Beef Fry is served at both Lunch and Dinner.
  // These rows must be inserted after both Menu and MealType rows exist.
  menuMealTypes: [
    { menuId: ID.beefFry, mealTypeId: ID.lunchType },
    { menuId: ID.beefFry, mealTypeId: ID.dinnerType },
    { menuId: ID.chickenFry, mealTypeId: ID.lunchType },
    { menuId: ID.chickenFry, mealTypeId: ID.dinnerType },
  ],
};

export default sampleData;
