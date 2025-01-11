'use client';

import React, { useEffect, useState } from 'react'
import { getAllCoupons, deleteCoupon } from '../GlobalRedux/slice/ProductSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MoreHorizontal, CheckCircle, Clock, AlertCircle, RefreshCcw } from 'lucide-react'
import DashboardLayout from '../dashboard/page';
import { toast } from 'react-hot-toast';
  
interface Coupon {
  _id: string
  code: string
  discount: number
  discountType: string
  minimumPrice: number
  maximumOrder: number
  status: boolean
  usageLimit: number
  startDate: string
  endDate: string
}

const StatusBadge = ({ status }: { status: boolean }) => {
  const styles = status
    ? 'bg-emerald-100 text-emerald-600'
    : 'bg-amber-100 text-amber-600';

  const icons = status
    ? <CheckCircle className="w-4 h-4" />
    : <AlertCircle className="w-4 h-4" />;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles}`}>
      {icons}
      {status ? 'Active' : 'Inactive'}
    </span>
  )
}

const AllCoupons = () => {
    const dispatch = useDispatch();
    const { couponse } = useSelector((state: any) => state?.product);
    console.log("couponse: ", couponse)
    
    useEffect(() => {
        dispatch(getAllCoupons());
    }, [dispatch])

    const [selectedCoupons, setSelectedCoupons] = useState<string[]>([])

    const toggleCoupon = (couponId: string) => {
      setSelectedCoupons(prev => 
        prev.includes(couponId) 
          ? prev.filter(id => id !== couponId)
          : [...prev, couponId]
      )
    }

    const toggleAll = () => {
      setSelectedCoupons(prev => 
        prev.length === couponse.length 
          ? [] 
          : couponse.map((coupon: Coupon) => coupon._id)
      )
    }

    const handleDelete = async (id: string) => {
      try {
        const response = await dispatch(deleteCoupon(id));
        console.log("response: ", response)
        if (response.payload && !response.payload.error) {
          toast.success("Coupon deleted successfully!");
          await dispatch(getAllCoupons()); // Refresh the coupon list
        }
      } catch (error) {
        console.error("Coupon deletion error:", error);
        toast.error("An error occurred while deleting the coupon");
      }
    }

    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow overflow-hidden mt-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#e5e7eb]">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium">
                    Discount
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium">
                    Min Price
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-medium">
                    Usage Limit
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {couponse && couponse.map((coupon: Coupon) => (
                  <tr key={coupon._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{coupon.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {coupon.discount}{coupon.discountType === 'percentage' && '%'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">₹{coupon.minimumPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={coupon.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {coupon.usageLimit}
                    </td>
                    <td className="px-6 py-4 space-x-3 whitespace-nowrap text-right text-sm">
                      <button className="text-gray-900 hover:text-gray-600 bg-green-200 hover:bg-green-300 p-2 rounded-lg">
                        Update
                      </button>
                      <button 
                        className="text-gray-900 hover:text-gray-600 bg-red-200 hover:bg-red-300 p-2 rounded-lg"
                        onClick={() => handleDelete(coupon._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    )
}

export default AllCoupons