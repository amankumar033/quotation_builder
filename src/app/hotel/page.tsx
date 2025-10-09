// src/app/hotels/add/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { 
  ArrowLeft, 
  X, 
  Building2, 
  Bed, 
  Utensils, 
  Activity,
  Image as ImageIcon, 
  FileText,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/app/components/Toast";

interface RoomType {
  type: string;
  price: string;
  maxAdults: string;
  maxChildren: string;
  bedType: string;
  amenities: string[];
  description: string;
  photos: string[];
}

interface Meal {
  name: string;
  type: string;
  category: string;
  price: string;
  image: string;
}

interface Activity {
  name: string;
  description: string;
  price: string;
  duration: string;
  image: string;
}

function AddHotelInner() {
  const { success, error, info } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    starCategory: "",
    cancellation: "",
    inclusions: [] as string[],
    photos: [] as string[],
  });

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Accordion states
  const [openSections, setOpenSections] = useState({
    basicInfo: true,
    inclusions: false,
    roomTypes: false,
    meals: false,
    activities: false,
    photos: false
  });

  // Room Type Form
  const [roomForm, setRoomForm] = useState<RoomType>({
    type: "",
    price: "",
    maxAdults: "",
    maxChildren: "",
    bedType: "",
    amenities: [],
    description: "",
    photos: [],
  });

  // Meal Form
  const [mealForm, setMealForm] = useState<Meal>({
    name: "",
    type: "",
    category: "",
    price: "",
    image: "",
  });

  // Activity Form
  const [activityForm, setActivityForm] = useState<Activity>({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: "",
  });

  // Common states
  const [inclusionInput, setInclusionInput] = useState("");
  const [photoInput, setPhotoInput] = useState("");
  const [amenityInput, setAmenityInput] = useState("");

  // Toggle accordion sections
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Add Room Type
  const addRoomType = () => {
    if (roomForm.type && roomForm.price) {
      setRoomTypes([...roomTypes, { ...roomForm }]);
      setRoomForm({
        type: "",
        price: "",
        maxAdults: "",
        maxChildren: "",
        bedType: "",
        amenities: [],
        description: "",
        photos: [],
      });
    }
  };

  // Add Meal
  const addMeal = () => {
    if (mealForm.name && mealForm.price) {
      setMeals([...meals, { ...mealForm }]);
      setMealForm({
        name: "",
        type: "",
        category: "",
        price: "",
        image: "",
      });
    }
  };

  // Add Activity
  const addActivity = () => {
    if (activityForm.name && activityForm.price) {
      setActivities([...activities, { ...activityForm }]);
      setActivityForm({
        name: "",
        description: "",
        price: "",
        duration: "",
        image: "",
      });
    }
  };

  // Add Inclusion
  const addInclusion = () => {
    if (inclusionInput.trim() && !formData.inclusions.includes(inclusionInput.trim())) {
      setFormData({
        ...formData,
        inclusions: [...formData.inclusions, inclusionInput.trim()]
      });
      setInclusionInput("");
    }
  };

  // Add Photo
  const addPhoto = () => {
    if (photoInput.trim() && !formData.photos.includes(photoInput.trim())) {
      setFormData({
        ...formData,
        photos: [...formData.photos, photoInput.trim()]
      });
      setPhotoInput("");
    }
  };

  // Add Amenity to current room form
  const addAmenity = () => {
    if (amenityInput.trim() && !roomForm.amenities.includes(amenityInput.trim())) {
      setRoomForm({
        ...roomForm,
        amenities: [...roomForm.amenities, amenityInput.trim()]
      });
      setAmenityInput("");
    }
  };

  // Remove functions
  const removeInclusion = (inc: string) => {
    setFormData({
      ...formData,
      inclusions: formData.inclusions.filter(i => i !== inc)
    });
  };

  const removePhoto = (photo: string) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter(p => p !== photo)
    });
  };

  const removeRoomType = (index: number) => {
    setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  const removeMeal = (index: number) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const removeAmenity = (amenity: string) => {
    setRoomForm({
      ...roomForm,
      amenities: roomForm.amenities.filter(a => a !== amenity)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        starCategory: parseInt(formData.starCategory),
        roomTypes: roomTypes.map(room => ({
          ...room,
          price: parseFloat(room.price),
          maxAdults: parseInt(room.maxAdults) || 2,
          maxChildren: parseInt(room.maxChildren) || 0,
        })),
        meals: meals.map(meal => ({
          ...meal,
          price: parseFloat(meal.price),
        })),
        activities: activities.map(activity => ({
          ...activity,
          price: parseFloat(activity.price),
        })),
        agencyId: "cmfntj4f60000nq4wt321fgsa",
      };

      const url = id ? `/api/hotels/${id}` : "/api/hotels";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (data.success) {
        success(
          id ? 'Hotel Updated' : 'Hotel Added',
          id ? 'Hotel was updated successfully!' : 'Hotel was created successfully!'
        );
        router.push("/services");
      } else {
        error('Error', data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      error('Error', 'Please try again later');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => router.push("/services")}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-700">
                {id ? "Edit Hotel" : "Add New Hotel"}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => router.push("/services")}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1  px-8 py-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information - Always Open */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div 
                className="p-8 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleSection('basicInfo')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Basic Information
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Enter the hotel's basic details
                      </p>
                    </div>
                  </div>
                  {openSections.basicInfo ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {openSections.basicInfo && (
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Hotel Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter hotel name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Star Category
                    </label>
                    <input
                      type="number"
                      value={formData.starCategory}
                      onChange={(e) => setFormData({...formData, starCategory: e.target.value})}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="e.g. 5"
                      min="1"
                      max="7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Cancellation Policy
                    </label>
                    <input
                      type="text"
                      value={formData.cancellation}
                      onChange={(e) => setFormData({...formData, cancellation: e.target.value})}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="e.g. Free cancellation within 24 hours"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Inclusions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div 
                className="p-8 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleSection('inclusions')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Hotel Inclusions
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Add hotel amenities and services included
                      </p>
                    </div>
                  </div>
                  {openSections.inclusions ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {openSections.inclusions && (
                <div className="p-8">
                  <div className="flex flex-wrap gap-3 mb-6">
                    {formData.inclusions.map((inc, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm"
                      >
                        {inc}
                        <button
                          type="button"
                          onClick={() => removeInclusion(inc)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inclusionInput}
                      onChange={(e) => setInclusionInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInclusion())}
                      className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Add inclusion (press Enter)"
                    />
                    <button
                      type="button"
                      onClick={addInclusion}
                      className="px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Room Types */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div 
                className="p-8 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleSection('roomTypes')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <Bed className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Room Types
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Add different room types available in the hotel
                      </p>
                    </div>
                  </div>
                  {openSections.roomTypes ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {openSections.roomTypes && (
                <div className="p-8 space-y-8">
                  {/* Room Types List */}
                  {roomTypes.map((room, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900 text-lg">{room.type}</h3>
                        <button
                          type="button"
                          onClick={() => removeRoomType(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div><strong>Price:</strong> ₹{room.price}</div>
                        <div><strong>Adults:</strong> {room.maxAdults}</div>
                        <div><strong>Children:</strong> {room.maxChildren}</div>
                        <div><strong>Bed:</strong> {room.bedType}</div>
                      </div>
                      {room.description && (
                        <div className="mb-3">
                          <strong className="text-sm text-gray-600">Description: </strong>
                          <span className="text-sm">{room.description}</span>
                        </div>
                      )}
                      {room.amenities.length > 0 && (
                        <div>
                          <strong className="text-sm text-gray-600">Amenities: </strong>
                          <span className="text-sm">{room.amenities.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add Room Form */}
                  <div className="border border-dashed border-gray-300 rounded-lg p-8">
                    <h3 className="font-semibold text-gray-900 text-lg mb-6">Add New Room Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type *</label>
                        <input
                          type="text"
                          value={roomForm.type}
                          onChange={(e) => setRoomForm({...roomForm, type: e.target.value})}
                          placeholder="e.g. Deluxe Room"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                        <input
                          type="number"
                          value={roomForm.price}
                          onChange={(e) => setRoomForm({...roomForm, price: e.target.value})}
                          placeholder="e.g. 5000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Max Adults</label>
                        <input
                          type="number"
                          value={roomForm.maxAdults}
                          onChange={(e) => setRoomForm({...roomForm, maxAdults: e.target.value})}
                          placeholder="e.g. 2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Max Children</label>
                        <input
                          type="number"
                          value={roomForm.maxChildren}
                          onChange={(e) => setRoomForm({...roomForm, maxChildren: e.target.value})}
                          placeholder="e.g. 2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bed Type</label>
                        <input
                          type="text"
                          value={roomForm.bedType}
                          onChange={(e) => setRoomForm({...roomForm, bedType: e.target.value})}
                          placeholder="e.g. King Bed"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    {/* Description Textarea */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={roomForm.description}
                        onChange={(e) => setRoomForm({...roomForm, description: e.target.value})}
                        placeholder="Room description and features..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                      />
                    </div>
                    
                    {/* Amenities */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {roomForm.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                          >
                            {amenity}
                            <button
                              type="button"
                              onClick={() => removeAmenity(amenity)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={amenityInput}
                          onChange={(e) => setAmenityInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Add amenity (press Enter)"
                        />
                        <button
                          type="button"
                          onClick={addAmenity}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addRoomType}
                      disabled={!roomForm.type || !roomForm.price}
                      className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add Room Type
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Meals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div 
                className="p-8 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleSection('meals')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Utensils className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Meals
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Add meal options available at the hotel
                      </p>
                    </div>
                  </div>
                  {openSections.meals ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {openSections.meals && (
                <div className="p-8 space-y-8">
                  {/* Meals List */}
                  {meals.map((meal, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{meal.name}</h3>
                        <button
                          type="button"
                          onClick={() => removeMeal(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><strong>Type:</strong> {meal.type}</div>
                        <div><strong>Category:</strong> {meal.category}</div>
                        <div><strong>Price:</strong> ₹{meal.price}</div>
                      </div>
                    </div>
                  ))}

                  {/* Add Meal Form */}
                  <div className="border border-dashed border-gray-300 rounded-lg p-8">
                    <h3 className="font-semibold text-gray-900 text-lg mb-6">Add New Meal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Name *</label>
                        <input
                          type="text"
                          value={mealForm.name}
                          onChange={(e) => setMealForm({...mealForm, name: e.target.value})}
                          placeholder="e.g. Continental Breakfast"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                        <input
                          type="text"
                          value={mealForm.type}
                          onChange={(e) => setMealForm({...mealForm, type: e.target.value})}
                          placeholder="e.g. Breakfast, Lunch"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <select
                          value={mealForm.category}
                          onChange={(e) => setMealForm({...mealForm, category: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Category</option>
                          <option value="veg">Vegetarian</option>
                          <option value="non-veg">Non-Vegetarian</option>
                          <option value="both">Both</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                        <input
                          type="number"
                          value={mealForm.price}
                          onChange={(e) => setMealForm({...mealForm, price: e.target.value})}
                          placeholder="e.g. 500"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                      <input
                        type="text"
                        value={mealForm.image}
                        onChange={(e) => setMealForm({...mealForm, image: e.target.value})}
                        placeholder="https://example.com/meal-image.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addMeal}
                      disabled={!mealForm.name || !mealForm.price || !mealForm.type}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add Meal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Activities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div 
                className="p-8 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleSection('activities')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Activities
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Add activities and experiences offered by the hotel
                      </p>
                    </div>
                  </div>
                  {openSections.activities ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {openSections.activities && (
                <div className="p-8 space-y-8">
                  {/* Activities List */}
                  {activities.map((activity, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{activity.name}</h3>
                        <button
                          type="button"
                          onClick={() => removeActivity(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><strong>Duration:</strong> {activity.duration}</div>
                        <div><strong>Price:</strong> ₹{activity.price}</div>
                      </div>
                    </div>
                  ))}

                  {/* Add Activity Form */}
                  <div className="border border-dashed border-gray-300 rounded-lg p-8">
                    <h3 className="font-semibold text-gray-900 text-lg mb-6">Add New Activity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Name *</label>
                        <input
                          type="text"
                          value={activityForm.name}
                          onChange={(e) => setActivityForm({...activityForm, name: e.target.value})}
                          placeholder="e.g. Swimming Pool Access"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                        <input
                          type="text"
                          value={activityForm.duration}
                          onChange={(e) => setActivityForm({...activityForm, duration: e.target.value})}
                          placeholder="e.g. 2 hours"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                        <input
                          type="number"
                          value={activityForm.price}
                          onChange={(e) => setActivityForm({...activityForm, price: e.target.value})}
                          placeholder="e.g. 1000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={activityForm.description}
                        onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                        placeholder="Describe the activity..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                      <input
                        type="text"
                        value={activityForm.image}
                        onChange={(e) => setActivityForm({...activityForm, image: e.target.value})}
                        placeholder="https://example.com/activity-image.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addActivity}
                      disabled={!activityForm.name || !activityForm.price}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add Activity
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Photos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div 
                className="p-8 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleSection('photos')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <ImageIcon className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Hotel Photos
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Add photos of the hotel
                      </p>
                    </div>
                  </div>
                  {openSections.photos ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              {openSections.photos && (
                <div className="p-8">
                  <div className="flex flex-wrap gap-3 mb-6">
                    {formData.photos.map((photo, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm"
                      >
                        {photo.substring(0, 30)}...
                        <button
                          type="button"
                          onClick={() => removePhoto(photo)}
                          className="text-pink-600 hover:text-pink-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={photoInput}
                      onChange={(e) => setPhotoInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPhoto())}
                      className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      placeholder="Add photo URL (press Enter)"
                    />
                    <button
                      type="button"
                      onClick={addPhoto}
                      className="px-6 py-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => router.push("/services")}
                  disabled={submitting}
                  className="flex-1 px-8 py-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 text-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 text-lg"
                >
                  {submitting ? "Saving..." : (id ? "Update Hotel" : "Add Hotel")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddHotelPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AddHotelInner />
    </Suspense>
  );
}