import React, { useState } from 'react';
import {
  X,
  Heart,
  Clock,
  Star,
  Flame,
  Users,
  CheckCircle2,
  Share2,
  Printer,
  ShoppingBag,
  Calendar,
  Utensils,
  ChevronRight,
  Timer,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Recipe, MealType, DayPlan } from '../types';
import { useRecipeContext } from '../context/RecipeContext';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, onClose }) => {
  const {
    isFavorite,
    toggleFavorite,
    addIngredientsToShoppingList,
    assignMealToPlan,
    showToast,
  } = useRecipeContext();

  const favorite = isFavorite(recipe.id);

  // Scalable Servings
  const [servings, setServings] = useState(recipe.servings || 4);
  const scaleRatio = servings / (recipe.servings || 4);

  // Checked ingredients state
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Completed steps state
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Cooking Step Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeStepTimerIndex, setActiveStepTimerIndex] = useState<number | null>(null);

  // Meal Plan Dropdown state
  const [isMealPlanDropdownOpen, setIsMealPlanDropdownOpen] = useState(false);

  const days: DayPlan['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  // Timer interval handling
  React.useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      showToast(`⏰ Step Timer Complete for "${recipe.title}"!`, 'info');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimerForMinutes = (mins: number, stepIndex: number) => {
    setTimerSeconds(mins * 60);
    setActiveStepTimerIndex(stepIndex);
    setIsTimerRunning(true);
    showToast(`Started ${mins} min timer for Step ${stepIndex + 1}`, 'info');
  };

  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStepComplete = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Recipe link copied to clipboard! 📋', 'success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-[#0B1121] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Hero Image */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 bg-slate-950">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1121] via-[#0B1121]/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-2xl bg-[#0B1121]/80 text-slate-300 hover:text-white hover:bg-[#0B1121] border border-white/10 z-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Actions */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 z-20">
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className={`p-2.5 rounded-2xl backdrop-blur-md transition-all border ${
                favorite
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/40 border-rose-400'
                  : 'bg-[#0B1121]/80 text-slate-300 hover:text-rose-400 border-white/10'
              }`}
            >
              <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-2xl bg-[#0B1121]/80 backdrop-blur-md text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Share Recipe"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handlePrint}
              className="p-2.5 rounded-2xl bg-[#0B1121]/80 backdrop-blur-md text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Print Recipe"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>

          {/* Recipe Title & Core Meta Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-xl bg-purple-600/90 text-white text-[10px] font-bold uppercase tracking-widest border border-purple-400/30">
                {recipe.cuisine}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest">
                {recipe.diet}
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest">
                {recipe.difficulty}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif italic text-white tracking-tight">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>Prep Time</span>
              </div>
              <div className="text-sm font-bold text-slate-100 mt-1">{recipe.prepTime}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Calories</span>
              </div>
              <div className="text-sm font-bold text-slate-100 mt-1">
                {Math.round(recipe.calories * scaleRatio)} kcal
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-center space-x-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Rating</span>
              </div>
              <div className="text-sm font-bold text-slate-100 mt-1">
                {recipe.rating} ({recipe.reviewsCount} reviews)
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-center space-x-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Servings</span>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-5 h-5 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-purple-600 transition-colors"
                >
                  -
                </button>
                <span className="text-sm font-bold text-slate-100">{servings}</span>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-5 h-5 rounded-lg bg-white/10 text-white text-xs font-bold hover:bg-purple-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Row: Add to Shopping List & Add to Meal Plan */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30">
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-300">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Scaled for {servings} serving{servings > 1 ? 's' : ''}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => addIngredientsToShoppingList(recipe)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 border border-purple-400/30 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Ingredients to Shopping List</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsMealPlanDropdownOpen(!isMealPlanDropdownOpen)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Add to Meal Plan</span>
                </button>

                {isMealPlanDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0B1121] border border-white/10 rounded-2xl shadow-2xl p-2 z-30 max-h-60 overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-400 px-2.5 py-1 uppercase tracking-wider">Select Day & Meal</p>
                    {days.map((day) => (
                      <div key={day} className="mb-1">
                        <span className="text-[11px] font-bold text-purple-400 px-2 py-0.5 block">{day}</span>
                        <div className="grid grid-cols-2 gap-1 px-1">
                          {mealTypes.map((meal) => (
                            <button
                              key={meal}
                              onClick={() => {
                                assignMealToPlan(day, meal, recipe);
                                setIsMealPlanDropdownOpen(false);
                              }}
                              className="text-[10px] text-left px-2 py-1 rounded bg-white/5 hover:bg-purple-600 text-slate-300 hover:text-white capitalize transition-colors"
                            >
                              {meal}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Timer Bar if Running */}
          {timerSeconds > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Timer className="w-5 h-5 text-amber-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-amber-300">
                    Step {activeStepTimerIndex !== null ? activeStepTimerIndex + 1 : ''} Timer
                  </span>
                  <p className="text-lg font-black text-white">{formatTimer(timerSeconds)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(0);
                  }}
                  className="p-2 rounded-xl bg-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Main Grid: Ingredients + Step Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Ingredients Column */}
            <div className="md:col-span-5 space-y-4">
              <h3 className="text-lg font-serif italic text-white flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <span>Ingredients</span>
              </h3>

              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                {recipe.ingredients.map((ing) => {
                  const scaledAmount = (ing.amount * scaleRatio).toFixed(1).replace(/\.0$/, '');
                  const isChecked = checkedIngredients[ing.id];
                  return (
                    <div
                      key={ing.id}
                      onClick={() => toggleIngredientCheck(ing.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                        isChecked ? 'bg-purple-950/20 line-through text-slate-500' : 'hover:bg-white/5 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3 text-xs font-medium">
                        <input
                          type="checkbox"
                          checked={!!isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                        />
                        <span>{ing.name}</span>
                      </div>
                      <span className="text-xs font-bold text-purple-400">
                        {scaledAmount} {ing.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Instructions Column */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-lg font-serif italic text-white flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-emerald-400" />
                <span>Step-by-Step Preparation</span>
              </h3>

              <div className="space-y-3">
                {recipe.instructions.map((step, idx) => {
                  const isCompleted = completedSteps[idx];
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCompleted
                          ? 'bg-[#0B1121] border-white/10 opacity-60'
                          : 'bg-white/5 border-white/10 hover:border-purple-500/40'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleStepComplete(idx)}
                          className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-white/10 text-slate-300 hover:bg-purple-600 hover:text-white'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p className={`text-xs sm:text-sm leading-relaxed ${isCompleted ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                            {step}
                          </p>

                          {/* Step Timer Trigger if step mentions time */}
                          {step.match(/(\d+)\s*(mins|minutes)/i) && (
                            <button
                              onClick={() => {
                                const match = step.match(/(\d+)\s*(mins|minutes)/i);
                                if (match) startTimerForMinutes(parseInt(match[1], 10), idx);
                              }}
                              className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-[11px] font-semibold transition-colors"
                            >
                              <Timer className="w-3 h-3 text-amber-400" />
                              <span>Set Timer ({step.match(/(\d+)\s*(mins|minutes)/i)?.[0]})</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Nutrition Facts */}
          <div className="p-5 rounded-2xl bg-[#0B1121] border border-white/10">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Nutrition Facts (Per Serving)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-slate-400 font-semibold block">Protein</span>
                <span className="text-xl font-serif italic text-purple-400">{Math.round((recipe.nutrition.protein || 0) * scaleRatio)}g</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-slate-400 font-semibold block">Carbs</span>
                <span className="text-xl font-serif italic text-amber-400">{Math.round((recipe.nutrition.carbs || 0) * scaleRatio)}g</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-slate-400 font-semibold block">Fat</span>
                <span className="text-xl font-serif italic text-rose-400">{Math.round((recipe.nutrition.fat || 0) * scaleRatio)}g</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[11px] text-slate-400 font-semibold block">Fiber</span>
                <span className="text-xl font-serif italic text-emerald-400">{Math.round((recipe.nutrition.fiber || 0) * scaleRatio)}g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
