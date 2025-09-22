"use client";
import { useRouter, useSearchParams } from "next/navigation"; // for app router
import axios from "axios";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  X,
  Building2,
  Bed,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

interface RoomType {
  type: string;
  price: number;
}

export default function AddHotelPage() {

 const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // gets ?id=xyz

 useEffect(() => {
  if (!id) return;

  axios
    .get(`/api/hotels?id=${id}`)
    .then((res) => {
      const data = res.data;

      setFormData({
        name: data.name || "",
        city: data.city || "",
        starCategory: data.starCategory?.toString() || "",
        cancellation: data.cancellation || "",
        photos: data.photos ? JSON.parse(data.photos).join("\n") : "",
      });

      setRoomTypes(data.roomTypes || []);
      setInclusions(data.inclusions ? JSON.parse(data.inclusions) : []);
    })
    .catch((err) => console.error(err));
}, [id]);


  const [formData, setFormData] = useState({
    name: "",
    city: "",
    starCategory: "",
    cancellation: "",
    photos: "",
  });






  
  const [submitting, setSubmitting] = useState(false);

  // Room Types with price
  const [roomTypeInput, setRoomTypeInput] = useState("");
  const [roomTypePriceInput, setRoomTypePriceInput] = useState("");
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  const handleRoomTypeAdd = () => {
    if (roomTypeInput.trim() !== "" && roomTypePriceInput.trim() !== "") {
      const price = parseFloat(roomTypePriceInput);
      if (!isNaN(price)) {
        setRoomTypes([
          ...roomTypes,
          { type: roomTypeInput.trim(), price },
        ]);
        setRoomTypeInput("");
        setRoomTypePriceInput("");
      }
    }
  };

  const handleRoomTypeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRoomTypeAdd();
    }
  };

  const removeRoomType = (index: number) =>
    setRoomTypes(roomTypes.filter((_, i) => i !== index));

  // Inclusions tags
  const [inclusionInput, setInclusionInput] = useState("");
  const [inclusions, setInclusions] = useState<string[]>([]);

  const handleInclusionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inclusionInput.trim() !== "") {
      e.preventDefault();
      if (!inclusions.includes(inclusionInput.trim())) {
        setInclusions([...inclusions, inclusionInput.trim()]);
      }
      setInclusionInput("");
    }
  };
  const removeInclusion = (inc: string) =>
    setInclusions(inclusions.filter((i) => i !== inc));

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
      ...formData,
      roomTypes,
      inclusions,
      photos: formData.photos
        ? formData.photos.split("\n").map((p) => p.trim()).filter(Boolean)
        : [],
      agencyId: "YOUR_AGENCY_ID_HERE", // replace dynamically if needed
    };

    let res;
    if (id) {
      // If editing, call PUT API
      res = await fetch(`/api/hotels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      // If creating new, call POST API
      res = await fetch("/api/hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    const data = await res.json();
    if (data.success) {
      alert(`Hotel ${id ? "updated" : "created"} successfully!`);
      if (!id) resetForm(); // only reset form if creating new
      router.push("/hotels"); // redirect to hotel list after save
    } else {
      alert("Failed: " + data.error);
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
      name: "",
      city: "",
      starCategory: "",
      cancellation: "",
      photos: "",
    });
    setRoomTypes([]);
    setInclusions([]);
    setRoomTypeInput("");
    setRoomTypePriceInput("");
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
                Add New Hotel
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
            Create a new hotel record
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
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the hotel’s basic details
                </p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hotel Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter hotel name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Star Category
                  </label>
                  <input
                    type="number"
                    name="starCategory"
                    value={formData.starCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>
            </div>

            {/* Room Types Section */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Bed className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Room Types
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Add room types with price and press Enter
                </p>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg p-2">
                  {roomTypes.map((room, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                    >
                      {room.type} - ₹{room.price}
                      <button
                        type="button"
                        onClick={() => removeRoomType(i)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={roomTypeInput}
                    onChange={(e) => setRoomTypeInput(e.target.value)}
                    onKeyDown={handleRoomTypeKeyDown}
                    className="flex-1 min-w-[80px] px-2 py-1 focus:outline-none placeholder:text-gray-400"
                    placeholder="Enter Room type ex: Deluxe, Standard..."
                  />
                  <input
                    type="number"
                    value={roomTypePriceInput}
                    onChange={(e) => setRoomTypePriceInput(e.target.value)}
                    onKeyDown={handleRoomTypeKeyDown}
                    className="w-44 px-2 py-1 border-l border-gray-300 focus:outline-none"
                    placeholder="Price per night : ₹"
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Additional Information
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Add Optional hotel details and press Enter
                </p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions as tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Inclusions
                  </label>
                  <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg p-2">
                    {inclusions.map((inc, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
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
                    <input
                      type="text"
                      value={inclusionInput}
                      onChange={(e) => setInclusionInput(e.target.value)}
                      onKeyDown={handleInclusionKeyDown}
                      className="flex-1 min-w-[120px] px-2 py-1 focus:outline-none"
                      placeholder="ex: free wifi, lunch.."
                    />
                  </div>
                </div>

                {/* Cancellation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cancellation Policy
                  </label>
                  <input
                    type="text"
                    name="cancellation"
                    value={formData.cancellation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="24-hour free cancellation"
                  />
                </div>
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
                  Enter photo URL
                </p>
              </div>
              <div className="p-6">
                <textarea
                  name="photos"
                  value={formData.photos}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 h-32"
                  placeholder='https://example.com/photo1.jpg '
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
              {submitting ? "Saving..." : "Save Hotel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
