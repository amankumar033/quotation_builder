"use client";

import { useEffect, useState } from "react";
import { Hotel, Meal } from "@/types/type";
import { ArrowLeft, Check, Utensils, Search, Filter, X } from "lucide-react";
import { useQuotation } from "@/context/QuotationContext";

interface ProfessionalMealSelectionProps {
  hotel: Hotel;
  meals: Meal[];
  onMealsChange: (meals: Meal[]) => void;
  onProceed: () => void;
  onBack: () => void;
  theme: { bg: string; text: string; border: string };
}

export default function MealSelection({ hotel, meals, onMealsChange, onProceed, onBack, theme }: ProfessionalMealSelectionProps) {
  const { 
    currentEditingDay,
    currentDayMeals,
    setCurrentDayMeals,
    updateCurrentDayMealQuantity
  } = useQuotation();
  
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "veg" | "non-veg">("all");
  const [mealTypeFilter, setMealTypeFilter] = useState<"all" | "breakfast" | "lunch" | "dinner">("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filter meals based on hotel ID
  const filteredMeals = meals.filter((meal: Meal) => meal.hotelId === hotel?.id);

  // Apply search and filters
  const filteredAndSearchedMeals = filteredMeals.filter((meal: Meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || meal.category === categoryFilter;
    const matchesMealType = mealTypeFilter === "all" || meal.type === mealTypeFilter;
    
    return matchesSearch && matchesCategory && matchesMealType;
  });

  // Get quantity from current day meals
  const getMealQuantity = (mealId: number): number => {
    const selectedMeal = currentDayMeals.find((meal: Meal) => meal.id === mealId);
    return selectedMeal ? selectedMeal.quantity : 0;
  };

  const handleUpdateMealQuantity = (mealId: number, newQuantity: number): void => {
    const mealData = filteredMeals.find((meal: Meal) => meal.id === mealId);
    
    if (mealData) {
      // Update the meal quantity directly in the context
      updateCurrentDayMealQuantity(mealId, newQuantity, mealData);
    }
  };

  // Calculate total price from current day meals
  const totalMealPrice = currentDayMeals.reduce((total: number, meal: Meal) => total + (meal.price * meal.quantity), 0);
  const hasSelectedMeals = currentDayMeals.some((meal: Meal) => meal.quantity > 0);

  // Reset filters when hotel changes
  useEffect(() => {
    setSearchTerm("");
    setCategoryFilter("all");
    setMealTypeFilter("all");
  }, [hotel?.id]);

  // Initialize current day meals when component mounts
  useEffect(() => {
    if (currentEditingDay && filteredMeals.length > 0) {
      // Check if we need to initialize any meals
      const mealsWithQuantity = filteredMeals.map((meal: Meal) => {
        const existingMeal = currentDayMeals.find((m: Meal) => m.id === meal.id);
        return existingMeal || { ...meal, quantity: 0 };
      });
      
      // Only update if there are changes
      if (mealsWithQuantity.length !== currentDayMeals.length) {
        setCurrentDayMeals(mealsWithQuantity);
      }
    }
  }, [currentEditingDay, filteredMeals]);

  // Add this function at the top of MealSelection component
const scrollToTop = () => {
  window.scrollTo({ top: 800, behavior: 'smooth' });
};

// Update handleProceed to include scroll
const handleProceed = (): void => {
  // Pass the current day meals to parent
  onMealsChange(currentDayMeals.filter((meal: Meal) => meal.quantity > 0));
  onProceed();
  scrollToTop(); // Add this line
};

  const handleBack = (): void => {
    onBack();
  };

  // Show loading or empty state if no hotel found
  if (!hotel) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
          <p className="text-gray-500">No meal options found for {hotel.name}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Hotel Selection</span>
        </button>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">₹{totalMealPrice}</div>
          <div className="text-sm text-gray-500">Total Meal Cost</div>
        </div>
      </div>

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
          </button>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-blue-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Food Category
                </label>
                <div className="flex gap-3">
                  {[
                    { value: "all", label: "All", bg: "from-gray-400 to-gray-600" },
                    { value: "veg", label: "Vegetarian", bg: "from-green-400 to-green-600" },
                    { value: "non-veg", label: "Non-Veg", bg: "from-red-400 to-red-600" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCategoryFilter(option.value as any)}
                      className={`px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        categoryFilter === option.value
                          ? `bg-gradient-to-r ${option.bg} shadow-md scale-105`
                          : `bg-gradient-to-r ${option.bg} opacity-80 hover:opacity-100`
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Type Filter */}
              <div>
                <label className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
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

      {/* Meals Grid */}
      {filteredAndSearchedMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSearchedMeals.map((meal: Meal) => (
            <div key={meal.id} className="bg-white rounded-2xl border-2 border-blue-50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group">
              {/* Meal Image */}
              <div className="relative overflow-hidden">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
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
                      onClick={() => handleUpdateMealQuantity(meal.id, Math.max(0, getMealQuantity(meal.id) - 1))}
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

                {/* Current Selection Info */}
                {getMealQuantity(meal.id) > 0 && (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-700 font-medium">Selected:</span>
                      <span className="text-green-800 font-bold">
                        {getMealQuantity(meal.id)} × ₹{meal.price} = ₹{getMealQuantity(meal.id) * meal.price}
                      </span>
                    </div>
                  </div>
                )}
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

      {/* Action Buttons */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 shadow-xl sticky bottom-4 backdrop-blur-sm bg-white/80">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">Meal Selection Summary</h4>
              <p className="text-sm text-blue-600">
                {currentDayMeals.filter((meal: Meal) => meal.quantity > 0).length} meals selected for this day
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">₹{totalMealPrice}</div>
              <div className="text-sm text-blue-600 font-medium">Total meal cost</div>
            </div>
          </div>

          {/* Selected Meals Preview */}
          {currentDayMeals.filter((meal: Meal) => meal.quantity > 0).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {['breakfast', 'lunch', 'dinner'].map((type: string) => {
                const typeMeals = currentDayMeals.filter((meal: Meal) => meal.quantity > 0 && meal.type === type);
                if (typeMeals.length === 0) return null;
                
                return (
                  <div key={type} className="bg-white rounded-xl p-4 border-2 border-green-100 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-gray-900 capitalize">{type}</h5>
                      <span className="text-sm font-semibold text-green-600">
                        ₹{typeMeals.reduce((sum: number, meal: Meal) => sum + (meal.price * meal.quantity), 0)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {typeMeals.map((meal: Meal) => (
                        <div key={meal.id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{meal.name}</span>
                          <span className="font-medium text-gray-900">
                            {meal.quantity} × ₹{meal.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
              <p className="text-yellow-700 font-medium">No meals selected yet. Choose your meals to continue.</p>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              className="px-8 py-3 border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold"
            >
              Back to Hotels
            </button>
            <button
              onClick={handleProceed}
              disabled={!hasSelectedMeals}
              className={`px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 flex items-center space-x-2 ${
                hasSelectedMeals
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Room Selection</span>
              <Check className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}