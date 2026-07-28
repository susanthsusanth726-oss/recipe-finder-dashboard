import React from 'react';
import { Heart, Clock, Star, Flame, Plus, Check, Utensils } from 'lucide-react';
import { Recipe } from '../types';
import { useRecipeContext } from '../context/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const {
    isFavorite,
    toggleFavorite,
    setSelectedRecipe,
    addIngredientsToShoppingList,
  } = useRecipeContext();

  const favorite = isFavorite(recipe.id);

  return (
    <div
      onClick={() => setSelectedRecipe(recipe)}
      className="group relative bg-white/5 rounded-[32px] border border-white/10 hover:border-purple-500/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/40 flex flex-col justify-between"
    >
      {/* Image Container with Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0B1121]">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Dark Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-slate-100 text-[10px] font-bold uppercase tracking-wider">
            {recipe.cuisine}
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-600/80 backdrop-blur-md border border-purple-400/30 text-white text-[10px] font-bold uppercase tracking-wider">
            {recipe.diet}
          </span>
        </div>

        {/* Heart Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-md transition-all duration-300 z-10 border border-white/10 ${
            favorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/50 scale-110 border-rose-400'
              : 'bg-black/50 text-slate-300 hover:text-rose-400 hover:bg-black/80'
          }`}
          title={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorite ? 'fill-current' : ''}`} />
        </button>

        {/* Rating and Cooking Time on Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200 z-10 font-semibold">
          <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>{recipe.prepTime}</span>
          </div>

          <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white">{recipe.rating}</span>
            <span className="text-slate-400 text-[10px]">({recipe.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-serif italic text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Nutrition and Difficulty Pills */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3 text-slate-300 font-medium">
            <span className="flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{recipe.calories} kcal</span>
            </span>
            <span>•</span>
            <span className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold">{recipe.difficulty}</span>
          </div>

          {/* Add to Shopping Quick Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addIngredientsToShoppingList(recipe);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-purple-600 border border-white/10 text-slate-300 hover:text-white transition-all"
            title="Add ingredients to shopping list"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
