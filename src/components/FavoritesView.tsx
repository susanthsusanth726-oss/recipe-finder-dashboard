import React from 'react';
import { Heart, BookOpen } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';
import { RecipeCard } from './RecipeCard';

export const FavoritesView: React.FC = () => {
  const { recipes, favorites, setActiveTab } = useRecipeContext();

  const favoriteRecipes = recipes.filter((r) => favorites.includes(r.id));

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-rose-400 mb-1 uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-current" />
            <span>Saved Recipes Collection</span>
          </div>
          <h2 className="text-2xl font-serif italic text-white tracking-tight">Your Favorites ({favoriteRecipes.length})</h2>
          <p className="text-xs text-slate-400 mt-1">
            Quick access to your saved favorite recipes.
          </p>
        </div>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-[32px]">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-serif italic text-white">No saved recipes yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Click the heart icon on any recipe card to add it to your favorites collection.
          </p>
          <button
            onClick={() => setActiveTab('discover')}
            className="mt-4 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 border border-purple-400/30"
          >
            Discover Recipes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};
