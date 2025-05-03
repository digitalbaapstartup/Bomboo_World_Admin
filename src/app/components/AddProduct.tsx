"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AddProducts, getAllCategories } from '@/app/GlobalRedux/slice/AuthSlice';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AppDispatch } from "../GlobalRedux/store";
import { ChevronDown, ChevronUp, Upload, X } from 'lucide-react';
import DashboardLayout from '../dashboard/page';

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  subCategory: string; // Must be an ObjectId for the backend
  specifications: string; // Will be parsed to array before sending
}

interface Errors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  category?: string;
  images?: string;
  specifications?: string;
}

export default function AddProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subCategory: '',
    specifications: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    // Calculate total number of images after adding new ones
    const totalImages = [...images, ...newFiles];
    
    // Check if total files exceed 4
    if (totalImages.length > 4) {
      setErrors({
        ...errors,
        images: 'Maximum 4 images allowed'
      });
      toast.error('Maximum 4 images allowed');
      return;
    }

    // Clear any previous image errors
    setErrors({
      ...errors,
      images: undefined
    });
    
    // Add new files to existing images
    setImages(prevImages => [...prevImages, ...newFiles]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
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
      newErrors.name = 'Product name must be at least 2 characters.';
    }
    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number.';
    }
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be a non-negative number.';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }
    if (images.length === 0) {
      newErrors.images = 'Please upload at least one image.';
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
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category', formData.category);
      
      // Only add subCategory if it's not empty and looks like an ObjectId
      if (formData.subCategory.trim()) {
        // Check if it's already a valid ObjectId (24 character hex string)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(formData.subCategory.trim());
        if (isObjectId) {
          formDataToSend.append('subCategory', formData.subCategory.trim());
        } else {
          // Skip adding subCategory if it's not a valid ObjectId
          console.warn('Skipping subCategory because it is not a valid ObjectId');
        }
      }
      
      // Handle specifications as an array, not a JSON string
      if (formData.specifications.trim()) {
        // Split by commas and trim each item
        const specsArray = formData.specifications
          .split(',')
          .map(spec => spec.trim())
          .filter(spec => spec.length > 0);
          
        // Add each specification as a separate entry with the same key
        specsArray.forEach(spec => {
          formDataToSend.append('specifications[]', spec);
        });
      }

      // Append images - backend expects an array of files with the same field name
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      try {
        const response = await dispatch(AddProducts(formDataToSend));
        
        if (response.payload && !response.payload.error) {
          toast.success("Product added successfully!");
          // Reset form state
          setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            category: '',
            subCategory: '',
            specifications: ''
          });
          setImages([]);
          router.push("/product-list");
        } else {
          toast.error(response.payload?.message || "Failed to add product");
        }
      } catch (error) {
        console.error("Product addition error:", error);
        toast.error("An error occurred while adding the product");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  const { categories, loading } = useSelector((state: any) => state?.auth);

  const handleCategorySelect = (categoryId: string) => {
    setFormData({
      ...formData,
      category: categoryId,
    });
    
    // Clear category error if it exists
    if (errors.category) {
      setErrors({
        ...errors,
        category: undefined
      });
    }
    
    setIsOpen(false);
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find selected category name
  const selectedCategory = categories?.find((cat: any) => cat._id === formData.category);

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-sm max-w-5xl mx-auto" ref={dropdownRef}>
        <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-3">Add New Product</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  className={`p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  className={`p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500`}
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
                <input
                  type="number"
                  name="stock"
                  placeholder="0"
                  className={`p-2 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500`}
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                <div 
                  className={`p-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md w-full flex justify-between items-center cursor-pointer bg-white`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className={`${!formData.category ? 'text-gray-400' : 'text-gray-800'}`}>
                    {selectedCategory ? selectedCategory.name : 'Select a category'}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                {isOpen && (
                  <div className="absolute z-10 w-full max-w-md mt-1 bg-white border rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                      {loading ? (
                        <li className="px-4 py-2 text-gray-500">Loading categories...</li>
                      ) : categories && categories.length > 0 ? (
                        categories.map((category: any) => (
                          <li
                            key={category._id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCategorySelect(category._id)}
                          >
                            {category.name}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">No categories available</li>
                      )}
                    </ul>
                  </div>
                )}
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
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
          
          {/* Description Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Description & Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Description*</label>
                <textarea
                  name="description"
                  placeholder="Enter detailed product description"
                  className={`p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md w-full h-24 focus:outline-none focus:ring-1 focus:ring-green-500`}
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specifications (Comma-separated)
                </label>
                <input
                  type="text"
                  name="specifications"
                  placeholder="e.g. Material: Cotton, Size: XL, Color: Blue"
                  className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={formData.specifications}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">Separate each specification with a comma. These will be sent as individual array items.</p>
              </div>
            </div>
          </div>
          
          {/* Images Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Product Images*</h3>
            
            <div className={`border-2 border-dashed ${errors.images ? 'border-red-300' : 'border-gray-300'} p-6 rounded-lg text-center`}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*"
                max="4"
                disabled={images.length >= 4}
              />
              
              <div onClick={triggerFileInput} className="cursor-pointer">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {images.length >= 4 
                    ? "Maximum number of images reached" 
                    : "Click to upload images"}
                </p>
                <p className="text-xs text-gray-500">
                  {images.length >= 4 
                    ? "" 
                    : `You can add ${4 - images.length} more image${4 - images.length === 1 ? '' : 's'} (Maximum 4)`}
                </p>
              </div>
            </div>
            
            {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
            
            {/* Preview selected images */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Images ({images.length}/4)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <div 
                      key={index}
                      className="relative bg-gray-100 p-2 rounded-md"
                    >
                      <div className="aspect-square overflow-hidden rounded-md bg-white flex items-center justify-center border">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Product image ${index + 1}`}
                          className="object-contain h-full w-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-500 truncate mt-1 text-center">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              className={`bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}