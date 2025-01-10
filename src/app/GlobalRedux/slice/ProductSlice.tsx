import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/Helpers/axiosInstance";

interface UserState {
  categories: Array<any>;
  couponse: Array<any>;
  loading: boolean;
  error: any;
}

const initialState: UserState = {
  categories: [],
  couponse: [],
  loading: false,
  error: null,
};

export const fetchAllCategories = createAsyncThunk(
  "admin/allCategories",
  async () => {
    try {
      const res = await axiosInstance.get(`admin/allCategory`, {
        withCredentials: true,
      });      
      // Extract the token from the response

      return res?.data?.data;
    } catch (error: any) {
      throw error;
    } finally {
      console.log("finally");
    }
  }
);

export const createCoupon = createAsyncThunk(
  "admin/createCoupon",
  async (couponData: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`admin/createCoupon`, couponData, {
        withCredentials: true,
      });
      return res?.data?.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create coupon');
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "admin/deleteCoupon",
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`admin/deleteCoupon/${id}`, {
        withCredentials: true,
        });
        console.log("wow: ", res);
        return res?.data?.data;
        } catch (error: any) {
          return rejectWithValue(error?.response?.data?.message || 'Failed to delete coupon');
        }
    }
)

export const getAllCoupons = createAsyncThunk(
  "admin/allCoupons",
  async()=>{
    try {
      const res = await axiosInstance.get(`admin/allCoupons`, {
        withCredentials: true,
      });
      console.log("allcoupons res: ", res?.data);
      
      // Extract the token from the response

      return res?.data?.data;
    } catch (error: any) {
      throw error;
    } finally {
      console.log("finally");
    }
  }
)


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories?.fulfilled, (state, action: PayloadAction<any>) => {
          state.categories = action?.payload;
        //   console.log("action: ", state.categories)
      })
      .addCase(getAllCoupons?.fulfilled, (state, action: PayloadAction<any>)=>{
        state.couponse = action?.payload;
      })
  },
});

export default productSlice.reducer;
