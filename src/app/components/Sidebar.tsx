"use client"
import { useRouter } from 'next/navigation'

import React from 'react';

const Sidebar: React.FC = () => {
  const router = useRouter()
  return (
    <aside className="bg-green-800 rounded-xl shadow-xl fixed text-white h-screen p-8">
      <h2 className="text-2xl font-bold mb-2">Bomboo World </h2>
      <p className="mb-8 text-gray-200">Admin Panel</p>
      <nav>
        <ul className="space-y-4">
          <li>
            <button onClick={() => router.push('/admin-login') }
              className="text-white hover:text-gray-300 transition-colors">
                Admin Login
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push('/users-enquiry') }
              className="text-white hover:text-gray-300 transition-colors"
            >
              All User
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push('/all-orders') }
              className="text-white hover:text-gray-300 transition-colors"
            >
              All Orders
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push('/Add-Product') }
              className="text-white hover:text-gray-300 transition-colors"
            >
              Add Product  
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push('/product-list')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              Product List
            </button>
          </li>
          <li>
            <button
          
              className="text-white hover:text-gray-300 transition-colors"
            >
              Upload Image
            </button>
          </li>
         
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
