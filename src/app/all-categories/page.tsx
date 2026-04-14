'use client';

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllCategories } from '../GlobalRedux/slice/ProductSlice';
import DashboardLayout from '../dashboard/page';
import { useRouter } from 'next/navigation';
import { deleteCategory } from '../GlobalRedux/slice/AuthSlice';


const AllCategories = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const {categories} = useSelector((state) => state?.product);

    useEffect(() => {
        dispatch(fetchAllCategories());
    }, [dispatch]);

    // Function to handle update category
    const handleUpdateCategory = (categoryId) => {
        router.push(`/update-category/${categoryId}`);
    };

    const handleDeleteCategory = (categoryId) => {
          dispatch(deleteCategory(categoryId))
              .unwrap()
              .then((result) => {
                  // Refresh the categories list
                  dispatch(fetchAllCategories());
              })
              .catch((error) => {
                  // Error handling is already in the thunk, this is just for additional handling if needed
                  console.error("Delete operation failed:", error);
              });
  };

  return (
    <DashboardLayout>
    <div className="p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-700">All Categories</h2>
          <button 
            onClick={() => router.push('/add-categories')}
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            Add New Category
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200 mb-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Images</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories?.map((category, index) => (
              <tr key={category._id || index}>
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b flex justify-center">
                    {category?.image?.secure_url ? (
                      <img
                        src={category?.image?.secure_url}
                        alt={category?.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                </td>
                <td className="py-2 px-4 border-b">{category?.name}</td>
                <td className="py-2 px-4 border-b">
                  {category?.description ? (
                    category.description.length > 50 
                      ? `${category.description.substring(0, 50)}...` 
                      : category.description
                  ) : (
                    <span className="text-gray-400 italic">No description</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  <button 
                    className="hover:text-teal-700 mr-2"
                    onClick={() => handleUpdateCategory(category._id)}
                  >
                    Update
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            
            {(!categories || categories.length === 0) && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  No categories found. Add a new category to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
export default AllCategories;