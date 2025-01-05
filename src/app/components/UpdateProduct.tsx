"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AddProducts, getAllCategories, getAllProduct, updateProduct } from '@/app/GlobalRedux/slice/AuthSlice';
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { AppDispatch } from "../GlobalRedux/store";
import { ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '../dashboard/page';

interface FormData {
    // id: string;
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

export default function UpdateProduct() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = searchParams.get("id");
  console.log("productId: ", productId)

  const [formData, setFormData] = useState<FormData>({
    // id: productId,
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    specifications: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, id: productId || "" }));
}, [productId]);

  console.log("formData id: ", formData)

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<string[]>([]);
  const [filteredProduct, setFilteredProduct] = useState<any | null>(null);
  const dropdownRef = useRef(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length + images.length > 4) {
        setErrors({ ...errors, images: 'Maximum 4 images allowed.' });
        toast.error('Maximum 4 images allowed.');
        return;
    }
    setErrors({ ...errors, images: undefined });
    setImages(newFiles); // Replace instead of append
};

  // Add function to handle image removal
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    if (images.length > 4) {
      newErrors.images = 'Maximum 4 images allowed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const formDataToSend = new FormData();
      formDataToSend.append('id', productId);
      formDataToSend.append('name', formData?.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('specifications', formData.specifications);
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

    //   console.log("our data: " ,formData)

      try {
        const response = await dispatch(updateProduct([productId, formData]));
        console.log("actual data: ", response);
        if (response?.payload?.success) {
            const updatedProduct = response.payload.product;
            setFormData(updatedProduct); // Update form data with the server response
            setImages([]); // Clear the images state if needed
            toast.success('Product updated successfully!');
            router.push('/product-list');
        } else {
          toast.error(response?.payload?.message || 'Failed to update product.');
        }
      } catch (error) {
        toast.error('An error occurred while updating the product.');
      }
    } else {
      toast.error('Please correct the errors in the form.');
    }
  };

//   get product 

  const { products, error } = useSelector((state: RootState) => state.auth);
  
    // console.log(products)
  
    useEffect(() => {
      dispatch(getAllProduct());
    }, [dispatch]);

console.log("filteredProduct: 01 ", formData)

    useEffect(() => {
        // Assuming you have the productId
        const product = products.find((product: any) => product._id === productId);
    
        if (product) {
          setFormData(product);
        } else {
          console.error(`Product with ID ${productId} not found.`);
        }
      }, [products]);

  const { categories, loading } = useSelector((state: any) => state.auth);

console.log("formData: ", formData)

const handleCategorySelect = (categoryId: string) => {
    console.log(categoryId)
    const selectedCategory = categories.find((category) => category.id === categoryId);
    console.log("selectedCategory: ", selectedCategory)
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

  useEffect(() => {
    setFormData((prev) => ({ ...prev, id: productId || "" }));
  }, [productId]);

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg" ref={dropdownRef}>
        <h2 className="text-2xl font-bold mb-4 text-[#0A8E8A]">Update Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                className="p-2 border rounded w-full"
                value={formData?.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors?.name}</p>}
            </div>
            <div>
              <input
                type="text"
                name="description"
                placeholder="Product Description"
                className="p-2 border rounded w-full"
                value={formData?.description}
                onChange={handleChange}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors?.description}</p>}
            </div>
            <div>
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="p-2 border rounded w-full"
                value={formData?.price}
                onChange={handleChange}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors?.price}</p>}
            </div>
            <div>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                className="p-2 border rounded w-full"
                value={formData?.stock}
                onChange={handleChange}
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors?.stock}</p>}
            </div>
          </div>

          

          <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                      <div
              className="p-2 border rounded w-full flex justify-between items-center cursor-pointer bg-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={`${!formData?.category ? 'text-gray-400' : ''}`}>
                {formData?.category ? 
                  categories.find((cat: any) => cat._id === formData?.category)?.name || formData.category?.name : 
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
                        key={category?._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCategorySelect(category?._id)}
                      >
                        {category?.name}
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
                          value={formData?.subCategory}
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
              value={formData?.specifications}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Product Images</h3>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <input
                type="file"
                onChange={handleFileChange}
                className="p-2 w-full"
                multiple
                accept="image/*"
                max="4"
                disabled={images?.length >= 4}
              />
              <p className="text-sm text-gray-500 mt-1">
                {images.length >= 4 
                  ? "Maximum number of images reached"
                  : `You can add ${4 - images?.length} more image${4 - images?.length === 1 ? '' : 's'}`
                }
              </p>
            </div>
            
            {errors?.images && <p className="text-red-500 text-sm mt-2">{errors?.images}</p>}
            
            {/* Display selected images */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Selected Images ({images?.length}/4)
                </p>
                <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                  {images.map((image, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                          {image?.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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