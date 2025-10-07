"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { ArrowLeft, X, FileText, Image as ImageIcon } from "lucide-react";
import {useToast} from "../components/Toast"
function AddMealInner() {
  const { success, error, info, warning } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    type: "",
    vegOption: false,
    nonVegOption: false,
    price: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
          type: data?.type || "",
          vegOption: data?.vegOption ?? false,
          nonVegOption: data?.nonVegOption ?? false,
          price: data?.price?.toString() || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const checked = target.checked;
      if (name === "vegOption") {
        setFormData({ ...formData, vegOption: checked, nonVegOption: checked ? false : formData.nonVegOption });
      } else if (name === "nonVegOption") {
        setFormData({ ...formData, nonVegOption: checked, vegOption: checked ? false : formData.vegOption });
      }
    } else {
      setFormData({ ...formData, [name]: target.value });
    }
  };

  const resetForm = () => {
    setFormData({ type: "", vegOption: false, nonVegOption: false, price: "" });
    if (!id) router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        agencyId: "cmfntj4f60000nq4wt321fgsa",
        id,
      };

      const method = id ? "PUT" : "POST";
      const url = `/api/meals/${id}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        {id?success('Meal Updated','Meal was updated successfully!'):success('Meal Added','Meal Was Added Successfully!')}
        router.push("/services");
      } else {
        alert("Failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
       {id?error('Updation Failed','Please try again later!'):error('Creation Failed','Please try again later!')}

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
          <button type="button" onClick={resetForm} disabled={submitting} className="text-gray-600 hover:text-gray-900">
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1 ml-50">{id ? "Edit existing meal" : "Create a new meal record"}</p>
      </div>

      {/* Form */}
      <div className="flex-1 px-0 lg:px-6 py-8 mt-5 overflow-y-auto">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <input type="text" name="type" value={formData.type} onChange={handleChange} required placeholder="e.g. Breakfast, Lunch" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="e.g. 200" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900" />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white lg:rounded-xl shadow-sm border border-gray-200 mt-6">
              <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Category</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div
                  onClick={() => setFormData({ ...formData, vegOption: !formData.vegOption, nonVegOption: formData.vegOption ? formData.nonVegOption : false })}
                  className={`cursor-pointer border rounded-xl flex items-center justify-center py-4 transition-all duration-300 ${formData.vegOption ? "bg-green-500 text-white border-green-500" : "border-gray-300 hover:border-green-400"}`}
                >
                  Vegetarian
                  <div className={`ml-3 w-10 h-5 rounded-full p-1 flex items-center transition ${formData.vegOption ? "bg-white justify-end" : "bg-gray-200 justify-start"}`}>
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div
                  onClick={() => setFormData({ ...formData, nonVegOption: !formData.nonVegOption, vegOption: formData.nonVegOption ? formData.vegOption : false })}
                  className={`cursor-pointer border rounded-xl flex items-center justify-center py-4 transition-all duration-300 ${formData.nonVegOption ? "bg-red-500 text-white border-red-500" : "border-gray-300 hover:border-red-400"}`}
                >
                  Non-Vegetarian
                  <div className={`ml-3 w-10 h-5 rounded-full p-1 flex items-center transition ${formData.nonVegOption ? "bg-white justify-end" : "bg-gray-200 justify-start"}`}>
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 mt-6">
              <div className="max-w-4xl mx-auto flex gap-4">
                <button type="button" onClick={()=>{router.push('/services')}} disabled={submitting} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50">Cancel</button>

                <button type="submit"
                 disabled={submitting} 
                  onClick={handleSubmit}
                 className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center">{submitting ? "Saving..." : id ? "Update Meal" : "Save Meal"}</button>
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
