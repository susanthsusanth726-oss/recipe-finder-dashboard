import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Grid,
  Heart,
  Calendar,
  ShoppingBag,
  PieChart,
  Sparkles,
  Settings,
  Menu,
  X,
  ChefHat
} from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';
import { ActiveTab } from '../types';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, favorites, shoppingList } = useRecipeContext();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const pendingShoppingCount = shoppingList.filter((i) => !i.completed).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'discover', label: 'Discover Recipes', icon: Compass },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favorites.length },
    { id: 'meal-planner', label: 'Meal Planner', icon: Calendar },
    { id: 'shopping-list', label: 'Shopping List', icon: ShoppingBag, badge: pendingShoppingCount || undefined },
    { id: 'nutrition', label: 'Nutrition Overview', icon: PieChart },
    { id: 'ai-chef', label: 'AI Pantry Chef', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: ActiveTab) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-5 right-5 z-50 p-3.5 bg-purple-600 text-white rounded-full shadow-2xl hover:bg-purple-500 transition-transform active:scale-95"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0B1121] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-20 px-6 flex items-center space-x-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-950/40 border border-white/10">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-serif italic text-white flex items-center space-x-1.5">
                <span>FlavorCraft</span>
                <span className="not-italic font-sans text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold uppercase tracking-wider border border-amber-500/30">
                  Pro
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Editorial Kitchen</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50 border border-purple-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Chef Helper Card Widget at bottom of sidebar */}
        <div className="p-4 m-3 rounded-[24px] bg-white/5 border border-white/10 text-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="font-serif italic text-sm text-amber-300">Pantry AI Assist</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Got leftover ingredients? Let AI create a custom dinner recipe for you!
          </p>
          <button
            onClick={() => handleSelect('ai-chef')}
            className="mt-3 w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/50 text-purple-200 text-[11px] font-bold uppercase tracking-wider transition-all"
          >
            Open Assistant
          </button>
        </div>
      </aside>
    </>
  );
};
