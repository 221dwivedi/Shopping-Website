import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const seedProducts = [
  {
    name: "Echo Dot (5th Gen)",
    description: "Our best sounding Echo Dot yet — enjoy an improved audio experience compared to any previous Echo Dot with Alexa for clearer vocals, deeper bass and vibrant sound in any room.",
    price: 49.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/echo/400/400",
    rating: 4.7,
    numReviews: 1250,
    countInStock: 50,
    brand: "Amazon"
  },
  {
    name: "Kindle Paperwhite",
    description: "Now with a 6.8” display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.",
    price: 139.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/kindle/400/400",
    rating: 4.8,
    numReviews: 850,
    countInStock: 30,
    brand: "Amazon"
  },
  {
    name: "Apple AirPods Pro (2nd Gen)",
    description: "Up to 2x more Active Noise Cancellation than the previous generation, so you’ll hear dramatically less noise during your commute and when you need to focus.",
    price: 249.00,
    category: "Electronics",
    image: "https://picsum.photos/seed/airpods/400/400",
    rating: 4.9,
    numReviews: 3200,
    countInStock: 15,
    brand: "Apple"
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry Leading Noise Canceling Headphones with Auto NC Optimizer, Crystal Clear Hands-Free Calling, and Alexa Voice Control.",
    price: 398.00,
    category: "Electronics",
    image: "https://picsum.photos/seed/sony/400/400",
    rating: 4.6,
    numReviews: 1100,
    countInStock: 10,
    brand: "Sony"
  },
  {
    name: "Samsung Galaxy S23 Ultra",
    description: "Whether you’re headed to a concert or romantic night out, there’s no such thing as bad lighting with Night Mode; Galaxy S23 Ultra lets you capture epic content in any setting.",
    price: 1199.99,
    category: "Electronics",
    image: "https://picsum.photos/seed/samsung/400/400",
    rating: 4.7,
    numReviews: 450,
    countInStock: 20,
    brand: "Samsung"
  },
  {
    name: "Logitech MX Master 3S",
    description: "Introducing Logitech MX Master 3S – an iconic mouse remastered. Now with Quiet Clicks and 8K DPI any-surface tracking for more feel and performance than ever before.",
    price: 99.00,
    category: "Accessories",
    image: "https://picsum.photos/seed/mouse/400/400",
    rating: 4.8,
    numReviews: 2100,
    countInStock: 40,
    brand: "Logitech"
  }
];

export const seedDatabase = async () => {
  try {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    if (snapshot.empty) {
      console.log("Database empty, attempting to seed products...");
      for (const product of seedProducts) {
        try {
          await addDoc(productsCol, product);
        } catch (error: any) {
          if (error.code === 'permission-denied') {
            console.log("Seeding skipped: Insufficient permissions (likely guest user)");
            return;
          }
          throw error;
        }
      }
      console.log("Seeding complete.");
    }
  } catch (error) {
    console.warn("Seed check skipped or failed:", error);
  }
};
