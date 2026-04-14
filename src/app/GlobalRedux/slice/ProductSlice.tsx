import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/Helpers/axiosInstance";
import toast from "react-hot-toast";

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
  async (_, { rejectWithValue }) => {
    const toastId = toast.loading("Loading categories...");
    try {
      const res = await axiosInstance.get(`admin/allCategory`, {
        withCredentials: true,
      });
      toast.success("Categories loaded", { id: toastId });
      return res?.data?.data;
    } catch (error: any) {
      toast.error("Failed to load categories", { id: toastId });
      return rejectWithValue(error.response?.data || "Failed to load categories");
    }
  }
);

export const createCoupon = createAsyncThunk(
  "admin/createCoupon",
  async (couponData: any, { rejectWithValue }) => {
    const toastId = toast.loading("Creating coupon...");
    try {
      const res = await axiosInstance.post(`admin/createCoupon`, couponData, {
        withCredentials: true,
      });
      toast.success("Coupon created successfully", { id: toastId });
      return res?.data?.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create coupon", { id: toastId });
      return rejectWithValue(error.response?.data?.message || "Failed to create coupon");
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "admin/deleteCoupon",
  async (id: any, { rejectWithValue }) => {
    const toastId = toast.loading("Deleting coupon...");
    try {
      const res = await axiosInstance.delete(`admin/deleteCoupon/${id}`, {
        withCredentials: true,
      });
      toast.success("Coupon deleted successfully", { id: toastId });
      return res?.data?.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete coupon", { id: toastId });
      return rejectWithValue(error?.response?.data?.message || "Failed to delete coupon");
    }
  }
);

export const getAllCoupons = createAsyncThunk(
  "admin/allCoupons",
  async (_, { rejectWithValue }) => {
    const toastId = toast.loading("Loading coupons...");
    try {
      const res = await axiosInstance.get(`admin/allCoupons`, {
        withCredentials: true,
      });
      toast.success("Coupons loaded", { id: toastId });
      return res?.data?.data;
    } catch (error: any) {
      toast.error("Failed to load coupons", { id: toastId });
      return rejectWithValue(error.response?.data || "Failed to load coupons");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories?.fulfilled, (state, action: PayloadAction<any>) => {
        state.categories = action?.payload;
      })
      .addCase(getAllCoupons?.fulfilled, (state, action: PayloadAction<any>) => {
        state.couponse = action?.payload;
      });
  },
});

export default productSlice.reducer;
