export type UiRecipe = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  details: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

// Extracted from ui.tsx (truncated fields to only those we persist)
export const RECIPES: UiRecipe[] = [
  { id: 1, name: "Akara (Bean Cakes)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 2, name: "Moi Moi", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 3, name: "Yam & Egg Sauce", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 4, name: "Pap & Akara", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 5, name: "Plantain Porridge", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 6, name: "Bread & Scrambled Eggs", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 7, name: "Yam Porridge (Asaro)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 8, name: "Pancakes (Nigerian Style)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 9, name: "Fried Plantain & Beans", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 10, name: "Custard & Bread", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 11, name: "Pap & Moi Moi", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 12, name: "Oat Meal with Fruit", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 13, name: "Fried Yam & Pepper Sauce", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 14, name: "Boiled Yam & Garden Egg Sauce", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 15, name: "Masa (Rice Cakes)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},

  { id: 16, name: "Jollof Rice", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 17, name: "Efo Riro (Vegetable Soup)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 18, name: "Egusi Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 19, name: "Ofada Rice & Ayamase Sauce", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 20, name: "Banga Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 21, name: "Edikang Ikong", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 22, name: "Afang Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 23, name: "Beans & Plantain (Ewa Riro)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 24, name: "Okro Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 25, name: "Ogbono Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 26, name: "Bitter Leaf Soup (Ofe Onugbu)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 27, name: "White Rice & Stew", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 28, name: "Fried Rice", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 29, name: "Coconut Rice", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 30, name: "Tuwo Shinkafa & Miyan Kuka", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 31, name: "Amala & Ewedu Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 32, name: "Pounded Yam & Egusi", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 33, name: "Fufu & Light Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 34, name: "Semo & Vegetable Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 35, name: "Abacha (African Salad)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 36, name: "Nkwobi", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 37, name: "Fisherman Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 38, name: "Oha Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 39, name: "Native Rice (Iwuk Edesi)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 40, name: "Gizdodo (Gizzard & Plantain)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},

  { id: 41, name: "Pepper Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 42, name: "Vegetable Soup (Light)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 43, name: "Grilled Fish & Salad", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 44, name: "Okro Soup (Light)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 45, name: "Steamed Fish & Vegetables", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 46, name: "Light Efo Riro", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 47, name: "Yam Porridge (Light)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 48, name: "Catfish Pepper Soup", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},

  { id: 49, name: "Puff Puff", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 50, name: "Chin Chin", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 51, name: "Plantain Chips", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 52, name: "Coconut Candy", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 53, name: "Boli (Roasted Plantain)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 54, name: "Meat Pie", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 55, name: "Samosa", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 56, name: "Fish Roll", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 57, name: "Groundnut (Roasted)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 58, name: "Tiger Nut Drink (Kunu Aya)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 59, name: "Akara Burger", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0},
  { id: 60, name: "Yamarita (Egg Coated Yam)", image_url: "", description: "", details: "", calories: 0, protein: 0, carbs: 0, fat: 0 }
];
