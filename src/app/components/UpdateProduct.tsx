"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { AddProducts, deleteProductImage, getAllCategories, getAllProduct, updateProduct } from '@/app/GlobalRedux/slice/AuthSlice';
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { AppDispatch } from "../GlobalRedux/store";
import { ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '../dashboard/page';
import Image from 'next/image';

interface FormData {
  // id: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  // subCategory: string;
  specifications: string;
  images: [];
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
  // console.log("productId: ", productId)

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<FormData>({
    // id: productId,
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    specifications: "",
    images: []
  });

  console.log("formData image: ", formData)
  useEffect(() => {
    setFormData((prev) => ({ ...prev, id: productId || "" }));
  }, [productId]);

  // console.log("formData id: ", formData)

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState<string[]>([]);
  const [filteredProduct, setFilteredProduct] = useState<any | null>(null);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, id: productId || "" }));
  }, [productId]);

  const handleProductRemoveImage =async (publicId)=>{
    console.log(publicId,'publicId')
const response =  await dispatch(deleteProductImage({id:productId,public_id:publicId}))
console.log(response,'image remove')
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to Array
    const filesArray = Array.from(files);

    // Check if the total number of images exceeds 4
    if (images.length + filesArray.length > 4) {
      toast.error("You can only upload up to 4 images");
      return;
    }

    // console.log("filesArray: ", filesArray)

    // Add the selected images to the state
    setImages((prev) => [...prev, ...filesArray]);

    // Add the selected images to the form data
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...filesArray],
    }));
  }

  // Add function to handle image removal
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // console.log("images hain: ", images)

  const validate = () => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Price must be positive.";
    if (!formData.stock || Number(formData.stock) < 0) newErrors.stock = "Stock cannot be negative.";
    if (!formData.category) newErrors.category = "Category is required.";
   
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    
    const response = dispatch(updateProduct({ id: productId, formData: formData }))
      .unwrap()
      .then((result) => {
        if (result.success) {
          toast.success("Product updated successfully");
          router.push("/product-list");
        } else {
          toast.error("Failed to update product");
        }
      })
      .catch(() => toast.error("Failed to update product"));
      console.log("filteredProduct: 01 ", response)
  };

  //   get product 

  const { categories, loading, products } = useSelector((state: any) => state.auth);

  // console.log(products)

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  // console.log("filteredProduct: 01 ", formData)

  useEffect(() => {
    if (productId && products) {
      const product = products.find((prod: any) => prod._id === productId);
      if (product) {
        setFormData({
          ...product,
          images: product.images.map((img: any) => img),
        });
      } else {
        console.error(`Product with ID ${productId} not found.`);
      }
    }
  }, [products, productId]);


  // console.log("formData: ", formData)

  const handleCategorySelect = (categoryId: string) => {
    setFormData({ ...formData, category: categoryId });
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

  // console.log("formData: ", formData)

  return (
    <DashboardLayout>
      <div className="p-6 rounded-lg" ref={dropdownRef}>
        <h2 className="text-2xl font-bold mb-4 text-green-700">Update Product</h2>

        <div className='flex items-center gap-[1rem] mb-[1rem]'>
  {formData?.images?.map((image, index) => (
    <div key={index} className='relative'>
      <button 
        className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-[0.2rem] hover:bg-red-600 transition-colors'
        onClick={() => handleProductRemoveImage(image?.public_id)}
      >
        &times;
      </button>
      <Image width={100} height={100} src={image?.secure_url} alt='image' className='rounded-xl' />
    </div>
  ))}
</div>
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
                disabled={formData.images.length >= 4}
              />
              <p className="text-sm text-gray-500 mt-1">
                {images.length >= 4
                  ? "Maximum number of images reached"
                  : `You can add ${4 - ( formData.images.length)} more image${4 - images?.length === 1 ? '' : 's'} | Delete Product Images from above`
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
            className="bg-green-700 text-white p-2 rounded hover:bg-green-600 transition-colors"
          >
            Update Product
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}