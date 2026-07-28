import React from 'react';
import { WelcomeBanner } from './WelcomeBanner';
import { StatsCards } from './StatsCards';
import { RecipeCard } from './RecipeCard';
import { useRecipeContext } from '../context/RecipeContext';
import {
  Sparkles,
  Flame,
  Calendar,
  ShoppingBag,
  ArrowRight,
  PieChart as PieChartIcon
} from 'lucide-react';

export const MainDashboard: React.FC = () => {
  const {
    recipes,
    setActiveTab,
    setFilter,
    setSelectedRecipe,
    shoppingList,
    toggleShoppingItem,
    mealPlan
  } = useRecipeContext();

  const featuredRecipes = recipes.filter((r) => r.isFeatured).slice(0, 3);
  const recommendedRecipes = recipes.filter((r) => r.isRecommended).slice(0, 3);

  const categories = [
    { name: 'Italian', emoji: '🍝' },
    { name: 'Indian', emoji: '🍛' },
    { name: 'Mexican', emoji: '🌮' },
    { name: 'Asian', emoji: '🥢' },
    { name: 'Desserts', emoji: '🍰' },
    { name: 'Healthy', emoji: '🥗' },
  ];

  const pendingShopping = shoppingList.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner */}
      <WelcomeBanner />

      {/* 2. Statistics Cards */}
      <StatsCards />

      {/* 3. Featured Recipes Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">Chef's Selection</span>
            <h3 className="text-2xl font-serif italic text-white tracking-tight">Featured Recipes</h3>
          </div>
          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center space-x-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* 4. Trending Categories */}
      <section className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif italic text-white">Trending Categories</h3>
          <button
            onClick={() => setActiveTab('categories')}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
          >
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setFilter((prev) => ({ ...prev, cuisine: cat.name as any }));
                setActiveTab('discover');
              }}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-purple-600/30 border border-white/10 hover:border-purple-500/50 text-slate-200 hover:text-white flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-xs font-bold truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Recommended For You & Side Widgets (Weekly Planner Preview + Shopping Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended Recipes Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">Tailored for Alex</span>
              <h3 className="text-2xl font-serif italic text-white tracking-tight">Recommended For You</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recommendedRecipes.slice(0, 2).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>

        {/* Side Snippets Column: Meal Planner Preview & Shopping List Preview */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weekly Meal Planner Snippet */}
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-serif italic text-white">Today's Meal Plan</h4>
              </div>
              <button
                onClick={() => setActiveTab('meal-planner')}
                className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
              >
                Full Schedule
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-[#0B1121] border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Breakfast</span>
                  <span className="font-bold text-white">{mealPlan[0]?.breakfast?.title || 'Acai Smoothie Bowl'}</span>
                </div>
                <span className="text-amber-400 font-bold">{mealPlan[0]?.breakfast?.calories || 380} kcal</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0B1121] border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Lunch</span>
                  <span className="font-bold text-white">{mealPlan[0]?.lunch?.title || 'Chickpea Salad'}</span>
                </div>
                <span className="text-amber-400 font-bold">{mealPlan[0]?.lunch?.calories || 340} kcal</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#0B1121] border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Dinner</span>
                  <span className="font-bold text-white">{mealPlan[0]?.dinner?.title || 'Mushroom Risotto'}</span>
                </div>
                <span className="text-amber-400 font-bold">{mealPlan[0]?.dinner?.calories || 480} kcal</span>
              </div>
            </div>
          </div>

          {/* Shopping List Quick Checklist */}
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-serif italic text-white">Shopping Checklist</h4>
              </div>
              <button
                onClick={() => setActiveTab('shopping-list')}
                className="text-[10px] font-bold text-purple-400 hover:text-purple-300 uppercase tracking-wider"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {pendingShopping.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No pending items!</p>
              ) : (
                pendingShopping.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleShoppingItem(item.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#0B1121] border border-white/10 text-xs cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        className="rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                      />
                      <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                        {item.name}
                      </span>
                    </div>
                    <span className="text-purple-400 font-bold text-[10px]">{item.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
