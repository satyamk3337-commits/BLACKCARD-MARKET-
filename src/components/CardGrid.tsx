import React, { useState, useMemo } from 'react';
import { VirtualCard, CardCategory } from '../types';
import { CardItem } from './CardItem';
import { Search, SlidersHorizontal, ShieldAlert, Sparkles } from 'lucide-react';

interface CardGridProps {
  cards: VirtualCard[];
  onBuyCard: (card: VirtualCard) => void;
}

const CATEGORIES: CardCategory[] = [
  'All',
  'Infinite Black',
  'Platinum Credit',
  'Business Virtual',
  'Forex International',
  'High Limit',
  'Crypto Loaded',
];

export const CardGrid: React.FC<CardGridProps> = ({ cards, onBuyCard }) => {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredCards = useMemo(() => {
    let result = cards.filter((card) => {
      const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        card.title.toLowerCase().includes(q) ||
        card.bank.toLowerCase().includes(q) ||
        card.cardholder.toLowerCase().includes(q) ||
        card.type.toLowerCase().includes(q) ||
        card.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'limit-desc') {
      result.sort((a, b) => b.balance - a.balance);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [cards, selectedCategory, searchQuery, sortBy]);

  return (
    <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-8 mb-12 w-full">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`cat-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50 border border-purple-400'
                  : 'bg-[#0c1220] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat === 'All' ? '🌟 All Cards' : cat}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="card-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search card title, bank (HDFC, SBI, Axis), or limit..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs bg-[#0c111e] border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
            <span>Sort:</span>
          </div>
          <select
            id="card-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0c111e] border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="featured">Featured & Best Value</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="limit-desc">Balance: Highest First</option>
            <option value="rating-desc">Rating: Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between py-2.5 text-[11px] text-slate-400 border-b border-slate-800/80 mt-3 mb-6">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            SHOWING <span className="font-bold text-white">{filteredCards.length}</span> AVAILABLE VIRTUAL CARDS
          </span>
          {selectedCategory !== 'All' && (
            <span className="text-purple-300 font-normal">in {selectedCategory}</span>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Instant Digital Delivery • Automated Escrow Release</span>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {filteredCards.map((card) => (
            <CardItem key={card.id} card={card} onBuy={onBuyCard} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-[#090e1a]/60 rounded-3xl border border-slate-800 max-w-md mx-auto my-8">
          <ShieldAlert className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No Virtual Cards Found</h4>
          <p className="text-xs text-slate-400 mb-4">
            Try adjusting your search query or reset filter category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
