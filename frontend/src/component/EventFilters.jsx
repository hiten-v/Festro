import React from 'react';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaRedo, FaSortAmountDown } from 'react-icons/fa';

const EventFilters = ({
  searchTerm, setSearchTerm,
  locationFilter, setLocationFilter,
  priceFilter, setPriceFilter,
  dateRange, setDateRange,
  sortBy, setSortBy,
  resetFilters,
  handleLocationClick
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 h-fit sticky top-24 font-sans">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FaFilter className="text-[#702c2c] text-sm" /> Filters
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs text-stone-400 hover:text-[#702c2c] flex items-center gap-1 transition-colors font-medium uppercase tracking-wide"
          title="Reset all filters"
        >
          <FaRedo /> Reset
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Search Event</label>
        <div className="relative group">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#702c2c] transition-colors" />
          <input
            type="text"
            placeholder="Concert, Workshop..."
            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#702c2c]/10 focus:border-[#702c2c] outline-none transition-all text-sm font-medium text-slate-800 placeholder-stone-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Location with Auto-Detect */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">Location</label>
          <button
            onClick={handleLocationClick}
            className="text-[10px] font-bold text-[#702c2c] hover:underline flex items-center gap-1 cursor-pointer bg-[#702c2c]/5 px-2 py-0.5 rounded-full"
          >
            <FaMapMarkerAlt /> Detect
          </button>
        </div>
        <div className="relative group">
          <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#702c2c] transition-colors" />
          <input
            type="text"
            placeholder="City (e.g. Mumbai)"
            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#702c2c]/10 focus:border-[#702c2c] outline-none transition-all text-sm font-medium text-slate-800 placeholder-stone-400"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Date Range</label>
        <div className="flex flex-col gap-2">
          <div className="relative">
            <input
              type="date"
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#702c2c]/10 focus:border-[#702c2c] outline-none transition-all text-sm text-stone-600"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div className="relative">
            <input
              type="date"
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#702c2c]/10 focus:border-[#702c2c] outline-none transition-all text-sm text-stone-600"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Sort By</label>
        <div className="relative max-w-full">
          <FaSortAmountDown className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#702c2c]/10 focus:border-[#702c2c] outline-none transition-all text-sm font-medium text-slate-800 appearance-none cursor-pointer"
          >
            <option value="date">Date (Soonest)</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>

      {/* Price/Type */}
      <div className="mb-2">
        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Price Type</label>
        <div className="flex flex-col gap-2">
          {['all', 'free', 'paid'].map((filter) => (
            <label key={filter} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${priceFilter === filter ? 'border-[#702c2c] bg-[#702c2c]' : 'border-stone-300 bg-white group-hover:border-[#702c2c]'}`}>
                {priceFilter === filter && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <input
                type="radio"
                name="priceFilter"
                className="hidden"
                checked={priceFilter === filter}
                onChange={() => setPriceFilter(filter)}
              />
              <span className={`text-sm capitalize transition-colors ${priceFilter === filter ? 'text-slate-900 font-bold' : 'text-stone-600 font-medium'}`}>{filter}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EventFilters;