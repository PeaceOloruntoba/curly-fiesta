export type UiRecipe = {
  id: number;
  name: string;
  category: string; // breakfast|lunch|dinner|snack|...
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// Extracted from ui.tsx (truncated fields to only those we persist)
export const RECIPES: UiRecipe[] = [
  { id: 1, name: "Akara (Bean Cakes)", category: "breakfast", calories: 180, protein: 8, carbs: 15, fat: 10 },
  { id: 2, name: "Moi Moi", category: "breakfast", calories: 200, protein: 10, carbs: 20, fat: 8 },
  { id: 3, name: "Yam & Egg Sauce", category: "breakfast", calories: 320, protein: 12, carbs: 45, fat: 10 },
  { id: 4, name: "Pap & Akara", category: "breakfast", calories: 280, protein: 9, carbs: 38, fat: 10 },
  { id: 5, name: "Plantain Porridge", category: "breakfast", calories: 340, protein: 6, carbs: 52, fat: 12 },
  { id: 6, name: "Bread & Scrambled Eggs", category: "breakfast", calories: 300, protein: 14, carbs: 35, fat: 12 },
  { id: 7, name: "Yam Porridge (Asaro)", category: "breakfast", calories: 310, protein: 8, carbs: 48, fat: 10 },
  { id: 8, name: "Pancakes (Nigerian Style)", category: "breakfast", calories: 250, protein: 6, carbs: 35, fat: 10 },
  { id: 9, name: "Fried Plantain & Beans", category: "breakfast", calories: 380, protein: 12, carbs: 55, fat: 14 },
  { id: 10, name: "Custard & Bread", category: "breakfast", calories: 280, protein: 7, carbs: 45, fat: 8 },
  { id: 11, name: "Pap & Moi Moi", category: "breakfast", calories: 290, protein: 11, carbs: 40, fat: 9 },
  { id: 12, name: "Oat Meal with Fruit", category: "breakfast", calories: 220, protein: 6, carbs: 38, fat: 5 },
  { id: 13, name: "Fried Yam & Pepper Sauce", category: "breakfast", calories: 350, protein: 8, carbs: 48, fat: 15 },
  { id: 14, name: "Boiled Yam & Garden Egg Sauce", category: "breakfast", calories: 290, protein: 7, carbs: 50, fat: 8 },
  { id: 15, name: "Masa (Rice Cakes)", category: "breakfast", calories: 200, protein: 5, carbs: 35, fat: 6 },

  { id: 16, name: "Jollof Rice", category: "lunch", calories: 380, protein: 8, carbs: 65, fat: 10 },
  { id: 17, name: "Efo Riro (Vegetable Soup)", category: "lunch", calories: 280, protein: 15, carbs: 12, fat: 18 },
  { id: 18, name: "Egusi Soup", category: "lunch", calories: 420, protein: 18, carbs: 15, fat: 30 },
  { id: 19, name: "Ofada Rice & Ayamase Sauce", category: "lunch", calories: 450, protein: 12, carbs: 58, fat: 18 },
  { id: 20, name: "Banga Soup", category: "lunch", calories: 390, protein: 16, carbs: 18, fat: 25 },
  { id: 21, name: "Edikang Ikong", category: "lunch", calories: 320, protein: 17, carbs: 10, fat: 22 },
  { id: 22, name: "Afang Soup", category: "lunch", calories: 340, protein: 16, carbs: 12, fat: 24 },
  { id: 23, name: "Beans & Plantain (Ewa Riro)", category: "lunch", calories: 380, protein: 14, carbs: 55, fat: 12 },
  { id: 24, name: "Okro Soup", category: "lunch", calories: 280, protein: 14, carbs: 15, fat: 18 },
  { id: 25, name: "Ogbono Soup", category: "lunch", calories: 400, protein: 15, carbs: 18, fat: 28 },
  { id: 26, name: "Bitter Leaf Soup (Ofe Onugbu)", category: "lunch", calories: 350, protein: 16, carbs: 14, fat: 24 },
  { id: 27, name: "White Rice & Stew", category: "lunch", calories: 420, protein: 12, carbs: 68, fat: 12 },
  { id: 28, name: "Fried Rice", category: "lunch", calories: 450, protein: 10, carbs: 62, fat: 18 },
  { id: 29, name: "Coconut Rice", category: "lunch", calories: 380, protein: 7, carbs: 58, fat: 14 },
  { id: 30, name: "Tuwo Shinkafa & Miyan Kuka", category: "lunch", calories: 360, protein: 10, carbs: 65, fat: 8 },
  { id: 31, name: "Amala & Ewedu Soup", category: "lunch", calories: 320, protein: 8, carbs: 58, fat: 8 },
  { id: 32, name: "Pounded Yam & Egusi", category: "lunch", calories: 520, protein: 16, carbs: 78, fat: 18 },
  { id: 33, name: "Fufu & Light Soup", category: "lunch", calories: 380, protein: 12, carbs: 68, fat: 10 },
  { id: 34, name: "Semo & Vegetable Soup", category: "lunch", calories: 350, protein: 10, carbs: 62, fat: 10 },
  { id: 35, name: "Abacha (African Salad)", category: "lunch", calories: 280, protein: 8, carbs: 32, fat: 14 },
  { id: 36, name: "Nkwobi", category: "lunch", calories: 380, protein: 28, carbs: 8, fat: 26 },
  { id: 37, name: "Fisherman Soup", category: "lunch", calories: 260, protein: 22, carbs: 10, fat: 16 },
  { id: 38, name: "Oha Soup", category: "lunch", calories: 330, protein: 15, carbs: 14, fat: 22 },
  { id: 39, name: "Native Rice (Iwuk Edesi)", category: "lunch", calories: 410, protein: 12, carbs: 56, fat: 16 },
  { id: 40, name: "Gizdodo (Gizzard & Plantain)", category: "lunch", calories: 420, protein: 18, carbs: 42, fat: 20 },

  { id: 41, name: "Pepper Soup", category: "dinner", calories: 220, protein: 20, carbs: 8, fat: 10 },
  { id: 42, name: "Vegetable Soup (Light)", category: "dinner", calories: 240, protein: 12, carbs: 10, fat: 16 },
  { id: 43, name: "Grilled Fish & Salad", category: "dinner", calories: 260, protein: 28, carbs: 8, fat: 12 },
  { id: 44, name: "Okro Soup (Light)", category: "dinner", calories: 200, protein: 10, carbs: 12, fat: 12 },
  { id: 45, name: "Steamed Fish & Vegetables", category: "dinner", calories: 240, protein: 26, carbs: 10, fat: 10 },
  { id: 46, name: "Light Efo Riro", category: "dinner", calories: 220, protein: 12, carbs: 10, fat: 14 },
  { id: 47, name: "Yam Porridge (Light)", category: "dinner", calories: 280, protein: 8, carbs: 44, fat: 8 },
  { id: 48, name: "Catfish Pepper Soup", category: "dinner", calories: 240, protein: 22, carbs: 6, fat: 14 },

  { id: 49, name: "Puff Puff", category: "snack", calories: 150, protein: 3, carbs: 22, fat: 6 },
  { id: 50, name: "Chin Chin", category: "snack", calories: 180, protein: 3, carbs: 24, fat: 8 },
  { id: 51, name: "Plantain Chips", category: "snack", calories: 160, protein: 1, carbs: 20, fat: 9 },
  { id: 52, name: "Coconut Candy", category: "snack", calories: 140, protein: 2, carbs: 18, fat: 7 },
  { id: 53, name: "Boli (Roasted Plantain)", category: "snack", calories: 140, protein: 2, carbs: 32, fat: 1 },
  { id: 54, name: "Meat Pie", category: "snack", calories: 320, protein: 8, carbs: 35, fat: 16 },
  { id: 55, name: "Samosa", category: "snack", calories: 180, protein: 6, carbs: 22, fat: 8 },
  { id: 56, name: "Fish Roll", category: "snack", calories: 200, protein: 10, carbs: 24, fat: 8 },
  { id: 57, name: "Groundnut (Roasted)", category: "snack", calories: 170, protein: 7, carbs: 6, fat: 14 },
  { id: 58, name: "Tiger Nut Drink (Kunu Aya)", category: "snack", calories: 120, protein: 2, carbs: 24, fat: 3 },
  { id: 59, name: "Akara Burger", category: "snack", calories: 280, protein: 12, carbs: 32, fat: 12 },
  { id: 60, name: "Yamarita (Egg Coated Yam)", category: "snack", calories: 250, protein: 8, carbs: 35, fat: 10 }
];
