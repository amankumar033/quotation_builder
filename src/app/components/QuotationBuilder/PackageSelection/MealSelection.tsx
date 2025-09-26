"use client";

import { useEffect, useState } from "react";
import { QuotationData, Hotel, DaySelection, RoomSelection, Meal } from "@/types/type";
import { ChevronDown, ChevronUp, X, ArrowLeft, Check, Edit, Users, Crown, Bed, Star, Receipt, MapPin, Building, Calendar, CalendarDays, Utensils } from "lucide-react";
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
  // Define the type for expandedSections to allow string indexing
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    dinner: true
  });

  const updateMealQuantity = (mealId: number, quantity: number) => {
    const updatedMeals = meals.map(meal => 
      meal.id === mealId ? { ...meal, quantity: Math.max(0, quantity) } : meal
    );
    onMealsChange(updatedMeals);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getMealsByType = (type: string) => {
    return meals.filter(meal => meal.type === type);
  };

  const totalMealPrice = meals.reduce((total, meal) => total + (meal.price * meal.quantity), 0);
  const hasSelectedMeals = meals.some(meal => meal.quantity > 0);

  return (
    <div className="space-y-6">
      {/* Header - Made more compact */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Meals</h3>
        <p className="text-gray-600">Choose from our premium dining options for your stay</p>
      </div>

      {/* Meal Types with Accordion */}
      {['breakfast', 'lunch', 'dinner'].map(mealType => (
        <div key={mealType} className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Accordion Header */}
          <div 
            className={`p-5 cursor-pointer transition-all duration-200 ${
              expandedSections[mealType] 
                ? `bg-gradient-to-r ${theme.bg} rounded-t-xl`
                : 'bg-gray-50 hover:bg-gray-100 rounded-xl'
            }`}
            onClick={() => toggleSection(mealType)}
          >
            <div className="flex justify-between items-center">
              <h4 className={`text-lg font-bold capitalize flex items-center ${
                expandedSections[mealType] ? 'text-white' : 'text-gray-900'
              }`}>
                <Utensils className="h-5 w-5 mr-2" />
                {mealType} Options
              </h4>
              <div className="flex items-center">
                <ChevronDown 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    expandedSections[mealType] ? 'rotate-180 text-white' : 'text-gray-600'
                  }`}
                />
              </div>
            </div>
          </div>
          
          {/* Accordion Content */}
          {expandedSections[mealType] && (
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {getMealsByType(mealType).map(meal => (
                  <div key={meal.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300">
                    <div className="flex">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-28 h-28 object-cover rounded-l-lg"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-gray-900">{meal.name}</h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            meal.category === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {meal.category.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-blue-600">₹{meal.price}/person</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMealQuantity(meal.id, meal.quantity - 1);
                              }}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-900">{meal.quantity}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateMealQuantity(meal.id, meal.quantity + 1);
                              }}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Compact Professional Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Meal Selection Summary</h4>
              <p className="text-gray-600 text-sm">Review your meal choices before proceeding</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹{totalMealPrice}</div>
              <div className="text-sm text-gray-500">Total meal cost</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {['breakfast', 'lunch', 'dinner'].map(type => {
              const typeMeals = meals.filter(meal => meal.quantity > 0 && meal.type === type);
              return typeMeals.length > 0 ? (
                <div key={type} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900 capitalize mb-2 text-sm">{type}</div>
                  {typeMeals.map(meal => (
                    <div key={meal.id} className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="truncate">{meal.name}</span>
                      <span>{meal.quantity} × ₹{meal.price}</span>
                    </div>
                  ))}
                </div>
              ) : null;
            })}
          </div>

          <button
            onClick={onProceed}
            disabled={!hasSelectedMeals}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Room Selection →
          </button>
        </div>
      </div>
    </div>
  );
}