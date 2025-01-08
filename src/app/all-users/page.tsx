'use client';

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllUsers } from "../GlobalRedux/slice/AuthSlice";
import { Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import DashboardLayout from "../dashboard/page";

const UsersList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get users data from Redux store
  const { users } = useSelector((state: any) => state.auth);

  console.log("users: ", users);

  // Fetch users when page changes
  useEffect(() => {
    dispatch(fetchAllUsers(currentPage));
  }, [dispatch, currentPage]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= users?.totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= users?.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-white">
        {/* Header with Search and Add New */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
      
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 font-medium">User</th>
                <th className="text-left py-4 font-medium">Phone</th>
                <th className="text-left py-4 font-medium">Email</th>
                <th className="text-right py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(users?.users) && users?.users.length > 0 ? (
              users.users.map((user, index) => (
                <tr key={user._id || index} className="border-b hover:bg-gray-50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.productName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{user?.phone}</td>
                  <td className="py-4">{user?.email}</td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ): (
              <tr>
                <td colSpan="4" className="text-center py-4">No users found.</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, users?.totalUsers)} of {users?.totalUsers} entries
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded ${
                  currentPage === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button 
              className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === users?.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersList;