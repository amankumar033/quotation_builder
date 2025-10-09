// src/app/meals/add/page.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { ArrowLeft, X, FileText, Image as ImageIcon } from "lucide-react";
import {useToast} from "@/app/components/Toast"

function AddMealInner() {
  const { success, error, info, warning } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    price: "",
    image: "",
    hotelId: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);

  // Fetch hotels for dropdown
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch('/api/hotels?agencyId=cmfntj4f60000nq4wt321fgsa');
        const data = await res.json();
        if (data.success) {
          setHotels(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      }
    };

    fetchHotels();
  }, []);

  // Fetch meal for edit
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    axios
      .get(`/api/meals/${id}`)
      .then((res) => {
        const data = res.data.data;
        setFormData({
          name: data?.name || "",
          type: data?.type || "",
          category: data?.category || "",
          price: data?.price?.toString() || "",
          image: data?.image || "",
          hotelId: data?.hotelId || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    if (category === 'veg') {
      setFormData(prev => ({ 
        ...prev, 
        category: prev.category === 'veg' ? '' : 'veg',
      }));
    } else if (category === 'non-veg') {
      setFormData(prev => ({ 
        ...prev, 
        category: prev.category === 'non-veg' ? '' : 'non-veg',
      }));
    }
  };

  const resetForm = () => {
    setFormData({ 
      name: "", 
      type: "", 
      category: "", 
      price: "", 
      image: "",
      hotelId: "" 
    });
    if (!id) router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        price: parseFloat(formData.price),
        image: formData.image,
        hotelId: formData.hotelId || null,
        agencyId: "cmfntj4f60000nq4wt321fgsa",
      };

      const method = id ? "PUT" : "POST";
      const url = id ? `/api/meals/${id}` : "/api/meals";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        {id ? success('Meal Updated','Meal was updated successfully!') : success('Meal Added','Meal Was Added Successfully!')}
        router.push("/services");
      } else {
        alert("Failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      {id ? error('Updation Failed','Please try again later!') : error('Creation Failed','Please try again later!')}
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button type="button" onClick={resetForm} disabled={submitting} className="mr-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{id ? "Edit Meal" : "Add New Meal"}</h1>
          </div>
          <button type="button" onClick={() => router.push('/services')} disabled={submitting} className="text-gray-600 hover:text-gray-900">
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-50">{id ? "Edit existing meal" : "Create a new meal record"}</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-0 lg:px-6 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meal Details */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Meal Details</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Continental Breakfast" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                  <input 
                    type="text" 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Breakfast, Lunch, Dinner" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. 500" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hotel (Optional)</label>
                  <select
                    name="hotelId"
                    value={formData.hotelId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    <option value="">Select Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.name} - {hotel.city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                  <input 
                    type="text" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleChange} 
                    placeholder="https://example.com/meal-image.jpg" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" 
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Category</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div
                  onClick={() => handleCategoryToggle('veg')}
                  className={`cursor-pointer border-2 rounded-xl flex items-center justify-center py-4 transition-all duration-300 ${
                    formData.category === 'veg' 
                      ? "bg-green-500 text-white border-green-500" 
                      : "border-gray-300 hover:border-green-400 bg-white"
                  }`}
                >
                  <span className="text-lg font-medium">Vegetarian</span>
                  <div className={`ml-4 w-12 h-6 rounded-full p-1 flex items-center transition ${
                    formData.category === 'veg' ? "bg-white justify-end" : "bg-gray-200 justify-start"
                  }`}>
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div
                  onClick={() => handleCategoryToggle('non-veg')}
                  className={`cursor-pointer border-2 rounded-xl flex items-center justify-center py-4 transition-all duration-300 ${
                    formData.category === 'non-veg' 
                      ? "bg-red-500 text-white border-red-500" 
                      : "border-gray-300 hover:border-red-400 bg-white"
                  }`}
                >
                  <span className="text-lg font-medium">Non-Vegetarian</span>
                  <div className={`ml-4 w-12 h-6 rounded-full p-1 flex items-center transition ${
                    formData.category === 'non-veg' ? "bg-white justify-end" : "bg-gray-200 justify-start"
                  }`}>
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="max-w-4xl mx-auto flex gap-4">
                <button 
                  type="button" 
                  onClick={() => router.push('/services')} 
                  disabled={submitting} 
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button 
                  type="submit"
                  disabled={submitting} 
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? "Saving..." : id ? "Update Meal" : "Save Meal"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddMealPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AddMealInner />
    </Suspense>
  );
}