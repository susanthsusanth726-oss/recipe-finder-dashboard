import React from 'react';
import { RecipeProvider, useRecipeContext } from './context/RecipeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainDashboard } from './components/MainDashboard';
import { DiscoverView } from './components/DiscoverView';
import { CategoriesView } from './components/CategoriesView';
import { FavoritesView } from './components/FavoritesView';
import { MealPlannerView } from './components/MealPlannerView';
import { ShoppingListView } from './components/ShoppingListView';
import { NutritionView } from './components/NutritionView';
import { AIChefModal } from './components/AIChefModal';
import { SettingsView } from './components/SettingsView';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { FilterModal } from './components/FilterModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    selectedRecipe,
    setSelectedRecipe,
    isFilterModalOpen,
    setIsFilterModalOpen,
    isBarcodeModalOpen,
    setIsBarcodeModalOpen,
    isVoiceSearchModalOpen,
    setIsVoiceSearchModalOpen,
    toasts,
    removeToast,
    theme
  } = useRecipeContext();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MainDashboard />;
      case 'discover':
        return <DiscoverView />;
      case 'categories':
        return <CategoriesView />;
      case 'favorites':
        return <FavoritesView />;
      case 'meal-planner':
        return <MealPlannerView />;
      case 'shopping-list':
        return <ShoppingListView />;
      case 'nutrition':
        return <NutritionView />;
      case 'ai-chef':
        return <AIChefModal />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-purple-600 selection:text-white ${theme}`}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderActiveView()}
        </main>
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal onClose={() => setIsFilterModalOpen(false)} />
      )}

      {/* Barcode Scanner Modal */}
      {isBarcodeModalOpen && (
        <BarcodeScannerModal onClose={() => setIsBarcodeModalOpen(false)} />
      )}

      {/* Voice Search Modal */}
      {isVoiceSearchModalOpen && (
        <VoiceSearchModal onClose={() => setIsVoiceSearchModalOpen(false)} />
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl animate-fade-in"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-purple-400 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
            <span className="text-xs font-semibold">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 p-0.5 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  );
}
