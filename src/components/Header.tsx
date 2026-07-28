import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bell,
  Sun,
  Moon,
  Mic,
  Sparkles,
  QrCode,
  User,
  Check,
  ChevronDown,
  X,
  Utensils
} from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';

export const Header: React.FC = () => {
  const {
    filter,
    setFilter,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    userProfile,
    setIsFilterModalOpen,
    setIsAiChefModalOpen,
    setIsBarcodeModalOpen,
    setIsVoiceSearchModalOpen,
    recipes,
    setSelectedRecipe,
    setActiveTab,
  } = useRecipeContext();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Auto-suggestions based on search query
  const searchSuggestions = filter.searchQuery.trim()
    ? recipes.filter((r) =>
        r.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(filter.searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      {/* Global Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-xl mr-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search recipes, ingredients (e.g., garlic, salmon)..."
            value={filter.searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, searchQuery: e.target.value }));
              setIsSearchFocused(true);
            }}
            className="w-full pl-11 pr-20 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400/50 transition-all"
          />
          {filter.searchQuery && (
            <button
              onClick={() => setFilter((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-12 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsVoiceSearchModalOpen(true)}
            title="Voice Search"
            className="absolute right-3 p-1.5 rounded-xl text-slate-400 hover:text-purple-400 hover:bg-white/10 transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>

        {/* Autocomplete Dropdown */}
        {isSearchFocused && searchSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-12 mt-2 bg-[#0B1121] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
            <div className="p-3 text-xs font-semibold text-slate-400 border-b border-white/10 flex items-center justify-between">
              <span className="font-serif italic text-white text-sm">Matching Recipes</span>
              <span className="text-[10px] uppercase tracking-wider">{searchSuggestions.length} found</span>
            </div>
            {searchSuggestions.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setIsSearchFocused(false);
                }}
                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-white/5 text-left transition-colors border-b border-white/5 last:border-0"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-10 h-10 rounded-xl object-cover border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-serif italic text-slate-100 truncate">
                    {recipe.title}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center space-x-2">
                    <span className="text-purple-400 font-semibold">{recipe.cuisine}</span>
                    <span>•</span>
                    <span>{recipe.prepTime}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Header Controls */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* AI Pantry Chef Quick Button */}
        <button
          onClick={() => setIsAiChefModalOpen(true)}
          className="hidden sm:flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950/40 border border-purple-400/30 transition-all transform active:scale-95"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>AI Pantry Chef</span>
        </button>

        {/* Barcode Scanner Button */}
        <button
          onClick={() => setIsBarcodeModalOpen(true)}
          title="Scan Grocery Barcode"
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <QrCode className="w-4 h-4" />
        </button>

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className={`p-2.5 rounded-2xl border transition-all flex items-center space-x-1.5 text-xs font-medium ${
            filter.cuisine !== 'All' || filter.diet !== 'All' || filter.maxCookingTime > 0
              ? 'bg-purple-600/20 border-purple-500 text-purple-300'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden md:inline">Filters</span>
          {(filter.cuisine !== 'All' || filter.diet !== 'All') && (
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
          className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-amber-400 hover:bg-white/10 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 top-12 mt-2 w-80 bg-[#0B1121] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
                <span className="text-sm font-serif italic text-slate-100">Notifications</span>
                <span className="text-xs text-slate-400">{unreadCount} new</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 cursor-pointer hover:bg-white/5 transition-colors ${
                        !n.read ? 'bg-purple-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 pl-1 pr-2 py-1 rounded-2xl hover:bg-white/5 transition-colors"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/50"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 mt-2 w-60 bg-[#0B1121] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-2">
              <div className="p-3 border-b border-white/10 mb-1">
                <p className="text-xs font-bold text-slate-100">{userProfile.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{userProfile.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-semibold">
                  {userProfile.dietaryPreference}
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 flex items-center space-x-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('meal-planner');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 flex items-center space-x-2"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>My Meal Plan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
