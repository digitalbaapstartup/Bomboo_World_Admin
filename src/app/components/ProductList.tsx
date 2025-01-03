'use client'
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../GlobalRedux/store";
import { allDoctors } from "../GlobalRedux/slice/AuthSlice";
import toast from "react-hot-toast";
import DashboardLayout from "../dashboard/page";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  fees: {
    firstVisitFee: number;
  };
  fullName:string;
  specialist:string;
  
}

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);


  const dispatch = useDispatch<AppDispatch>();
  const fetchDoctors = async () => {
    try {
      const response = await dispatch(allDoctors());
  
      if (response?.payload?.success) {
      
        setDoctors(response?.payload?.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchDoctors();
  }, [dispatch]);

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
          {doctors.map((doctor, index = 1) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{index++}</td>
              <td className="py-2 px-4 border-b">{doctor?.fullName}</td>
              <td className="py-2 px-4 border-b">{doctor?.specialist}</td>
              <td className="py-2 px-4 border-b">
                {doctor?.fees?.firstVisitFee}
              </td>
              <td className="py-2 px-4 border-b">
                <button
             
                  className="hover:text-teal-700 mr-2"
                >
                  Update
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 
    </div>
    </DashboardLayout>
  );
}
