import React from 'react';
import { Search, Shuffle, Calendar, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';

export const WelcomeBanner: React.FC = () => {
  const {
    userProfile,
    recipes,
    setSelectedRecipe,
    setActiveTab,
    setIsAiChefModalOpen,
    showToast,
  } = useRecipeContext();

  const hour = new Date().getHours();
  let timeGreeting = 'Good evening';
  let timeEmoji = '🍽️';

  if (hour < 12) {
    timeGreeting = 'Good morning';
    timeEmoji = '☕';
  } else if (hour < 17) {
    timeGreeting = 'Good afternoon';
    timeEmoji = '🥗';
  }

  const handleRandomRecipe = () => {
    if (recipes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const randomRecipe = recipes[randomIndex];
    setSelectedRecipe(randomRecipe);
    showToast(`Discovered: "${randomRecipe.title}" 🎲`, 'info');
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-white/5 border border-white/10 p-6 md:p-8 shadow-2xl">
      {/* Decorative background ambient circles */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            <span className="uppercase text-[10px] tracking-widest">Master Chef Experience</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif italic text-white tracking-tight">
            {timeGreeting}, {userProfile.name.split(' ')[0]}! {timeEmoji}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
            What are we cooking today? Discover tailored recipes, manage your weekly nutrition, or let AI generate meals with your pantry ingredients.
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setActiveTab('discover')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 border border-purple-400/30 transition-all transform active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>Search Recipe</span>
          </button>

          <button
            onClick={handleRandomRecipe}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-all transform active:scale-95"
          >
            <Shuffle className="w-4 h-4 text-amber-400" />
            <span>Random Recipe</span>
          </button>

          <button
            onClick={() => setActiveTab('meal-planner')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-all transform active:scale-95"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Add Meal Plan</span>
          </button>

          <button
            onClick={() => setIsAiChefModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-950/40 hover:opacity-95 transition-all transform active:scale-95 border border-amber-300/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Pantry AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
