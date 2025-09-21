"use client";

import { useState } from "react";
import { ArrowLeft, X, Truck, Image as ImageIcon, FileText } from "lucide-react";

export default function TransportPage() {
  const [formData, setFormData] = useState({
    vehicleType: "",
    perDay: "",
    perKm: "",
    maxCapacity: "",
    notes: "",
    photos: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        vehicleType: formData.vehicleType,
        perDay: Number(formData.perDay),
        perKm: Number(formData.perKm),
        maxCapacity: Number(formData.maxCapacity),
        notes: formData.notes || null,
        photos: formData.photos
          ? formData.photos
              .split("\n")
              .map((p) => p.trim())
              .filter(Boolean)
          : [],
        agencyId: "YOUR_AGENCY_ID_HERE", // replace dynamically if needed
      };

      const res = await fetch("/api/transports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert("Transport created successfully!");
        resetForm();
      } else {
        alert("Failed to create transport: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleType: "",
      perDay: "",
      perKm: "",
      maxCapacity: "",
      notes: "",
      photos: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                type="button"
                onClick={resetForm}
                className="mr-4 text-gray-600 hover:text-gray-900"
                disabled={submitting}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Transport
              </h1>
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
          <p className="text-sm text-gray-600 mt-1">
            Create a new transport record
          </p>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className="flex-1 px-0 lg:px-6 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">Enter the transport details</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g. Bus, Van"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Per Day
                  </label>
                  <input
                    type="number"
                    name="perDay"
                    value={formData.perDay}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="₹ per day"
                  />
                </div>               
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    name="maxCapacity"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g. 20"
                  />
                </div>
                  <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Per KM
                  </label>
                  <input
                    type="number"
                    name="perKm"
                    value={formData.perKm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="₹ per km"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">Add optional notes</p>
              </div>
              <div className="p-6">
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 h-24"
                  placeholder="Any special notes..."
                />
              </div>
            </div>

            {/* Photos Section */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Photos</h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">Enter photo URLs (one per line)</p>
              </div>
              <div className="p-6">
                <textarea
                  name="photos"
                  value={formData.photos}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 h-32"
                  placeholder="https://example.com/photo1.jpg"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
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
              {submitting ? "Saving..." : "Save Transport"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
