import React from 'react';
import { Compass, SlidersHorizontal, RotateCcw, Search } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';
import { RecipeCard } from './RecipeCard';
import { CuisineType, DietType } from '../types';

export const DiscoverView: React.FC = () => {
  const { recipes, filter, setFilter, setIsFilterModalOpen } = useRecipeContext();

  const cuisines: CuisineType[] = ['All', 'Italian', 'Indian', 'Mexican', 'Asian', 'Desserts', 'Healthy', 'Mediterranean', 'American'];
  const diets: DietType[] = ['All', 'Keto', 'Vegan', 'Vegetarian', 'High Protein', 'Low Carb', 'Gluten-Free'];

  // Filter Logic
  const filteredRecipes = recipes.filter((r) => {
    // Search Query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const titleMatch = r.title.toLowerCase().includes(q);
      const cuisineMatch = r.cuisine.toLowerCase().includes(q);
      const ingredientMatch = r.ingredients.some((i) => i.name.toLowerCase().includes(q));
      if (!titleMatch && !cuisineMatch && !ingredientMatch) return false;
    }

    // Cuisine
    if (filter.cuisine !== 'All' && r.cuisine !== filter.cuisine) return false;

    // Diet
    if (filter.diet !== 'All' && r.diet !== filter.diet) return false;

    // Cooking Time
    if (filter.maxCookingTime > 0 && r.totalTimeMinutes > filter.maxCookingTime) return false;

    // Difficulty
    if (filter.difficulty !== 'All' && r.difficulty !== filter.difficulty) return false;

    return true;
  });

  const handleResetFilters = () => {
    setFilter({
      searchQuery: '',
      cuisine: 'All',
      diet: 'All',
      maxCookingTime: 0,
      maxCalories: 0,
      difficulty: 'All',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-widest">
              <Compass className="w-4 h-4" />
              <span>Explore Recipe Catalog</span>
            </div>
            <h2 className="text-2xl font-serif italic text-white tracking-tight">Discover Recipes</h2>
            <p className="text-xs text-slate-400 mt-1">
              Showing {filteredRecipes.length} of {recipes.length} available recipes.
            </p>
          </div>

          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-purple-950/40 border border-purple-400/30"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Detailed Filters</span>
          </button>
        </div>

        {/* Cuisine Chips Horizontal Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setFilter((prev) => ({ ...prev, cuisine: c }))}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                filter.cuisine === c
                  ? 'bg-purple-600 text-white border-purple-400/50 shadow-md'
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Diet Chips Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {diets.map((d) => (
            <button
              key={d}
              onClick={() => setFilter((prev) => ({ ...prev, diet: d }))}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${
                filter.diet === d
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-[#0B1121] text-slate-400 hover:text-slate-200 border-white/10'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-[32px] space-y-3">
          <Search className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-serif italic text-white">No recipes found</h3>
          <p className="text-xs text-slate-400">
            No recipes matched your current filters. Try relaxing your search criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 text-white text-xs font-bold inline-flex items-center space-x-2 border border-purple-400/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};
