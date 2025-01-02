'use client'
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/GlobalRedux/store";
import toast from "react-hot-toast";
import { allPatientEnquiry } from "@/app/GlobalRedux/slice/AuthSlice";

interface PatientEnquiry {
  id: number;
  name: string;
  number: string;
  date: string;
}

export default function PatientEnquiryList() {
  const [enquiries, setEnquiries] = useState<PatientEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dispatch(allPatientEnquiry());
      
      console.log("API Response:", response); // Debug log
      
      if (response?.payload?.success) {
        const data = response.payload.data;
        console.log("Enquiries data:", data); // Debug log
        
        if (Array.isArray(data)) {
          setEnquiries(data);
        } else {
          setError("Received data is not an array");
          console.error("Received data is not an array:", data);
        }
      } else {
        setError("Failed to fetch enquiries");
        console.error("API call was not successful:", response);
      }
    } catch (error) {
      setError("An error occurred while fetching enquiries");
      console.error("Error in fetchEnquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [dispatch]);

  const renderTableContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={5} className="py-4 text-center">Loading enquiries...</td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan={5} className="py-4 text-center text-red-500">{error}</td>
        </tr>
      );
    }

    if (enquiries.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="py-4 text-center">No enquiries found</td>
        </tr>
      );
    }

    return enquiries.map((enquiry, index) => (
      <tr key={enquiry.id}>
        <td className="py-2 px-4 border-b">{index + 1}</td>
        <td className="py-2 px-4 border-b">{enquiry.name}</td>
        <td className="py-2 px-4 border-b">{enquiry.number}</td>
        <td className="py-2 px-4 border-b">{enquiry.date}</td>
      </tr>
    ));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-[#0A8E8A]">Patient Enquiry List</h2>
      <table className="min-w-full bg-white border border-gray-200 mb-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Number</th>
            <th className="py-2 px-4 border-b">Date</th>
          </tr>
        </thead>
        <tbody>
          {renderTableContent()}
        </tbody>
      </table>

    </div>
  );
}