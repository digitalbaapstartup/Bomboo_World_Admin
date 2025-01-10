import React from 'react'
import Sidebar from '../components/Sidebar'

const DashboardLayout = ({children}) => {
  return (
    <div className='flex gap-[1rem] h-[100vh]'>
      <div className='relative w-64 bg-[#201e1e] text-white'>
      <Sidebar />
      </div>
      <div className='w-[70%]'>
      {children}
      </div>
    </div>
  )
}

export default DashboardLayout
