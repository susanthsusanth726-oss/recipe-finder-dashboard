import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Recipe,
  FilterOptions,
  ActiveTab,
  ShoppingItem,
  DayPlan,
  UserProfile,
  AppNotification,
  CuisineType,
  DietType,
  MealType
} from '../types';
import {
  INITIAL_RECIPES,
  INITIAL_USER_PROFILE,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEAL_PLAN
} from '../data/recipes';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface RecipeContextType {
  recipes: Recipe[];
  favorites: string[]; // recipe IDs
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  filter: FilterOptions;
  setFilter: React.Dispatch<React.SetStateAction<FilterOptions>>;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  
  // Favorites Actions
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;

  // Shopping List
  shoppingList: ShoppingItem[];
  addIngredientsToShoppingList: (recipe: Recipe) => void;
  addCustomShoppingItem: (name: string, amount: string, category: ShoppingItem['category']) => void;
  toggleShoppingItem: (id: string) => void;
  deleteShoppingItem: (id: string) => void;
  clearCompletedShoppingItems: () => void;
  clearAllShoppingItems: () => void;

  // Meal Plan
  mealPlan: DayPlan[];
  assignMealToPlan: (day: DayPlan['day'], mealType: MealType, recipe: Recipe | null) => void;
  clearMealPlanDay: (day: DayPlan['day']) => void;

  // User & Theme & Notifications
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Modals & Drawers
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;
  isAiChefModalOpen: boolean;
  setIsAiChefModalOpen: (open: boolean) => void;
  isBarcodeModalOpen: boolean;
  setIsBarcodeModalOpen: (open: boolean) => void;
  isVoiceSearchModalOpen: boolean;
  setIsVoiceSearchModalOpen: (open: boolean) => void;

  // Custom Recipe Addition
  addCustomRecipe: (recipe: Recipe) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('rf_recipes');
    return saved ? JSON.parse(saved) : INITIAL_RECIPES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('rf_favorites');
    return saved ? JSON.parse(saved) : ['rec-1', 'rec-2', 'rec-3'];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const [filter, setFilter] = useState<FilterOptions>({
    searchQuery: '',
    cuisine: 'All',
    diet: 'All',
    maxCookingTime: 0,
    maxCalories: 0,
    difficulty: 'All',
  });

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('rf_shopping');
    if (saved) return JSON.parse(saved);
    return [
      { id: 's1', name: 'Arborio Rice', amount: '1.5 cups', category: 'Pantry & Grains', completed: false, recipeSource: 'Truffle Mushroom Risotto' },
      { id: 's2', name: 'Cremini Mushrooms', amount: '300g', category: 'Produce', completed: true, recipeSource: 'Truffle Mushroom Risotto' },
      { id: 's3', name: 'Heavy Cream', amount: '0.5 cup', category: 'Dairy & Eggs', completed: false, recipeSource: 'Butter Chicken Masala' },
      { id: 's4', name: 'Salmon Fillets', amount: '2 fillets', category: 'Meat & Seafood', completed: false, recipeSource: 'Salmon Bowl' },
      { id: 's5', name: 'Fresh Avocados', amount: '3 whole', category: 'Produce', completed: false, recipeSource: 'Keto Egg Boats' }
    ];
  });

  const [mealPlan, setMealPlan] = useState<DayPlan[]>(() => {
    const saved = localStorage.getItem('rf_meal_plan');
    return saved ? JSON.parse(saved) : INITIAL_MEAL_PLAN;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Modals state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAiChefModalOpen, setIsAiChefModalOpen] = useState(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
  const [isVoiceSearchModalOpen, setIsVoiceSearchModalOpen] = useState(false);

  // Toast feedback
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rf_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('rf_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('rf_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('rf_meal_plan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(recipeId);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter((id) => id !== recipeId);
      } else {
        showToast('Saved to favorites! ❤️', 'success');
        return [...prev, recipeId];
      }
    });
  };

  const isFavorite = (recipeId: string) => favorites.includes(recipeId);

  const addIngredientsToShoppingList = (recipe: Recipe) => {
    const newItems: ShoppingItem[] = recipe.ingredients.map((ing) => {
      let cat: ShoppingItem['category'] = 'Pantry & Grains';
      if (ing.category?.includes('Produce')) cat = 'Produce';
      else if (ing.category?.includes('Meat') || ing.category?.includes('Seafood')) cat = 'Meat & Seafood';
      else if (ing.category?.includes('Dairy') || ing.category?.includes('Eggs')) cat = 'Dairy & Eggs';
      else if (ing.category?.includes('Spices') || ing.category?.includes('Baking')) cat = 'Baking & Spices';

      return {
        id: 's-' + Math.random().toString(36).substr(2, 9),
        name: ing.name,
        amount: `${ing.amount} ${ing.unit}`,
        category: cat,
        completed: false,
        recipeSource: recipe.title,
      };
    });

    setShoppingList((prev) => [...prev, ...newItems]);
    showToast(`Added ${recipe.ingredients.length} items to Shopping List! 🛒`, 'success');
  };

  const addCustomShoppingItem = (name: string, amount: string, category: ShoppingItem['category']) => {
    if (!name.trim()) return;
    const newItem: ShoppingItem = {
      id: 's-' + Date.now(),
      name: name.trim(),
      amount: amount || '1',
      category,
      completed: false,
    };
    setShoppingList((prev) => [newItem, ...prev]);
    showToast(`Added "${name}" to shopping list`, 'success');
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const deleteShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompletedShoppingItems = () => {
    setShoppingList((prev) => prev.filter((item) => !item.completed));
    showToast('Cleared completed items', 'info');
  };

  const clearAllShoppingItems = () => {
    setShoppingList([]);
    showToast('Shopping list cleared', 'info');
  };

  const assignMealToPlan = (dayName: DayPlan['day'], mealType: MealType, recipe: Recipe | null) => {
    setMealPlan((prev) =>
      prev.map((d) => {
        if (d.day === dayName) {
          return {
            ...d,
            [mealType]: recipe,
          };
        }
        return d;
      })
    );
    if (recipe) {
      showToast(`Added ${recipe.title} to ${dayName} ${mealType}! 📅`, 'success');
    }
  };

  const clearMealPlanDay = (dayName: DayPlan['day']) => {
    setMealPlan((prev) =>
      prev.map((d) =>
        d.day === dayName
          ? { ...d, breakfast: null, lunch: null, dinner: null, snack: null }
          : d
      )
    );
    showToast(`Cleared plan for ${dayName}`, 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addCustomRecipe = (newRecipe: Recipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
    showToast(`Created new recipe: "${newRecipe.title}"! 👩‍🍳`, 'success');
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        favorites,
        activeTab,
        setActiveTab,
        filter,
        setFilter,
        selectedRecipe,
        setSelectedRecipe,
        toggleFavorite,
        isFavorite,
        shoppingList,
        addIngredientsToShoppingList,
        addCustomShoppingItem,
        toggleShoppingItem,
        deleteShoppingItem,
        clearCompletedShoppingItems,
        clearAllShoppingItems,
        mealPlan,
        assignMealToPlan,
        clearMealPlanDay,
        userProfile,
        setUserProfile,
        notifications,
        markNotificationRead,
        theme,
        toggleTheme,
        isFilterModalOpen,
        setIsFilterModalOpen,
        isAiChefModalOpen,
        setIsAiChefModalOpen,
        isBarcodeModalOpen,
        setIsBarcodeModalOpen,
        isVoiceSearchModalOpen,
        setIsVoiceSearchModalOpen,
        addCustomRecipe,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};
