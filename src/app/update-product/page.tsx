import React, { Suspense } from 'react'
import UpdateProduct from '../components/UpdateProduct'


const UpdateProductContainer = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
      <UpdateProduct />
      </Suspense>
    
    </div>
  )
}

export default UpdateProductContainer
