"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AppDispatch } from "../GlobalRedux/store";
import DashboardLayout from '../dashboard/page';
import { createCoupon } from '../GlobalRedux/slice/ProductSlice';

interface FormData {
  code: string;
  description: string;
  discount: string;
  discountType: string;
  minimumPrice: string;
  maximumOrder: string;
  status?: boolean;
  usageLimit: string;
}

interface Errors {
  code?: string;
  description?: string;
  discount?: string;
  discountType?: string;
  minimumPrice?: string;
  maximumOrder?: string;
  status?: boolean;
  usageLimit?: string;
}

export default function AddCoupon() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    code: '',
    description: '',
    discount: '',
    discountType: '',
    minimumPrice: '',
    maximumOrder: '',
    status: false,
    usageLimit: '',
  });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors: Errors = {};

    if (!formData.code || formData.code.trim().length < 2) {
      newErrors.code = 'Coupon code must be at least 2 characters.';
    }
    if (!formData.description || formData.description.trim().length < 2) {
      newErrors.description = 'Coupon description must be at least 10 characters.';
    }
    if (!formData.discount || isNaN(Number(formData.discount)) || Number(formData.discount) <= 0) {
      newErrors.discount = 'Discount must be a positive number.';
    }
    if (!formData.discountType) {
      newErrors.discountType = 'Please select a discount type.';
    }
    if (!formData.minimumPrice || isNaN(Number(formData.minimumPrice)) || Number(formData.minimumPrice) < 0) {
      newErrors.minimumPrice = 'Minimum price must be a non-negative number.';
    }
    if (!formData.maximumOrder || isNaN(Number(formData.maximumOrder)) || Number(formData.maximumOrder) < 0) {
      newErrors.maximumOrder = 'Maximum order must be a non-negative number.';
    }
    if (!formData.status) {
      newErrors.status = 'Please select a status.';
    }
    if (!formData.usageLimit || isNaN(Number(formData.usageLimit)) || Number(formData.usageLimit) < 0) {
      newErrors.usageLimit = 'Usage limit must be a non-negative number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await dispatch(createCoupon(formData));
        console.log("response: 01", response)
        
        if (response.payload && !response.payload.error) {
          toast.success("Coupon added successfully!");
          setFormData({
            code: '',
            description: '',
            discount: '',
            discountType: '',
            minimumPrice: '',
            maximumOrder: '',
            status: false,
            usageLimit: '',
          });
        } else {
          toast.error(response.payload?.message || "Failed to add coupon");
        }
      } catch (error) {
        console.error("Coupon addition error:", error);
        toast.error("An error occurred while adding the coupon");
      }
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Add Coupon</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                name="code"
                placeholder="Coupon Code"
                className="p-2 border rounded w-full"
                value={formData.code}
                onChange={handleChange}
              />
              {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
            </div>

            <div>
              <input
                type="text"
                name="description"
                placeholder="Description"
                className="p-2 border rounded w-full"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.code}</p>}
            </div>

            <div>
              <input
                type="number"
                name="discount"
                placeholder="Discount"
                className="p-2 border rounded w-full"
                value={formData.discount}
                onChange={handleChange}
              />
              {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
            </div>
            <div>
              <select
                name="discountType"
                className="p-2 border rounded w-full"
                value={formData.discountType}
                onChange={handleChange}
              >
                <option value="">Select Discount Type</option>
                <option value="percentage">Percentage</option>
              </select>
              {errors.discountType && <p className="text-red-500 text-sm">{errors.discountType}</p>}
            </div>
            <div>
              <input
                type="number"
                name="minimumPrice"
                placeholder="Minimum Price"
                className="p-2 border rounded w-full"
                value={formData.minimumPrice}
                onChange={handleChange}
              />
              {errors.minimumPrice && <p className="text-red-500 text-sm">{errors.minimumPrice}</p>}
            </div>
            <div>
              <input
                type="number"
                name="maximumOrder"
                placeholder="Maximum Order"
                className="p-2 border rounded w-full"
                value={formData.maximumOrder}
                onChange={handleChange}
              />
              {errors.maximumOrder && <p className="text-red-500 text-sm">{errors.maximumOrder}</p>}
            </div>
            <div>
              <select
                name="status"
                className="p-2 border rounded w-full"
                value={formData.status}
                onChange={handleChange}
              >
                <option value={false}>Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
            </div>
            <div>
              <input
                type="number"
                name="usageLimit"
                placeholder="Usage Limit"
                className="p-2 border rounded w-full"
                value={formData.usageLimit}
                onChange={handleChange}
              />
              {errors.usageLimit && <p className="text-red-500 text-sm">{errors.usageLimit}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            className="bg-green-700 text-white p-2 rounded hover:bg-green-600 transition-colors"
          >
            Add Coupon
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

