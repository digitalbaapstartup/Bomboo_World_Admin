import { configureStore,combineReducers } from '@reduxjs/toolkit'
import authReducer from './slice/AuthSlice'


const rootReducer = combineReducers({
  auth: authReducer,
  //add all your reducers here
});

export const store = configureStore({
  reducer: rootReducer,

})

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;