"use client"

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { createDoctor, getAllCategories } from '../GlobalRedux/slice/AuthSlice';
import { useRouter } from "next/navigation";
import { isValidPassword,isValidPhone,isEmail } from '../Helpers/regexMatcher';
import { toast } from "react-hot-toast";
import { AppDispatch } from "../GlobalRedux/store";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FormData {
  firstName: string;
  phoneNumber: string;
  email: string;
  address: string;
  specialization: string;
  fees: string;
  pincode: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  firstName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  specialization?: string;
  fees?: string;
  pincode?: string;
  password?: string;
  confirmPassword?: string;
}

export default function AddDoctor() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    phoneNumber: '',
    email: '',
    address: '',
    specialization: '',
    fees: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });

  const [avatars, setAvatars] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length <= 3) {
      setAvatars(Array.from(e.target.files));
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
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pincodeRegex = /^[0-9]{6}$/;

    if (!formData.firstName || formData.firstName.length < 2 || !nameRegex.test(formData.firstName)) {
      newErrors.firstName = 'First name must be at least 2 characters and contain only letters.';
    }
    if (!formData.phoneNumber || !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits.';
    }
    if (!formData.email || !isEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters.';
    }
    if (!formData.specialization || formData.specialization.length < 2) {
      newErrors.specialization = 'Specialization must be at least 2 characters.';
    }
    if (!formData.fees || isNaN(Number(formData.fees)) || Number(formData.fees) <= 0) {
      newErrors.fees = 'Fees must be a positive number.';
    }
    if (!formData.pincode || !pincodeRegex.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits.';
    }
    if (!formData.password || !isValidPassword(formData.password)) {
      newErrors.password = 'Password should be 6 - 16 characters long with at least a number and special character.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const registerData = {
        // This seems to be a fixed value based on your patient registration
        fullName: formData.firstName,
        email: formData.email,
        password: formData.password,
        mobileNumber: formData.phoneNumber,
        address: formData.address,
        specialist: formData.specialization,
        description:'hello doctor',
        fees: formData.fees,
        pincode: formData.pincode,
        avatar: avatars.length > 0 ? avatars[0] : null,
      };

      try {
        const response = await dispatch(createDoctor(registerData));
        console.log(response)
        if (response?.payload?.success) {
         
          setFormData({
            firstName: '',
            phoneNumber: '',
            email: '',
            address: '',
            specialization: '',
            fees: '',
            pincode: '',
            password: '',
            confirmPassword: '',
            
          })
          setAvatars([])
          
        }
      } catch (error) {
        console.error("Doctor registration error:", error);
        toast.error("An error occurred during registration");
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories1 = [
    "Hospitality",
    "Electronics",
    "Kitchen",
    "Clothing",
    "Corporate Gifting",
    "Personal Care",
    "Furniture",
    "Educational"
  ];

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

 // Add selector for categories
 const { categories, loading } = useSelector((state: any) => state.auth);

  const handleCategorySelect = (category: string) => {
    handleChange({
      target: {
        name: 'specialization',
        value: category
      }
    } as ChangeEvent<HTMLInputElement>);
    setIsOpen(false);
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // console.log(categories)

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg" ref={dropdownRef}>
      <h2 className="text-2xl font-bold mb-4 text-[#0A8E8A]">Add Product</h2>
      <form ref={dropdownRef}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="productname"
              placeholder="Product Name"
              className="p-2 border rounded w-full"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div>
            <input
              type="text"
              name="description"
              placeholder="Product Description"
              className="p-2 border rounded w-full"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>
          <div>
            <input
              type="email"
              name="price"
              placeholder="Price"
              className="p-2 border rounded w-full"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              name="stock"
              placeholder="Stock"
              className="p-2 border rounded w-full"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <div
              className="p-2 border rounded w-full flex justify-between items-center cursor-pointer bg-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className={`${!formData.specialization && 'text-gray-400'}`}>
                {formData.specialization || 'Category'}
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
                        onClick={() => handleCategorySelect(category?.name)}
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
              name="subcategory"
              placeholder="Sub Category"
              className="p-2 border rounded w-full"
              value={formData.fees}
              onChange={handleChange}
            />
            {errors.fees && <p className="text-red-500 text-sm">{errors.fees}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="specification"
              placeholder="Specification"
              className="p-2 border rounded w-full"
              value={formData.pincode}
              onChange={handleChange}
            />
            {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold">Avatar Upload</h3>
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 border rounded w-full"
            multiple
          />
        </div>

        <button type="submit" className="bg-[#0A8E8A] text-white p-2 rounded" onClick={handleSubmit}>
          Add Product
        </button>
      </form>
    </div>
  );
}