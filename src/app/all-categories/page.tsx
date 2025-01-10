'use client';

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllCategories } from '../GlobalRedux/slice/ProductSlice';
import DashboardLayout from '../dashboard/page';

const AllCategories = () => {
    // const [categories, setCategories] = React.useState([]);
    const dispatch = useDispatch();
    const {categories} = useSelector((state) => state?.product);

    useEffect(() => {
        const res = dispatch(fetchAllCategories());
        // setCategories(response);
    }, [dispatch]);
    console.log("categories: ", categories);


  return (
    <DashboardLayout>

    <div className="p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-green-700">All Categories</h2>
        <table className="min-w-full bg-white border border-gray-200 mb-4">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Images</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories?.map((category, index: number) => (
              <tr key={category._id || index}>
                <td className="py-2 px-4 border-b ">{index + 1}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                    
                      <img
                        src={category?.image?.secure_url}
                        alt={category?.image?.name}
                        className="w-8 h-8 object-cover"
                      />
                  </td>
                <td className="py-2 px-4 border-b">{category?.name}</td>
                <td className="py-2 px-4 border-b">{""}</td>
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
  )
}
export default AllCategories;
