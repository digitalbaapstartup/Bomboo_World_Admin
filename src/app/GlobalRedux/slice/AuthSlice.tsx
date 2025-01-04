import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/Helpers/axiosInstance";
import { Toast, toast } from "react-hot-toast";

interface UserState {
  data: Record<string, any>;
  doctors: Record<string, any>;
  categories: Array<any>;
  loading: boolean;
  error: string | null;
  products: any;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  address: string;
  specialist: string;
  description: string;
  fees: string;
  pincode: string;
  avatar: File | null;
}

const initialState: UserState = {
  data: {},
  doctors: {},
  categories: [],
  loading: false,
  error: null,
  products: []
};

export const createDoctor = createAsyncThunk(
  "doctor/register",
  async (data: RegisterData) => {
    console.log(data);
    try {
      const res = axiosInstance.post("doctor/register", data, {
        withCredentials: true,
      });
      toast.promise(res, {
        loading: "Wait! creating doctor ",
        success: (data) => data?.data?.message,
        error: "Failed to create Doctors",
      });
      // Extract the token from the response
      const response = await res;

      return response.data;
    } catch (error: any) {
      throw error;
    } finally {
      console.log("finally");
    }
  }
);

export const getAllCategories = createAsyncThunk(
  "admin/getAllCategories",
  async () => {
    try {
      const res = axiosInstance.get("admin/allCategory");
      console.log("res ,", res)

      const response = await res;
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
);

export const AddProducts = createAsyncThunk(
  "admin/addProduct",
  async (data) => {
    try {
      // console.log("product data:", data);
      const res = axiosInstance.post("admin/addProduct", data);
      // console.log("response:",res)
      if (res?.data?.success) {
        toast.success("Product added successfully");
      }
      return res;
    } catch (error: any) {
      toast.error("Failed to add product");
    }
  }
)

export const getAllProduct = createAsyncThunk(
  "admin/getAllProduct",
  async () => {
    try {
      const res = await axiosInstance.get("admin/allProducts");
      if (res?.data?.success) {
        toast.success("Products fetched successfully");
      }
      // Return the nested products data
      return res.data;
    } catch (error: any) {
      toast.error("Failed to fetch products");
      throw error;
    }
  }
);


export const AdminLogin = createAsyncThunk(
  "admin/adminLogin",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("auth/login", data);
      console.log("res", res);
      if (res.data.success) {
        toast.success("Login Success")
      }
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
)

export const allPatientEnquiry = createAsyncThunk(
  "admin/allPatientEnquiry",
  async () => {
    try {
      const res = axiosInstance.get("admin/getAllPatientEnquiry", {
        withCredentials: true,
      });

      toast.promise(res, {
        loading: "Fetching enquiries ",
        success: (data) => data?.data?.message,
        error: "Failed to find enquiry ",
      });

      // Extract the token from the response
      const response = await res;

      return response.data;
    } catch (error: any) {
      throw error;
    } finally {
      console.log("finally");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDoctor.fulfilled, (state, action: PayloadAction<any>) => {
        state.data = action?.payload?.data;
      })
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.categories = action.payload.data;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(getAllProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Access the products array from the nested data structure
        state.products = action.payload.data.products || [];
        state.error = null;
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
        state.products = [];
      })
  },
});

export default authSlice.reducer;
