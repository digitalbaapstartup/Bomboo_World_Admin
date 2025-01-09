import { configureStore,combineReducers } from '@reduxjs/toolkit'
import authReducer from './slice/AuthSlice'
import productReducer from './slice/ProductSlice'


const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer
  //add all your reducers here
});

export const store = configureStore({
  reducer: rootReducer,

})

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;