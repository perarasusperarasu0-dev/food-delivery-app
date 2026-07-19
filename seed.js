// Run with: node seed.js  (after setting MONGO_URI in .env)
// Populates the database with a few sample menu items.
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import MenuItem from "./models/MenuItem.js";

dotenv.config();
await connectDB();

const sample = [
  { name: "Spicy Miso Ramen", description: "Rich pork broth, chili oil, soft egg", price: 13.5, category: "Noodles" },
  { name: "Char Siu Bao", description: "Steamed buns with barbecue pork", price: 7.0, category: "Small Plates" },
  { name: "Mango Sticky Rice", description: "Coconut sticky rice, fresh mango", price: 6.5, category: "Dessert" },
  { name: "Grilled Satay Skewers", description: "Chicken skewers, peanut sauce", price: 9.0, category: "Small Plates" },
  { name: "Iced Thai Tea", description: "Sweet, creamy, served over ice", price: 4.5, category: "Drinks" },
];

await MenuItem.deleteMany({});
await MenuItem.insertMany(sample);
console.log("Seeded menu items");
process.exit(0);
