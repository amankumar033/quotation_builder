"use client";

import { useState } from "react";
import { ArrowLeft, X, FileText, Image as ImageIcon } from "lucide-react";

export default function AddMealPage() {
  const [formData, setFormData] = useState({
    type: "",
    vegOption: false,
    nonVegOption: false,
    price: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, checked } = target;

    if (name === "vegOption") {
      setFormData({ ...formData, vegOption: checked, nonVegOption: checked ? false : formData.nonVegOption });
    } else if (name === "nonVegOption") {
      setFormData({ ...formData, nonVegOption: checked, vegOption: checked ? false : formData.vegOption });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      vegOption: false,
      nonVegOption: false,
      price: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        type: formData.type,
        vegOption: formData.vegOption,
        nonVegOption: formData.nonVegOption,
        price: parseFloat(formData.price),
       
         
        agencyId: "YOUR_AGENCY_ID_HERE",
      };

      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Meal created successfully!");
        resetForm();
      } else {
        alert("Failed to create meal: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              type="button"
              onClick={resetForm}
              className="mr-4 text-gray-600 hover:text-gray-900"
              disabled={submitting}
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Add New Meal</h1>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="text-gray-600 hover:text-gray-900"
            disabled={submitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-50">Create a new meal record</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-0 lg:px-6 py-8 mt-5 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meal Details Section */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Meal Details</h2>
                </div>
               
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g. Breakfast, Lunch"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g. 200"
                  />
                </div>
              </div>
            </div>

            {/* Category Section */}
<div className="bg-white lg:rounded-xl shadow-sm border border-gray-200 mt-6">
  <div className="p-6 border-b border-gray-200 flex items-center gap-3">
    <div className="p-2 bg-green-100 rounded-lg">
      <ImageIcon className="w-5 h-5 text-green-600" />
    </div>
    <h2 className="text-lg font-semibold text-gray-900">Category</h2>
  </div>

  <div className="p-6 grid grid-cols-2 gap-6">
    {/* Veg Card */}
    <div
      onClick={() =>
        setFormData({ ...formData, vegOption: !formData.vegOption, nonVegOption: formData.vegOption ? formData.nonVegOption : false })
      }
      className={`cursor-pointer border rounded-xl flex items-center justify-center py-4 transition-all duration-300 ${
        formData.vegOption ? "bg-green-500 text-white border-green-500" : "border-gray-300 hover:border-green-400"
      }`}
    >
      Vegeterian
      <div
        className={`ml-3 w-10 h-5 rounded-full p-1 flex items-center transition ${
          formData.vegOption ? "bg-white justify-end" : "bg-gray-200 justify-start"
        }`}
      >
        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
      </div>
    </div>

    {/* Non-Veg Card */}
    <div
      onClick={() =>
        setFormData({ ...formData, nonVegOption: !formData.nonVegOption, vegOption: formData.nonVegOption ? formData.vegOption : false })
      }
      className={`cursor-pointer border rounded-xl flex items-center justify-center py-4 transition-all duration-300 ${
        formData.nonVegOption ? "bg-red-500 text-white border-red-500" : "border-gray-300 hover:border-red-400"
      }`}
    >
      Non-Vegeterian
      <div
        className={`ml-3 w-10 h-5 rounded-full p-1 flex items-center transition ${
          formData.nonVegOption ? "bg-white justify-end" : "bg-gray-200 justify-start"
        }`}
      >
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
      </div>
    </div>
  </div>
</div>

          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <button
            type="button"
            onClick={resetForm}
            disabled={submitting}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
          >
            {submitting ? "Saving..." : "Save Meal"}
          </button>
        </div>
      </div>
    </div>
  );
}
