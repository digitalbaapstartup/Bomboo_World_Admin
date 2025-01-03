"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AddProducts, getAllCategories } from '@/app/GlobalRedux/slice/AuthSlice';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AppDispatch } from "../GlobalRedux/store";
import { ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '../dashboard/page';

interface FormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  // subCategory: string;
  specifications: string;
}

interface Errors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  category?: string;
}

export default function AddProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    specifications: ''
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const formDataToSend = new FormData();
      
      // Append basic form data
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category', formData.category._id);
      
      // if (formData.subCategory) {
      //   formDataToSend.append('subCategory', formData.subCategory);
      // }
      
      if (formData.specifications) {
        formDataToSend.append('specifications', formData.specifications);
      }

      // Append images
      images.forEach((image, index) => {
        formDataToSend.append(`files`, image);
      });

      try {
        const response = await dispatch(AddProducts(formData));

        console.log(response)
        
        if (response?.payload?.success) {
          toast.success("Product added successfully!");
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
        } else {
          toast.error(response?.payload?.message || "Failed to add product");
        }
      } catch (error) {
        console.error("Product addition error:", error);
        toast.error("An error occurred while adding the product");
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  const { categories, loading } = useSelector((state: any) => state.auth);

  const handleCategorySelect = (categoryId: string) => {
    console.log(categoryId)
    setFormData({
      ...formData,
      category: categoryId,
    });
    setIsOpen(false);
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg" ref={dropdownRef}>
        <h2 className="text-2xl font-bold mb-4 text-[#0A8E8A]">Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="p-2 border rounded w-full"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div>
              <input
                type="text"
                name="description"
                placeholder="Product Description"
                className="p-2 border rounded w-full"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
            <div>
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="p-2 border rounded w-full"
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
            <div>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                className="p-2 border rounded w-full"
                value={formData.stock}
                onChange={handleChange}
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative">
            <div
    className="p-2 border rounded w-full flex justify-between items-center cursor-pointer bg-white"
    onClick={() => setIsOpen(!isOpen)}
  >
    <span className={`${!formData.category ? 'text-gray-400' : ''}`}>
      {formData.category ? 
        categories.find((cat: any) => cat._id === formData.category)?.name : 
        'Select a category'}
    </span>
    {isOpen ? (
      <ChevronUp className="h-4 w-4 text-gray-500" />
    ) : (
      <ChevronDown className="h-4 w-4 text-gray-500" />
    )}
  </div>
              
              {isOpen && (
    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
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
            </div>
            <div>
              <input
                type="text"
                name="subCategory"
                placeholder="Sub Category"
                className="p-2 border rounded w-full"
                value={formData.subCategory}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="specifications"
              placeholder="Specifications (comma-separated)"
              className="p-2 border rounded w-full"
              value={formData.specifications}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Product Images</h3>
            <input
              type="file"
              onChange={handleFileChange}
              className="p-2 border rounded w-full"
              multiple
              accept="image/*"
            />
            <p className="text-sm text-gray-500 mt-1">You can upload multiple images</p>
          </div>

          <button 
            type="submit" 
            className="bg-[#0A8E8A] text-white p-2 rounded hover:bg-[#097a77] transition-colors"
          >
            Add Product
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}