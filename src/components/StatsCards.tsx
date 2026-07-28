import React from 'react';
import { BookOpen, Heart, Calendar, ShoppingCart, TrendingUp } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';

export const StatsCards: React.FC = () => {
  const { recipes, favorites, mealPlan, shoppingList, setActiveTab } = useRecipeContext();

  const totalRecipesCount = recipes.length;
  const savedRecipesCount = favorites.length;

  // Count planned meals across the week
  const plannedMealsCount = mealPlan.reduce((acc, day) => {
    let count = 0;
    if (day.breakfast) count++;
    if (day.lunch) count++;
    if (day.dinner) count++;
    if (day.snack) count++;
    return acc + count;
  }, 0);

  const pendingShoppingCount = shoppingList.filter((i) => !i.completed).length;
  const totalShoppingCount = shoppingList.length;

  const stats = [
    {
      title: 'Total Recipes',
      value: `${totalRecipesCount}`,
      subtitle: 'Curated & Custom',
      icon: BookOpen,
      color: 'from-purple-500 to-indigo-600',
      badge: '+12 this week',
      onClick: () => setActiveTab('discover'),
    },
    {
      title: 'Saved Recipes',
      value: `${savedRecipesCount}`,
      subtitle: 'In your Favorites',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      badge: 'Favorites',
      onClick: () => setActiveTab('favorites'),
    },
    {
      title: 'Weekly Meal Plans',
      value: `${plannedMealsCount}`,
      subtitle: 'Meals Scheduled',
      icon: Calendar,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Mon-Sun',
      onClick: () => setActiveTab('meal-planner'),
    },
    {
      title: 'Shopping Items',
      value: `${pendingShoppingCount}`,
      subtitle: `${totalShoppingCount - pendingShoppingCount}/${totalShoppingCount} Done`,
      icon: ShoppingCart,
      color: 'from-amber-500 to-orange-600',
      badge: 'Checklist',
      onClick: () => setActiveTab('shopping-list'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            onClick={s.onClick}
            className="group relative overflow-hidden p-5 rounded-[24px] bg-white/5 border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
                {s.title}
              </span>
              <div
                className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform border border-white/10`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Metric Value */}
            <div className="mt-3 flex items-baseline justify-between">
              <h3 className="text-3xl font-serif italic text-white tracking-tight">{s.value}</h3>
              <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-purple-300 border border-white/10">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span>{s.badge}</span>
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{s.subtitle}</p>

            {/* Bottom Glow bar on hover */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        );
      })}
    </div>
  );
};
