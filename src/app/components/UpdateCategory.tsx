"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { AppDispatch } from "../GlobalRedux/store";
import { Upload, X } from 'lucide-react';
import DashboardLayout from '../dashboard/page';
import { updateCategory } from '../GlobalRedux/slice/AuthSlice';

// Define interfaces for form data and errors
interface FormData {
  name: string;
  description: string;
  subCategory: string;
}

interface Errors {
  name?: string;
  description?: string;
  image?: string;
}

export default function UpdateCategory() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    subCategory: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get current category data
  const { categories } = useSelector((state: any) => state?.product);
  const currentCategory = categories?.find((category: any) => category._id === id);

  useEffect(() => {
    if (currentCategory) {
      setFormData({
        name: currentCategory.name || '',
        description: currentCategory.description || '',
        subCategory: currentCategory.subCategory || '',
      });
      
      // Set image preview if available
      if (currentCategory.image && currentCategory.image.secure_url) {
        setImagePreview(currentCategory.image.secure_url);
      }
      
      setIsLoading(false);
    }
  }, [currentCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.includes('image/')) {
        setErrors({
          ...errors,
          image: 'Please select a valid image file'
        });
        return;
      }
      
      // Clear any previous image errors
      setErrors({
        ...errors,
        image: undefined
      });
      
      // Set the new image
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      newErrors.name = 'Category name must be at least 2 characters';
    }
    
    // Description is optional, but if provided, should be at least 5 characters
    if (formData.description && formData.description.trim().length < 5) {
      newErrors.description = 'Description should be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      
      // Only append values that are not empty
      if (formData.name) formDataToSend.append('name', formData.name);
      if (formData.description) formDataToSend.append('description', formData.description);
      if (formData.subCategory) formDataToSend.append('subCategory', formData.subCategory);
      
      // Append image if new one selected
      if (image) {
        formDataToSend.append('image', image);
      }

      try {
        const response = await dispatch(updateCategory({id, data: formDataToSend}));
        
        if (response.payload && !response.payload.error) {
          toast.success("Category updated successfully!");
          router.push("/all-categories");
        } else {
          toast.error(response.payload?.message || "Failed to update category");
        }
      } catch (error) {
        console.error("Category update error:", error);
        toast.error("An error occurred while updating the category");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-3">Update Category</h2>
          <div className="flex justify-center items-center h-64">
            <p>Loading category information...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentCategory) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-3">Update Category</h2>
          <div className="flex justify-center items-center h-64">
            <p>Category not found. Please select a valid category.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-sm max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-3">Update Category</h2>
        
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category ID (Optional)</label>
                <input
                  type="text"
                  name="subCategory"
                  placeholder="Enter sub category ID (ObjectId format)"
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
            <h3 className="text-lg font-medium mb-4 text-gray-700">Category Image</h3>
            
            <div className={`border-2 border-dashed ${errors.image ? 'border-red-300' : 'border-gray-300'} p-6 rounded-lg text-center ${!imagePreview ? 'cursor-pointer' : ''}`} 
                 onClick={!imagePreview ? triggerFileInput : undefined}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              
              {!imagePreview ? (
                <div className="cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: JPG, PNG, WebP
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="flex justify-center">
                    <div className="w-48 h-48 rounded-md border overflow-hidden bg-white flex items-center justify-center">
                      <img 
                        src={imagePreview} 
                        alt="Category preview"
                        className="object-contain h-full w-full"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
            
            {imagePreview && (
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="text-sm text-green-700 hover:text-green-600"
                >
                  Change image
                </button>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              onClick={() => router.push("/all-categories")}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Category'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}