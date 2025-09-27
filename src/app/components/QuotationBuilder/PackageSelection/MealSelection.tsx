"use client";

import { useEffect, useState } from "react";
import { QuotationData, Hotel, DaySelection, RoomSelection, Meal } from "@/types/type";
import { ChevronDown, ChevronUp, X, ArrowLeft, Check, Edit, Users, Crown, Bed, Star, Receipt, MapPin, Building, Calendar, CalendarDays, Utensils, Search, Filter } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";

interface PackageSelectionStepProps {
  data: QuotationData;
  updateData: (data: Partial<QuotationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

type RoomSelectionState = 'browsing' | 'selecting-meals' | 'selecting-rooms' | 'confirmed';

// Professional Meal Selection Component
interface ProfessionalMealSelectionProps {
  hotel: Hotel;
  meals: Meal[];
  onMealsChange: (meals: Meal[]) => void;
  onProceed: () => void;
  theme: { bg: string; text: string; border: string };
}

export default function MealSelection({ hotel, meals, onMealsChange, onProceed, theme }: ProfessionalMealSelectionProps) {
  const { hotelInfo, selectedMeals, updateMealQuantity } = useQuotation();
  
  // Since hotelInfo is an array, get the first hotel (or use the prop hotel if array is empty)
  const currentHotel = hotelInfo && hotelInfo.length > 0 ? hotelInfo[0] : hotel;
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [mealTypeFilter, setMealTypeFilter] = useState<"all" | "breakfast" | "lunch" | "dinner">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter meals based on hotel ID
  const filteredMeals = meals.filter(meal => meal.hotelId === currentHotel?.id);

  // Apply search and filters
  const filteredAndSearchedMeals = filteredMeals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || meal.category === categoryFilter;
    const matchesMealType = mealTypeFilter === "all" || meal.type === mealTypeFilter;
    
    return matchesSearch && matchesCategory && matchesMealType;
  });

  // Get quantity from context instead of local state
  const getMealQuantity = (mealId: number) => {
    const selectedMeal = selectedMeals.find(meal => meal.id === mealId);
    return selectedMeal ? selectedMeal.quantity : 0;
  };

  const handleUpdateMealQuantity = (mealId: number, newQuantity: number) => {
    // Find the complete meal data from the filtered meals
    const mealData = filteredMeals.find(meal => meal.id === mealId);
    
    if (mealData) {
      // Update in context with the full meal data
      updateMealQuantity(mealId, newQuantity, mealData);
    }
    
    // Also call the original callback if needed (for backward compatibility)
    if (onMealsChange) {
      const updatedMeals = meals.map(meal => 
        meal.id === mealId ? { ...meal, quantity: Math.max(0, newQuantity) } : meal
      );
      onMealsChange(updatedMeals);
    }
  };

  // Calculate total price from context meals
  const totalMealPrice = selectedMeals.reduce((total, meal) => total + (meal.price * meal.quantity), 0);
  const hasSelectedMeals = selectedMeals.some(meal => meal.quantity > 0);

  // Reset filters when hotel changes
  useEffect(() => {
    setSearchTerm("");
    setCategoryFilter("all");
    setMealTypeFilter("all");
  }, [currentHotel?.id]);

  // Show loading or empty state if no hotel found
  if (!currentHotel) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading hotel information...</p>
        </div>
      </div>
    );
  }

  if (filteredMeals.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meals Available</h3>
          <p className="text-gray-500">No meal options found for {currentHotel.name}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-lg p-5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-500" />
            </div>
            <input
              type="text"
              placeholder="Search meals by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition-all duration-300 placeholder-blue-300 text-blue-900 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
          >
            <Filter className="h-5 w-5" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-blue-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className=" text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Food Category
                </label>
                <div className="flex gap-3">
                  {[
                    { value: "all", label: "All", bg: "from-gray-400 to-gray-600", hover: "from-gray-500 to-gray-700" },
                    { value: "veg", label: "Vegetarian", bg: "from-green-400 to-green-600", hover: "from-green-500 to-green-700" },
                    { value: "non-veg", label: "Non-Veg", bg: "from-red-400 to-red-600", hover: "from-red-500 to-red-700" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCategoryFilter(option.value as any)}
                      className={`px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        categoryFilter === option.value
                          ? `bg-gradient-to-r ${option.bg} shadow-md scale-105`
                          : `bg-gradient-to-r ${option.bg} opacity-80 hover:opacity-100 hover:bg-gradient-to-r ${option.hover}`
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Type Filter */}
              <div>
                <label className=" text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Meal Type
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: "all", label: "All Types", color: "bg-gradient-to-r from-purple-400 to-purple-600" },
                    { value: "breakfast", label: "Breakfast", color: "bg-gradient-to-r from-orange-400 to-orange-600" },
                    { value: "lunch", label: "Lunch", color: "bg-gradient-to-r from-blue-400 to-blue-600" },
                    { value: "dinner", label: "Dinner", color: "bg-gradient-to-r from-indigo-400 to-indigo-600" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setMealTypeFilter(option.value as any)}
                      className={`px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        mealTypeFilter === option.value
                          ? `${option.color} shadow-md scale-105`
                          : `${option.color} opacity-80 hover:opacity-100`
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Badges */}
            {(categoryFilter !== "all" || mealTypeFilter !== "all") && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm font-medium text-blue-700">Active filters:</span>
                <div className="flex gap-2">
                  {categoryFilter !== "all" && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold capitalize">
                      {categoryFilter}
                    </span>
                  )}
                  {mealTypeFilter !== "all" && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold capitalize">
                      {mealTypeFilter}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
        <p className="text-blue-800 font-medium">
          Showing <span className="font-bold text-blue-600">{filteredAndSearchedMeals.length}</span> of{" "}
          <span className="font-bold text-blue-600">{filteredMeals.length}</span> meals
        </p>
        {(searchTerm || categoryFilter !== "all" || mealTypeFilter !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setMealTypeFilter("all");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Meals Grid - 4 columns */}
      {filteredAndSearchedMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSearchedMeals.map(meal => (
            <div key={meal.id} className="bg-white rounded-2xl border-2 border-blue-50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group">
              {/* Meal Image */}
              <div className="relative overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    meal.category === 'veg' 
                      ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                      : 'bg-gradient-to-r from-red-400 to-red-600 text-white'
                  }`}>
                    {meal.category.toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full capitalize shadow-lg">
                    {meal.type}
                  </span>
                </div>
              </div>

              {/* Meal Details */}
              <div className="p-5">
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">{meal.name}</h4>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ₹{meal.price}
                    <span className="text-sm text-gray-500 font-normal">/person</span>
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                  <span className="text-sm font-semibold text-gray-700 mr-2">Quantity:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleUpdateMealQuantity(meal.id, getMealQuantity(meal.id) - 1)}
                      className="w-9 h-9 rounded-full bg-gradient-to-r from-red-400 to-red-500 text-white flex items-center justify-center hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={getMealQuantity(meal.id) === 0}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-lg text-gray-900">{getMealQuantity(meal.id)}</span>
                    <button
                      onClick={() => handleUpdateMealQuantity(meal.id, getMealQuantity(meal.id) + 1)}
                      className="w-9 h-9 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white flex items-center justify-center hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Utensils className="h-10 w-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No meals found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setMealTypeFilter("all");
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Compact Professional Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 shadow-xl sticky bottom-4 backdrop-blur-sm bg-white/80">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">Meal Selection Summary</h4>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">₹{totalMealPrice}</div>
              <div className="text-sm text-blue-600 font-medium">Total meal cost</div>
            </div>
          </div>

          {/* Selected Meals Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {['breakfast', 'lunch', 'dinner'].map(type => {
              const typeMeals = selectedMeals.filter(meal => meal.quantity > 0 && meal.type === type);
              return typeMeals.length > 0 ? (
                <div key={type} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-100 shadow-lg">
                  <div className="font-bold text-blue-800 capitalize mb-3 text-sm flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      type === 'breakfast' ? 'bg-orange-500' : 
                      type === 'lunch' ? 'bg-blue-500' : 'bg-indigo-500'
                    }`}></div>
                    {type} ({typeMeals.length})
                  </div>
                  {typeMeals.map(meal => (
                    <div key={meal.id} className="flex justify-between text-xs text-gray-700 mb-2 font-medium">
                      <span className="truncate">{meal.name}</span>
                      <span className="text-blue-600 font-bold">{meal.quantity} × ₹{meal.price}</span>
                    </div>
                  ))}
                </div>
              ) : null;
            })}
          </div>

          <button
            onClick={onProceed}
            disabled={!hasSelectedMeals}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            {hasSelectedMeals ? (
              <>Proceed to Room Selection <span className="ml-2">→</span></>
            ) : (
              "Select at least one meal to continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}