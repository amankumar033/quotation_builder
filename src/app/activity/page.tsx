// src/app/activities/add/page.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, X, FileText, Image as ImageIcon, Tag } from "lucide-react";
import { useToast } from "@/app/components/Toast";

function AddActivityInner() {
  const { success, error, info, warning } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    photos: "",
    image: "",
    hotelId: "",
  });

  const [hotels, setHotels] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch hotels for dropdown
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await fetch('/api/hotels?agencyId=AGC1');
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

  // Fetch activity for edit
  useEffect(() => {
    if (!id) return;

    const fetchActivity = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/activities/${id}`);
        const data = await res.json();

        if (data.success) {
          const activityData = data.data;
          setFormData({
            name: activityData?.name || "",
            description: activityData?.description || "",
            duration: activityData?.duration || "",
            price: activityData?.price?.toString() || "",
            photos: activityData?.photos ? JSON.parse(activityData.photos).join("\n") : "",
            image: activityData?.image || "",
            hotelId: activityData?.hotelId || "",
          });
        }
      } catch (err) {
        console.error('Failed to fetch activity:', err);
        error('Error', 'Failed to load activity data');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Validation
    if (!formData.name || !formData.price) {
      error('Validation Error', 'Please fill all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        duration: formData.duration,
        price: parseFloat(formData.price),
        photos: formData.photos
          ? formData.photos.split("\n").map((p) => p.trim()).filter(Boolean)
          : [],
        image: formData.image,
        hotelId: formData.hotelId || null,
        agencyId: "AGC1",
      };

      const url = id ? `/api/activities/${id}` : "/api/activities";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (data.success) {
        if (id) {
          success('Activity Updated', 'Activity was updated successfully');
        } else {
          success('Activity Added', 'Activity was added successfully');
          resetForm();
        }
        router.push("/services");
      } else {
        error('Error', data.error || `Failed to ${id ? "update" : "create"} activity`);
      }
    } catch (err) {
      console.error(err);
      error("Something went wrong!", "Please try again later");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: "",
      price: "",
      photos: "",
      image: "",
      hotelId: "",
    });
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => router.push('/services')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                disabled={submitting}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? "Edit Activity" : "Add New Activity"}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => router.push('/services')}
              className="text-gray-600 hover:text-gray-900"
              disabled={submitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1 ml-10">
            {id ? "Edit existing activity" : "Create a new activity record"}
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
                    <Tag className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the activity's basic details
                </p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Activity Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter activity name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="e.g. 3 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="e.g. 2000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hotel (Optional)
                  </label>
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
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Additional Information
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Add description and optional details
                </p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-24"
                  placeholder="Enter activity description..."
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Photos
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Enter photo URLs (one per line)
                </p>
              </div>
              <div className="p-6">
                <textarea
                  name="photos"
                  value={formData.photos}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-32"
                  placeholder="https://example.com/photo1.jpg"
                />
              </div>
            </div>

            {/* Main Image Section */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Main Image
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Add the main image URL for the activity
                </p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="https://example.com/main-image.jpg"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-4">
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
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
                  >
                    {submitting ? "Saving..." : (id ? "Update Activity" : "Save Activity")}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddActivityPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <AddActivityInner />
    </Suspense>
  );
}