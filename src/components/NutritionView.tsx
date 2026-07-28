import React, { useState } from 'react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart, Flame, Target, Trophy, Edit3, Droplets, HeartPulse } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';

export const NutritionView: React.FC = () => {
  const { userProfile, setUserProfile, mealPlan, showToast } = useRecipeContext();
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetCalories, setTargetCalories] = useState(userProfile.calorieTarget);
  const [waterGlasses, setWaterGlasses] = useState(6);

  // Calculate today's or average planned macros across the week
  let totalCal = 0;
  let totalProt = 0;
  let totalCarb = 0;
  let totalFat = 0;

  // Let's sum Monday plan as default preview
  const mondayPlan = mealPlan[0];
  const activeMeals = [mondayPlan?.breakfast, mondayPlan?.lunch, mondayPlan?.dinner, mondayPlan?.snack].filter(Boolean);

  activeMeals.forEach((meal) => {
    if (meal) {
      totalCal += meal.calories || 0;
      totalProt += meal.nutrition.protein || 0;
      totalCarb += meal.nutrition.carbs || 0;
      totalFat += meal.nutrition.fat || 0;
    }
  });

  const chartData = [
    { name: 'Protein (g)', value: totalProt || 110, color: '#A855F7' },
    { name: 'Carbs (g)', value: totalCarb || 190, color: '#F59E0B' },
    { name: 'Fat (g)', value: totalFat || 60, color: '#F43F5E' },
  ];

  const handleSaveTarget = () => {
    setUserProfile((prev) => ({ ...prev, calorieTarget: targetCalories }));
    setIsEditingTarget(false);
    showToast(`Updated calorie target to ${targetCalories} kcal!`, 'success');
  };

  const calPercentage = Math.min(100, Math.round((totalCal / userProfile.calorieTarget) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] bg-white/5 border border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-400 mb-1 uppercase tracking-widest">
            <PieChart className="w-4 h-4" />
            <span>Health & Macro Analytics</span>
          </div>
          <h2 className="text-2xl font-serif italic text-white tracking-tight">Nutrition Overview</h2>
          <p className="text-xs text-slate-400 mt-1">
            Daily target intake based on your scheduled Monday meal plan.
          </p>
        </div>

        <button
          onClick={() => setIsEditingTarget(!isEditingTarget)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-colors"
        >
          <Edit3 className="w-4 h-4 text-purple-400" />
          <span>Edit Calorie Goal ({userProfile.calorieTarget} kcal)</span>
        </button>
      </div>

      {/* Edit Target Inline Form */}
      {isEditingTarget && (
        <div className="p-4 rounded-[28px] bg-purple-950/30 border border-purple-500/30 flex items-center space-x-3">
          <label className="text-xs font-bold text-slate-200 whitespace-nowrap">
            Daily Calorie Target (kcal):
          </label>
          <input
            type="number"
            value={targetCalories}
            onChange={(e) => setTargetCalories(Number(e.target.value))}
            className="w-32 px-3 py-1.5 rounded-xl bg-[#0B1121] border border-white/10 text-white text-xs font-bold"
          />
          <button
            onClick={handleSaveTarget}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold border border-purple-400/30"
          >
            Save Target
          </button>
        </div>
      )}

      {/* Main Grid: Recharts Donut + Macro Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recharts Donut Chart */}
        <div className="lg:col-span-5 p-6 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center justify-center">
          <h3 className="text-base font-serif italic text-white mb-2 self-start flex items-center space-x-2">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span>Macro Distribution</span>
          </h3>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1121', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#F8FAFC', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center mt-2">
            <p className="text-3xl font-serif italic text-white">{totalCal} kcal</p>
            <p className="text-xs text-slate-400 font-medium">Planned for Monday</p>
          </div>
        </div>

        {/* Macro Progress Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Calorie Budget Bar */}
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-200 flex items-center space-x-1.5 font-serif italic text-sm">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Daily Calories</span>
              </span>
              <span className="text-slate-400">
                {totalCal} / {userProfile.calorieTarget} kcal ({calPercentage}%)
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-[#0B1121] overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-purple-600 transition-all duration-500"
                style={{ width: `${calPercentage}%` }}
              />
            </div>
          </div>

          {/* Individual Macro Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Protein */}
            <div className="p-5 rounded-[28px] bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] font-bold text-purple-400 block uppercase tracking-widest">Protein</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-serif italic text-white">{totalProt}g</span>
                <span className="text-xs text-slate-400">Target: {userProfile.proteinTarget}g</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B1121] overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${Math.min(100, (totalProt / userProfile.proteinTarget) * 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="p-5 rounded-[28px] bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 block uppercase tracking-widest">Carbohydrates</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-serif italic text-white">{totalCarb}g</span>
                <span className="text-xs text-slate-400">Target: {userProfile.carbsTarget}g</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B1121] overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${Math.min(100, (totalCarb / userProfile.carbsTarget) * 100)}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="p-5 rounded-[28px] bg-white/5 border border-white/10 space-y-2">
              <span className="text-[10px] font-bold text-rose-400 block uppercase tracking-widest">Fats</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-serif italic text-white">{totalFat}g</span>
                <span className="text-xs text-slate-400">Target: {userProfile.fatTarget}g</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B1121] overflow-hidden">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{ width: `${Math.min(100, (totalFat / userProfile.fatTarget) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Water Tracker Widget */}
          <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-serif italic text-white">Daily Hydration Goal</h4>
                <p className="text-xs text-slate-400">{waterGlasses} of 8 glasses logged today</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10"
              >
                -
              </button>
              <span className="text-sm font-bold text-sky-400">{waterGlasses} 💧</span>
              <button
                onClick={() => setWaterGlasses(waterGlasses + 1)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
