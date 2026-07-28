import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  ShoppingBag,
  Sparkles,
  Utensils,
  ChevronRight,
  Flame,
  CheckCircle,
  X
} from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';
import { DayPlan, MealType, Recipe } from '../types';

export const MealPlannerView: React.FC = () => {
  const {
    mealPlan,
    assignMealToPlan,
    clearMealPlanDay,
    recipes,
    setSelectedRecipe,
    addIngredientsToShoppingList,
    showToast
  } = useRecipeContext();

  const [assigningSlot, setAssigningSlot] = useState<{ day: DayPlan['day']; meal: MealType } | null>(null);

  const mealSlots: { id: MealType; label: string; icon: string }[] = [
    { id: 'breakfast', label: 'Breakfast', icon: '☕' },
    { id: 'lunch', label: 'Lunch', icon: '🥗' },
    { id: 'dinner', label: 'Dinner', icon: '🍽️' },
    { id: 'snack', label: 'Snack', icon: '🍎' },
  ];

  // Sync entire weekly plan to shopping list
  const handleSyncWeeklyShoppingList = () => {
    let count = 0;
    mealPlan.forEach((d) => {
      [d.breakfast, d.lunch, d.dinner, d.snack].forEach((r) => {
        if (r) {
          addIngredientsToShoppingList(r);
          count++;
        }
      });
    });
    if (count > 0) {
      showToast(`Synced ingredients from ${count} planned meals to Shopping List! 🛒`, 'success');
    } else {
      showToast('No meals scheduled yet. Add meals first!', 'info');
    }
  };

  // Helper to calculate total day calories
  const getDayCalories = (d: DayPlan) => {
    let total = 0;
    if (d.breakfast) total += d.breakfast.calories;
    if (d.lunch) total += d.lunch.calories;
    if (d.dinner) total += d.dinner.calories;
    if (d.snack) total += d.snack.calories;
    return total;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] bg-white/5 border border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-widest">
            <CalendarIcon className="w-4 h-4" />
            <span>Weekly Nutrition Scheduler</span>
          </div>
          <h2 className="text-2xl font-serif italic text-white tracking-tight">Interactive Meal Planner</h2>
          <p className="text-xs text-slate-400 mt-1">
            Plan your meals for Monday through Sunday. Automatically track calories and sync ingredients to your shopping list.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSyncWeeklyShoppingList}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/30 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sync Ingredients to Shopping List</span>
          </button>
        </div>
      </div>

      {/* Days Grid (Mon-Sun) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {mealPlan.map((dayPlan) => {
          const totalCalories = getDayCalories(dayPlan);
          return (
            <div
              key={dayPlan.day}
              className="bg-white/5 border border-white/10 rounded-[28px] p-4 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                  <div>
                    <h3 className="text-sm font-serif italic text-white">{dayPlan.day}</h3>
                    <span className="text-[10px] text-purple-400 font-semibold">{dayPlan.dateStr}</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => clearMealPlanDay(dayPlan.day)}
                      title="Clear Day"
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Calorie Summary Pill */}
                <div className="flex items-center justify-between text-[10px] px-2.5 py-1 rounded-xl bg-[#0B1121] border border-white/10 text-slate-300 mb-3">
                  <span className="flex items-center space-x-1 font-bold">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>{totalCalories} kcal</span>
                  </span>
                  <span className="text-slate-500 font-medium">Daily</span>
                </div>

                {/* Meal Slots */}
                <div className="space-y-2.5">
                  {mealSlots.map((slot) => {
                    const assignedRecipe = dayPlan[slot.id];
                    return (
                      <div
                        key={slot.id}
                        className="p-2.5 rounded-2xl bg-[#0B1121] border border-white/10 flex flex-col justify-between min-h-[72px]"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          <span>
                            {slot.icon} {slot.label}
                          </span>
                          {assignedRecipe && (
                            <button
                              onClick={() => assignMealToPlan(dayPlan.day, slot.id, null)}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {assignedRecipe ? (
                          <div
                            onClick={() => setSelectedRecipe(assignedRecipe)}
                            className="cursor-pointer group flex items-center space-x-2 mt-1"
                          >
                            <img
                              src={assignedRecipe.image}
                              alt={assignedRecipe.title}
                              className="w-8 h-8 rounded-lg object-cover border border-white/10"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] font-serif italic text-slate-200 group-hover:text-purple-300 truncate">
                                {assignedRecipe.title}
                              </p>
                              <p className="text-[10px] text-slate-400">{assignedRecipe.calories} kcal</p>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningSlot({ day: dayPlan.day, meal: slot.id })}
                            className="w-full py-1.5 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-purple-500 hover:text-purple-300 text-slate-500 text-[10px] font-bold flex items-center justify-center space-x-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Meal</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Selection Modal when clicking "Add Meal" */}
      {assigningSlot && (
        <div
          onClick={() => setAssigningSlot(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-[#0B1121] border border-white/10 rounded-[32px] p-6 shadow-2xl max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-serif italic text-white capitalize">
                  Select {assigningSlot.meal} for {assigningSlot.day}
                </h3>
                <p className="text-xs text-slate-400">Choose from available recipes</p>
              </div>
              <button
                onClick={() => setAssigningSlot(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 overflow-y-auto space-y-2 mt-3 flex-1">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => {
                    assignMealToPlan(assigningSlot.day, assigningSlot.meal, recipe);
                    setAssigningSlot(null);
                  }}
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 hover:bg-purple-600/20 border border-white/10 cursor-pointer transition-colors"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-serif italic text-white truncate">{recipe.title}</h4>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span className="text-purple-400">{recipe.cuisine}</span>
                      <span>•</span>
                      <span>{recipe.prepTime}</span>
                      <span>•</span>
                      <span className="text-amber-400">{recipe.calories} kcal</span>
                    </p>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold border border-purple-400/30">
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
