import React, { useState } from 'react';
import { User, Settings, ShieldCheck, Sun, Moon, Bell, Check } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';
import { DietType } from '../types';

export const SettingsView: React.FC = () => {
  const { userProfile, setUserProfile, theme, toggleTheme, showToast } = useRecipeContext();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [diet, setDiet] = useState<DietType>(userProfile.dietaryPreference);
  const [targetCalories, setTargetCalories] = useState(userProfile.calorieTarget);
  const [proteinTarget, setProteinTarget] = useState(userProfile.proteinTarget);

  const diets: DietType[] = ['All', 'Keto', 'Vegan', 'Vegetarian', 'High Protein', 'Low Carb', 'Gluten-Free'];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile((prev) => ({
      ...prev,
      name,
      email,
      dietaryPreference: diet,
      calorieTarget: Number(targetCalories),
      proteinTarget: Number(proteinTarget),
    }));
    showToast('Profile settings saved successfully! ⚙️', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-widest">
          <Settings className="w-4 h-4" />
          <span>Account & Preferences</span>
        </div>
        <h2 className="text-2xl font-serif italic text-white tracking-tight">Settings</h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, dietary targets, and appearance.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-6">
        <h3 className="text-lg font-serif italic text-white flex items-center space-x-2">
          <User className="w-4 h-4 text-purple-400" />
          <span>User Profile Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#0B1121] border border-white/10 text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#0B1121] border border-white/10 text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-4">
          <h3 className="text-lg font-serif italic text-white">Dietary & Nutrition Targets</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Primary Dietary Style</label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value as DietType)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#0B1121] border border-white/10 text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {diets.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Daily Calorie Target (kcal)</label>
              <input
                type="number"
                value={targetCalories}
                onChange={(e) => setTargetCalories(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#0B1121] border border-white/10 text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-serif italic text-white">Appearance Theme</h4>
            <p className="text-xs text-slate-400">Current mode: {theme}</p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold flex items-center space-x-2"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 border border-purple-400/30"
        >
          Save Profile Changes
        </button>
      </form>
    </div>
  );
};
