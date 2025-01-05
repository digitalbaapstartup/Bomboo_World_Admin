import React from 'react'
import Sidebar from '../components/Sidebar'

const DashboardLayout = ({children}) => {
  return (
    <div className='flex gap-[1rem]'>
      <div className='relative w-64'>
      <Sidebar />
      </div>
      <div className='w-[70%]'>
      {children}
      </div>
    </div>
  )
}

export default DashboardLayout
