import React from 'react';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';
import { CuisineType, DietType } from '../types';

interface FilterModalProps {
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ onClose }) => {
  const { filter, setFilter } = useRecipeContext();

  const cuisines: CuisineType[] = [
    'All',
    'Italian',
    'Indian',
    'Mexican',
    'Asian',
    'Desserts',
    'Healthy',
    'Mediterranean',
    'American'
  ];

  const diets: DietType[] = [
    'All',
    'Keto',
    'Vegan',
    'Vegetarian',
    'High Protein',
    'Low Carb',
    'Gluten-Free'
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const handleReset = () => {
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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#0B1121] border border-white/10 rounded-[32px] p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-serif italic text-white">Filter Recipes</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuisine Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Cuisine Type</label>
          <div className="flex flex-wrap gap-2">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setFilter((prev) => ({ ...prev, cuisine: c }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter.cuisine === c
                    ? 'bg-purple-600 text-white shadow-md border border-purple-400/30'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Preference */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Dietary Restrictions</label>
          <div className="flex flex-wrap gap-2">
            {diets.map((d) => (
              <button
                key={d}
                onClick={() => setFilter((prev) => ({ ...prev, diet: d }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter.diet === d
                    ? 'bg-purple-600 text-white shadow-md border border-purple-400/30'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Max Cooking Time Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Max Cooking Time</span>
            <span className="text-purple-400">
              {filter.maxCookingTime === 0 ? 'Any Time' : `Under ${filter.maxCookingTime} mins`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="120"
            step="10"
            value={filter.maxCookingTime}
            onChange={(e) => setFilter((prev) => ({ ...prev, maxCookingTime: Number(e.target.value) }))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Difficulty Level</label>
          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setFilter((prev) => ({ ...prev, difficulty: diff }))}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                  filter.difficulty === diff
                    ? 'bg-purple-600 text-white shadow-md border border-purple-400/30'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-white/10 flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold flex items-center justify-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 border border-purple-400/30"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
