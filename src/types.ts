export type CuisineType = 
  | 'All' 
  | 'Italian' 
  | 'Indian' 
  | 'Mexican' 
  | 'Asian' 
  | 'Desserts' 
  | 'Healthy' 
  | 'Mediterranean' 
  | 'American' 
  | 'Japanese';

export type DietType = 
  | 'All' 
  | 'Keto' 
  | 'Vegan' 
  | 'Vegetarian' 
  | 'High Protein' 
  | 'Low Carb' 
  | 'Gluten-Free' 
  | 'Dairy-Free';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category?: string; // Produce, Dairy, Meat, Pantry, Bakery, Spices
  checked?: boolean;
}

export interface NutritionFacts {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;  // in grams
  sugar?: number;  // in grams
  sodium?: number; // in mg
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: CuisineType;
  diet: DietType;
  prepTime: string; // e.g. "20 mins"
  cookTime: string; // e.g. "25 mins"
  totalTimeMinutes: number;
  servings: number;
  calories: number;
  rating: number;
  reviewsCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionFacts;
  tags: string[];
  author?: string;
  sourceUrl?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DayPlan {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  dateStr?: string;
  breakfast?: Recipe | null;
  lunch?: Recipe | null;
  dinner?: Recipe | null;
  snack?: Recipe | null;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: 'Produce' | 'Meat & Seafood' | 'Dairy & Eggs' | 'Pantry & Grains' | 'Baking & Spices' | 'Other';
  completed: boolean;
  recipeSource?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  dietaryPreference: DietType;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'meal' | 'shopping' | 'recipe' | 'system';
}

export interface FilterOptions {
  searchQuery: string;
  cuisine: CuisineType;
  diet: DietType;
  maxCookingTime: number; // in minutes, 0 means any
  maxCalories: number;    // 0 means any
  difficulty: string;     // 'All' | 'Easy' | 'Medium' | 'Hard'
}

export type ActiveTab = 
  | 'dashboard' 
  | 'discover' 
  | 'categories' 
  | 'favorites' 
  | 'meal-planner' 
  | 'shopping-list' 
  | 'nutrition' 
  | 'ai-chef' 
  | 'settings';
