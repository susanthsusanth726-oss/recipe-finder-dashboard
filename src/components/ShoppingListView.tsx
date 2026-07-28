import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  Copy,
  Printer,
  Sparkles,
  Apple,
  Fish,
  Milk,
  Wheat,
  Flame
} from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';
import { ShoppingItem } from '../types';

export const ShoppingListView: React.FC = () => {
  const {
    shoppingList,
    addCustomShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    clearCompletedShoppingItems,
    clearAllShoppingItems,
    showToast
  } = useRecipeContext();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ShoppingItem['category']>('Produce');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');

  const categories: ShoppingItem['category'][] = [
    'Produce',
    'Meat & Seafood',
    'Dairy & Eggs',
    'Pantry & Grains',
    'Baking & Spices',
    'Other'
  ];

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCustomShoppingItem(name, amount, category);
    setName('');
    setAmount('');
  };

  const handleExportText = () => {
    if (shoppingList.length === 0) {
      showToast('Shopping list is empty!', 'info');
      return;
    }
    const textLines = shoppingList.map(
      (item) => `[${item.completed ? 'X' : ' '}] ${item.name} (${item.amount}) - ${item.category}`
    );
    const fullText = `FLAVORCRAFT SHOPPING LIST:\n====================\n` + textLines.join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText);
      showToast('Shopping list copied to clipboard! 📋', 'success');
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const filteredItems = selectedFilterCategory === 'All'
    ? shoppingList
    : shoppingList.filter((item) => item.category === selectedFilterCategory);

  const pendingCount = shoppingList.filter((i) => !i.completed).length;
  const completedCount = shoppingList.filter((i) => i.completed).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[32px] bg-white/5 border border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-amber-400 mb-1 uppercase tracking-widest">
            <ShoppingBag className="w-4 h-4" />
            <span>Grocery & Pantry Checklist</span>
          </div>
          <h2 className="text-2xl font-serif italic text-white tracking-tight">Smart Shopping List</h2>
          <p className="text-xs text-slate-400 mt-1">
            {pendingCount} pending items • {completedCount} checked off
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportText}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            <span>Copy Text</span>
          </button>

          <button
            onClick={handlePrintPDF}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print / PDF</span>
          </button>

          {completedCount > 0 && (
            <button
              onClick={clearCompletedShoppingItems}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Done</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Item Bar */}
      <form
        onSubmit={handleAddCustom}
        className="p-4 rounded-[32px] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-3"
      >
        <input
          type="text"
          placeholder="Add item (e.g. Organic Avocados)..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full md:flex-1 px-4 py-2.5 rounded-2xl bg-[#0B1121] border border-white/10 text-slate-100 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="text"
          placeholder="Amount (e.g. 2 bags, 500g)..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full md:w-44 px-4 py-2.5 rounded-2xl bg-[#0B1121] border border-white/10 text-slate-100 placeholder-slate-400 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ShoppingItem['category'])}
          className="w-full md:w-44 px-4 py-2.5 rounded-2xl bg-[#0B1121] border border-white/10 text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full md:w-auto px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-900/40 flex items-center justify-center space-x-1.5 transition-colors border border-purple-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </form>

      {/* Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilterCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedFilterCategory === cat
                ? 'bg-purple-600 text-white border-purple-400/30 shadow-lg shadow-purple-950/40'
                : 'bg-white/5 text-slate-400 hover:text-slate-200 border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Shopping Items List */}
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-serif italic text-slate-200">Your shopping list is empty</p>
            <p className="text-xs text-slate-500 mt-1">
              Add ingredients directly from recipe cards or type custom groceries above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleShoppingItem(item.id)}
                className={`py-3.5 px-2 flex items-center justify-between cursor-pointer transition-colors hover:bg-white/5 rounded-xl ${
                  item.completed ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="w-5 h-5 rounded-md text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                  />
                  <div>
                    <span
                      className={`text-sm font-bold ${
                        item.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.recipeSource && (
                      <span className="block text-[10px] text-purple-400 font-medium">
                        From: {item.recipeSource}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs font-semibold text-purple-300 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                    {item.amount}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] text-slate-400 bg-[#0B1121] px-2.5 py-1 rounded-xl border border-white/10 font-medium">
                    {item.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteShoppingItem(item.id);
                    }}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
