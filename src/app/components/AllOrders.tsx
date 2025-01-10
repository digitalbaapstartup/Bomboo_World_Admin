'use client';

import React, { useEffect, useState } from 'react';
import { Search, Eye, Edit2, Trash2, X } from 'lucide-react';
import { fetchAllOrders, getAddressById } from '../GlobalRedux/slice/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

interface Order {
  _id: string;
  address: string;
  customer: string;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingCharges: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface OrdersState {
  orders: Order[];
  pagination: Pagination;
}

interface RootState {
  auth: {
    orders: OrdersState | null;
    address: any;
    loading: boolean;
  }
}

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, address, loading } = useSelector((state: RootState) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  console.log("orders: ", orders);

  useEffect(() => {
    dispatch(fetchAllOrders(currentPage));
  }, [dispatch, currentPage]);

  const pagination = orders?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };

  // const handleViewAddress = async (addressId: string) => {
  //   if (!addressId) return;
  //   try {
  //     const addressViaId = await dispatch(getAddressById(addressId));
  //     console.log("Fetched Address:", addressViaId);
  //     setIsAddressModalOpen(false);
  //   } catch (error) {
  //     console.error("Error fetching address:", error);
  //   }
  // };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, pagination.currentPage - 2);
    let endPage = Math.min(pagination.totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg ${
            i === pagination.currentPage
              ? 'bg-blue-600 text-white'
              : 'border text-gray-600 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
          <span>Export all order</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-[#f5f9ff]">
              <th className="text-left py-4 pl-4">Order ID</th>
              <th className="text-left py-4">Amount</th>
              <th className="text-left py-4">Payment Method</th>
              <th className="text-left py-4">Shipping Charges</th>
              <th className="text-left py-4">Phone</th>
              <th className="text-left py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders?.orders?.map((order) => (
              <tr key={order?._id} className="border-b">
                <Link href={
                      {
                        pathname: `/order-details/${order?._id}`,
                        query: {
                          addressId: order?.address,
                        },
                      }
                    }>
                <td className="py-4 pl-4">{order?._id}</td>
                    </Link>
                <td className="py-4">₹{(order?.tax + order?.total).toFixed(2)}</td>
                <td className="py-4">{order?.paymentMethod}</td>
                <td className="py-4">{order?.shippingCharges}</td>
                <td className="py-4">{address?.mobileNumber}</td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <Link href={
                      {
                        pathname: `/order-details/${order?._id}`,
                        query: {
                          addressId: order?.address,
                        },
                      }
                    }>
                    <button 
                      className="px-2 py-2 bg-green-200 hover:bg-green-300 rounded-lg text-gray-900 hover:text-gray-700"
                    >
                      View Details
                    </button>
                    </Link>
                  </div>
                </td>
              </tr>
              )
)}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-gray-500">
            Showing {((pagination?.currentPage - 1) * 10) + 1} to {Math.min(pagination?.currentPage * 10)} of {pagination?.total} entries
          </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`px-3 py-1 rounded-lg ${
              pagination.currentPage === 1
                ? 'border text-gray-300'
                : 'border text-gray-600 hover:bg-gray-50'
            }`}
          >
            &lt;
          </button>
          {renderPaginationButtons()}
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`px-3 py-1 rounded-lg ${
              pagination.currentPage === pagination.totalPages
                ? 'border text-gray-300'
                : 'border text-gray-600 hover:bg-gray-50'
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;