'use client';

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../GlobalRedux/store";
import { getAllProduct } from "../GlobalRedux/slice/AuthSlice";
import toast from "react-hot-toast";
import DashboardLayout from "../dashboard/page";

interface Product {
  id: number;
  name: string;
  specification: string;
  price: number;
}

export default function ProductList() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#0A8E8A]">Product List</h2>
        <table className="min-w-full bg-white border border-gray-200 mb-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Specification</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(products) && products.map((product: Product, index: number) => (
              <tr key={product.id || index}>
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">{product.specification}</td>
                <td className="py-2 px-4 border-b">{product.price}</td>
                <td className="py-2 px-4 border-b">
                  <button className="hover:text-teal-700 mr-2">Update</button>
                  <button className="text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}