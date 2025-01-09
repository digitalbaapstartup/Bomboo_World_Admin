'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
import { fetchAllOrders, getAddressById } from '@/app/GlobalRedux/slice/AuthSlice';

const OrderDetailsPage = () => {
  const orderItems = [
    {
      id: 1,
      image: "/api/placeholder/80/80",
      name: "Kristin Watson",
      quantity: 1,
      price: 50.47
    },
    {
      id: 2,
      image: "/api/placeholder/80/80",
      name: "Kristin Watson",
      quantity: 1,
      price: 50.47
    },
    {
      id: 3,
      image: "/api/placeholder/80/80",
      name: "Kristin Watson",
      quantity: 1,
      price: 50.47
    }
  ];

  const { id } = useParams();
  const searchParams = useSearchParams();
    const addressId = searchParams.get("addressId") ;

  const dispatch = useDispatch();
  
  const {orders, address} = useSelector((state) => state.auth);
  console.log("address: ", address)

  const orderDetails = orders?.orders?.length > 0 ? orders.orders.filter((order) => order?._id === id) : [];
    console.log("orderDetails: ", orderDetails);

  useEffect(() => {
    dispatch(getAddressById(addressId));
    dispatch(fetchAllOrders());
    }, [addressId, dispatch, id]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Breadcrumb */}
      <Link href="/all-orders">
<h1 className='font-bold text-4xl mb-2 p-1'>{"<-"}</h1>
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-medium">All item</h2>
            </div>

            {/* Items List */}
            <div className="divide-y">
              {orderDetails.map((detail) => (
                detail?.orderItems.map((item)=>(
                <div key={item.id} className="p-4 flex items-center gap-4">
                    <img
                          src={item?.productId?.images[0]?.secure_url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Product name</p>
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-medium">${item.price}</p>
                    </div>
                  </div>
                </div>
                ))
              ))}
            </div>

          {/* User information */}
          {/* <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium mb-4">User Information</h3>
            <div className="space-y-3">
              
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Sub total</span>
                <span className="text-orange-500 font-medium">₹{orderDetails[0]?.subtotal?.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Tax</span>
                <span className="text-orange-500 font-medium">₹{orderDetails[0]?.tax?.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Total</span>
                <span className="text-orange-500 font-medium">₹{orderDetails[0]?.total?.toFixed(2)}</span>
              </div>
            </div>
          </div> */}

          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">{id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Order Date</span>
                <span className="font-medium">
                  {orderDetails[0]?.createdAt
                      ? new Date(orderDetails[0].createdAt).toLocaleDateString('en-GB', {
                         day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Sub total</span>
                <span className="text-orange-500 font-medium">₹{orderDetails[0]?.subtotal?.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Tax</span>
                <span className="text-orange-500 font-medium">₹{orderDetails[0]?.tax?.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Total</span>
                <span className="text-orange-500 font-medium">₹{orderDetails[0]?.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium mb-4">Shipping Address</h3>
            <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">User Name</span>
                <span className="font-medium">{address?.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">
                  {address?.mobileNumber}
                  </span>
              </div>
            <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Landmark</span>
                <span className="font-medium">{address?.landmark}</span>
              </div>
            <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Locality</span>
                <span className="font-medium">{address?.locality}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Address</span>
                <span className="font-medium">{address?.address}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">City</span>
                <span className="font-medium">{address?.city}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">State</span>
                <span className="font-medium">{address?.state}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-600">Pincode</span>
                <span className="font-medium">{address?.pinCode}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium mb-4">Payment Method</h3>
            <p className="text-gray-600">
              {orderDetails[0]?.paymentMethod}
            </p>
          </div>

          {/* Expected Date */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <Link href="/order-tracking">
            <button className="w-full flex items-center justify-center gap-2 text-blue-500 border border-blue-500 rounded-lg py-2 hover:bg-blue-50">
              <span>Track order</span>
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;