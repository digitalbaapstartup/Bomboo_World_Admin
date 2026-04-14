"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AddCategories, getAllCategories } from '@/app/GlobalRedux/slice/AuthSlice';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AppDispatch } from "../GlobalRedux/store";
import { Upload, X } from 'lucide-react';
import DashboardLayout from '../dashboard/page';

interface FormData {
  name: string;
  description: string;
  subCategory: string; // Optional ObjectId reference
}

interface Errors {
  name?: string;
  description?: string;
  image?: string;
}

export default function AddCategory() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    subCategory: '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Clear any previous image errors
      setErrors({
        ...errors,
        image: undefined
      });
      
      // Set the image file and create a preview URL
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof Errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters.';
    }

    // Description is optional, so only validate if provided
    if (formData.description && formData.description.trim().length < 10) {
      newErrors.description = 'If provided, description must be at least 10 characters.';
    }

    // Image is optional, but if one is selected, ensure it's valid
    if (!image) {
      // Optional, but you can make it required if needed
      // newErrors.image = 'Please select an image for the category.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      
      // Append basic form data
      formDataToSend.append('name', formData.name);
      
      if (formData.description.trim()) {
        formDataToSend.append('description', formData.description);
      }
      
      // Only add subCategory if it's a valid ObjectId
      if (formData.subCategory.trim() && /^[0-9a-fA-F]{24}$/.test(formData.subCategory.trim())) {
        formDataToSend.append('subCategory', formData.subCategory.trim());
      }
      
      // Append image if selected
      if (image) {
        formDataToSend.append('image', image);
      }

      try {
        // Dispatch the AddCategories action with form data
        const response = await dispatch(AddCategories(formDataToSend));
        
        if (response.payload && !response.payload.error) {
          // Reset form state
          setFormData({
            name: '',
            description: '',
            subCategory: '',
          });
          setImage(null);
          if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
          }
          
          // Navigate back to categories list
          router.push("/all-categories");
        }
      } catch (error) {
        console.error("Category addition error:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-sm max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-3">Add New Category</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Category Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name*</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter category name"
                  className={`p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  name="description"
                  placeholder="Enter category description"
                  className={`p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md w-full h-24 focus:outline-none focus:ring-1 focus:ring-green-500`}
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category ID (Optional)</label>
                <input
                  type="text"
                  name="subCategory"
                  placeholder="Enter parent category ID (ObjectId format)"
                  className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={formData.subCategory}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">Must be a valid MongoDB ObjectId (24 character hex string)</p>
              </div>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Category Image (Optional)</h3>
            
            <div className={`border-2 border-dashed ${errors.image ? 'border-red-300' : 'border-gray-300'} p-6 rounded-lg text-center`}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              
              {!imagePreview ? (
                <div onClick={triggerFileInput} className="cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative w-full max-w-xs mx-auto">
                  <img 
                    src={imagePreview} 
                    alt="Category preview" 
                    className="h-40 object-contain mx-auto"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              className={`bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Category...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}