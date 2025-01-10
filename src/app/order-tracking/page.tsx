import React from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';

const OrderTracking = () => {
  const trackingSteps = [
    { label: "Receiving orders", time: "05:43 AM", completed: true },
    { label: "Order processing", time: "01:21 PM", completed: true },
    { label: "Being delivered", time: "Processing", completed: true },
    { label: "Delivered", time: "Pending", completed: false }
  ];

  const trackingHistory = [
    {
      date: "20 Nov 2023",
      time: "2:30 PM",
      description: "The sender is preparing the goods",
      location: "2715 Ash Dr. San Jose, South Dakota 83475"
    },
    {
      date: "20 Nov 2023",
      time: "03:00 PM",
      description: "The order has arrived at the post office",
      location: "3517 W. Gray St. Utica, Pennsylvania 57867"
    },
    {
      date: "21 Nov 2023",
      time: "03:58 AM",
      description: "The carrier is picking up the goods",
      location: "1901 Thornridge Cir. Shiloh, Hawaii 81063"
    },
    {
      date: "22 Nov 2023",
      time: "06:26 PM",
      description: "The order has been shipped",
      location: "4140 Parker Rd. Allentown, New Mexico 31134"
    },
    {
      date: "22 Nov 2023",
      time: "03:45 PM",
      description: "Your order will be delivered to you in 30 minutes",
      location: "8502 Preston Rd. Inglewood, Maine 98380"
    },
    {
      date: "23 Nov 2023",
      time: "12:21 AM",
      description: "The order has been delivered successfully",
      location: "3891 Ranchview Dr. Richardson, California 82639"
    }
  ];

  return (
    <div className="max-w-[80%] mx-auto p-6 rounded-lg shadow mt-[3rem] border">
      <Link href="/all-orders">
        <h1 className='font-bold text-4xl mb-2 p-1'>{"<-"}</h1>
      </Link>
      {/* Status Message */}
      <div className="text-sm text-gray-600 mb-8">
        Your items is on the way. Tracking information will be available within 24 hours.
      </div>

      {/* Progress Tracker */}
      <div className="relative mb-12">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: '75%' }} />
        </div>
        <div className="relative flex justify-between">
          {trackingSteps.map((step, index) => (
            <div key={step.label} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.completed ? 'bg-blue-500' : 'bg-gray-200'
              }`}>
                {step.completed ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <div className="w-5 h-5" />
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="font-medium text-sm">{step.label}</div>
                <div className="text-xs text-gray-500">{step.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tracking History */}
      <div className="space-y-6">
        {trackingHistory.map((event, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-gray-600">{event.date}</div>
            <div className="text-gray-600">{event.time}</div>
            <div className="font-medium">{event.description}</div>
            <div className="text-gray-600">{event.location}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;