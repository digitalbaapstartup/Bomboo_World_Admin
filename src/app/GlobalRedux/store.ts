import { configureStore,combineReducers } from '@reduxjs/toolkit'
import authReducer from './slice/AuthSlice'
import productReducer from './slice/ProductSlice'
import enquiryReducer from './slice/EnquirySlice'

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  enquiry: enquiryReducer,
  //add all your reducers here
});

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;