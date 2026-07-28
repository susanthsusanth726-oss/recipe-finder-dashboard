import React from 'react';
import { Grid, ChevronRight } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';
import { CuisineType } from '../types';

export const CategoriesView: React.FC = () => {
  const { recipes, setFilter, setActiveTab } = useRecipeContext();

  const categoriesList: { name: CuisineType; image: string; description: string }[] = [
    {
      name: 'Italian',
      image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
      description: 'Creamy risottos, artisanal pastas, garlic herbs, and Parmigiano.'
    },
    {
      name: 'Indian',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
      description: 'Aromatic curries, rich masala gravies, tandoori spices, and warm naan.'
    },
    {
      name: 'Mexican',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
      description: 'Street tacos, zesty salsas, grilled steak, avocados, and fresh limes.'
    },
    {
      name: 'Asian',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      description: 'Seared salmon bowls, soy-ginger glaze, edamame, and stir-fries.'
    },
    {
      name: 'Healthy',
      image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
      description: 'Acai superfood bowls, protein power salads, and clean smoothies.'
    },
    {
      name: 'Desserts',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
      description: 'Molten chocolate lava cakes, sweet berries, and gourmet treats.'
    },
    {
      name: 'Mediterranean',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      description: 'Roasted chickpea bowls, Kalamata olives, feta cheese, and olive oil.'
    },
    {
      name: 'American',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
      description: 'Hearty keto breakfasts, avocado bacon boats, and comfort classics.'
    }
  ];

  const handleSelectCategory = (catName: CuisineType) => {
    setFilter((prev) => ({ ...prev, cuisine: catName }));
    setActiveTab('discover');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-[32px] bg-white/5 border border-white/10">
        <div className="flex items-center space-x-2 text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-widest">
          <Grid className="w-4 h-4" />
          <span>Explore Flavors</span>
        </div>
        <h2 className="text-2xl font-serif italic text-white tracking-tight">Trending Categories</h2>
        <p className="text-xs text-slate-400 mt-1">
          Browse our curated collection by international cuisines and dietary styles.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categoriesList.map((cat) => {
          const count = recipes.filter((r) => r.cuisine === cat.name).length;
          return (
            <div
              key={cat.name}
              onClick={() => handleSelectCategory(cat.name)}
              className="group relative h-64 rounded-[32px] overflow-hidden cursor-pointer border border-white/10 hover:border-purple-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-black/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-serif italic text-white group-hover:text-purple-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-600/80 text-white border border-purple-400/30">
                    {count} Recipe{count !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
