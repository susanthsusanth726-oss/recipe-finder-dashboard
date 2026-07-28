import React, { useState } from 'react';
import {
  Sparkles,
  Utensils,
  Plus,
  X,
  RefreshCw,
  BookmarkPlus,
  HelpCircle,
  Lightbulb,
  ChefHat
} from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';
import { Recipe } from '../types';

export const AIChefModal: React.FC = () => {
  const { addCustomRecipe, showToast } = useRecipeContext();

  const [activeTab, setActiveTab] = useState<'pantry' | 'substitute' | 'generator'>('pantry');

  // Pantry state
  const [ingredientInput, setIngredientInput] = useState('');
  const [pantryIngredients, setPantryIngredients] = useState<string[]>([
    'Chicken Thighs',
    'Garlic',
    'Tomatoes',
    'Heavy Cream',
    'Olive Oil'
  ]);
  const [dietary, setDietary] = useState('High Protein');
  const [maxTime, setMaxTime] = useState('30');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);

  // Substitute state
  const [subIngredient, setSubIngredient] = useState('');
  const [substitutesResult, setSubstitutesResult] = useState<any[]>([]);
  const [isSubLoading, setIsSubLoading] = useState(false);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientInput.trim()) return;
    if (!pantryIngredients.includes(ingredientInput.trim())) {
      setPantryIngredients((prev) => [...prev, ingredientInput.trim()]);
    }
    setIngredientInput('');
  };

  const handleRemoveIngredient = (ing: string) => {
    setPantryIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const handleGeneratePantryRecipes = async () => {
    if (pantryIngredients.length === 0) {
      showToast('Please add at least 1 ingredient from your pantry!', 'info');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/pantry-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: pantryIngredients,
          dietary,
          maxTime
        }),
      });

      const data = await res.json();
      if (data.recipes && Array.isArray(data.recipes)) {
        setGeneratedRecipes(data.recipes);
        showToast('Generated AI Chef Recipes! 🍳', 'success');
      } else {
        showToast('Could not generate recipes. Try adding more ingredients.', 'warning');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Error communicating with AI Chef service.', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFindSubstitute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subIngredient.trim()) return;

    setIsSubLoading(true);
    try {
      const res = await fetch('/api/ai/substitute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient: subIngredient.trim() }),
      });
      const data = await res.json();
      if (data.substitutes) {
        setSubstitutesResult(data.substitutes);
      }
    } catch (err: any) {
      console.error(err);
      showToast('Failed to find substitute.', 'warning');
    } finally {
      setIsSubLoading(false);
    }
  };

  const handleSaveRecipeToApp = (aiRec: Recipe) => {
    const formattedRecipe: Recipe = {
      ...aiRec,
      id: 'ai-saved-' + Date.now(),
      rating: 4.9,
      reviewsCount: 1,
      image: aiRec.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      difficulty: 'Medium',
      ingredients: (aiRec.ingredients || []).map((i: any, idx: number) => ({
        id: 'ai-i-' + idx,
        name: typeof i === 'string' ? i : i.name,
        amount: 1,
        unit: 'portion',
        category: 'Pantry'
      })),
      instructions: aiRec.instructions || ['Cook ingredients together until thoroughly done.'],
      nutrition: aiRec.nutrition || { calories: 400, protein: 25, carbs: 30, fat: 15 },
      tags: ['AI Generated', 'Pantry Creation']
    };

    addCustomRecipe(formattedRecipe);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-[32px] bg-gradient-to-r from-purple-950/80 via-[#0B1121] to-indigo-950/80 border border-purple-500/30 shadow-2xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold border border-amber-400/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-serif italic text-white tracking-tight">AI Culinary Assistant</h2>
            <p className="text-xs text-slate-300">
              Powered by Gemini AI — Turn your fridge leftovers into gourmet meals & find culinary substitutes.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center space-x-2 mt-6">
          <button
            onClick={() => setActiveTab('pantry')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'pantry'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40 border border-purple-400/30'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            Pantry Recipe Matcher
          </button>
          <button
            onClick={() => setActiveTab('substitute')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'substitute'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40 border border-purple-400/30'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            Ingredient Substitute Finder
          </button>
        </div>
      </div>

      {/* Pantry Recipe Matcher Section */}
      {activeTab === 'pantry' && (
        <div className="space-y-6">
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-base font-serif italic text-white flex items-center space-x-2">
              <ChefHat className="w-4 h-4 text-purple-400" />
              <span>What ingredients do you have?</span>
            </h3>

            {/* Input Form */}
            <form onSubmit={handleAddIngredient} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type ingredient (e.g., Avocado, Shrimp, Garlic)..."
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#0B1121] border border-white/10 text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Added Ingredients Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {pantryIngredients.map((ing) => (
                <span
                  key={ing}
                  className="px-3 py-1.5 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center space-x-2"
                >
                  <span>{ing}</span>
                  <button
                    onClick={() => handleRemoveIngredient(ing)}
                    className="hover:text-rose-400 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Generate Trigger */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span>Diet:</span>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="px-3 py-1 rounded-xl bg-[#0B1121] border border-white/10 text-slate-200 text-xs font-semibold"
                >
                  <option value="Balanced">Balanced</option>
                  <option value="High Protein">High Protein</option>
                  <option value="Keto">Keto</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                </select>
              </div>

              <button
                onClick={handleGeneratePantryRecipes}
                disabled={isGenerating}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-purple-950/40 border border-purple-400/30 flex items-center space-x-2 transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI Chef is Cooking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Recipes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated AI Recipes Results */}
          {generatedRecipes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif italic text-white flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>AI Generated Recipes ({generatedRecipes.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedRecipes.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-[32px] bg-white/5 border border-purple-500/30 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-widest border border-purple-400/30">
                          {rec.cuisine || 'AI Custom'}
                        </span>
                        <h4 className="text-lg font-serif italic text-white mt-1">{rec.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-amber-400">{rec.prepTime || '20 mins'}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>

                    <div className="p-3 rounded-2xl bg-[#0B1121] border border-white/10 text-xs text-slate-300 space-y-1">
                      <span className="font-bold text-purple-300 block">Ingredients:</span>
                      <p>{Array.isArray(rec.ingredients) ? rec.ingredients.join(', ') : ''}</p>
                    </div>

                    <button
                      onClick={() => handleSaveRecipeToApp(rec)}
                      className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-purple-950/40 border border-purple-400/30 transition-colors"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Save to Recipe Collection</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Substitute Finder Section */}
      {activeTab === 'substitute' && (
        <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-serif italic text-white flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Missing an Ingredient? Find Smart Substitutes</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter any ingredient to get culinary substitution options and measurement ratios.
            </p>
          </div>

          <form onSubmit={handleFindSubstitute} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="e.g. Heavy Cream, Eggs, Buttermilk, Soy Sauce..."
              value={subIngredient}
              onChange={(e) => setSubIngredient(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-[#0B1121] border border-white/10 text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isSubLoading}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold border border-purple-400/30 transition-colors"
            >
              {isSubLoading ? 'Searching...' : 'Find Substitutes'}
            </button>
          </form>

          {substitutesResult.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-white/10">
              <h4 className="text-[10px] font-bold text-purple-300 uppercase tracking-widest">Substitutes for "{subIngredient}"</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {substitutesResult.map((sub, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#0B1121] border border-white/10 space-y-1">
                    <span className="text-sm font-serif italic text-white block">
                      {typeof sub === 'string' ? sub : sub.name}
                    </span>
                    {sub.ratio && <span className="text-xs text-amber-400 font-semibold">{sub.ratio}</span>}
                    {sub.note && <p className="text-xs text-slate-400">{sub.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
