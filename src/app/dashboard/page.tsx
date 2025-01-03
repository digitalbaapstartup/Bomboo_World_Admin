import React from 'react'
import Sidebar from '../components/Sidebar'

const DashboardLayout = ({children}) => {
  return (
    <div className='flex gap-[1rem]'>
      <Sidebar />
      <div className='w-[70%]'>
      {children}
      </div>
    </div>
  )
}

export default DashboardLayout
