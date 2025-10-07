"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, X, Truck, Image as ImageIcon, FileText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"; // for app router
import { Suspense } from "react";
import { useToast } from "../components/Toast";
import axios from "axios";
interface TransportData {
  id?: string;
  vehicleType: string;
  perDay: string;
  perKm: string;
  maxCapacity: string;
  notes: string;
  photos: string;
}

interface TransportPageProps {
  id?: string;
  onCancel?: () => void;
  onSubmitSuccess?: () => void;
}

function TransportPageInner({  onCancel, onSubmitSuccess }: TransportPageProps) {
  
   const { success, error, info, warning } = useToast();

   const router = useRouter();
   const searchParams = useSearchParams();
   const id = searchParams.get("id"); // gets ?id=xyz
  
  
  const [formData, setFormData] = useState<TransportData>({
    vehicleType: "",
    perDay: "",
    perKm: "",
    maxCapacity: "",
    notes: "",
    photos: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);



   useEffect(() => {
  if (!id) return;

  axios
    .get(`/api/transports/${id}`)
    .then((res) => {
      const data = res.data;

      setFormData({
          vehicleType: data.data.vehicleType || "",
          perDay: data.data.perDay?.toString() || "",
          perKm: data.data.perKm?.toString() || "",
          maxCapacity: data.data.maxCapacity?.toString() || "",
          notes: data.data.notes || "",
          photos:  data.data.photos ? JSON.parse(data.data.photos).join("\n") : "",
        });
        setIsEditing(true);
      
    })
    .catch((err) => console.error(err));
}, [id]);

  // Load transport data when editing 

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
        agencyId: "cmfntj4f60000nq4wt321fgsa",
      };

      // Use PUT for update, POST for create
      const url = id ? `/api/transports/${id}` : "/api/transports";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        {id?success('Transport Updated',"Transport was updated successfully!"):success('transport Created',"Transport was created successfully!")}
       
        onSubmitSuccess?.();
              router.push("/services")
      } else {
        alert(`Failed to ${id ? 'update' : 'create'} transport: ` + data.error);
        {id?error('Updation Failed',"Transport was not updated!"):error('Creation Failed',"Transport was not created!")}

      }
    } catch (err) {
      console.error(err);
      error("Something went wrong","Please try again later!");
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
    info('Form Reset',"Form was resetted sucessfully!")
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
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
                onClick={handleCancel}
                className="mr-4 text-gray-600 hover:text-gray-900"
                disabled={submitting}
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-700">
                {id ? "Edit Transport" : "Add New Transport"}
              </h1>
            </div>
            <button
              type="button"
                  onClick={()=>{router.push("/services");}}
              className="text-gray-600 hover:text-gray-700"
              disabled={submitting}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1 ml-10">
            {id ? "Update transport record" : "Create a new transport record"}
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
                    required
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
                    required
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
                    required
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
                   onClick={()=>{router.push("/services");}}
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
              {submitting 
                ? (id ? "Updating..." : "Adding...") 
                : (id ? "Update Transport" : "Add Transport")
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransportPage(props: TransportPageProps) {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <TransportPageInner {...props} />
    </Suspense>
  );
}