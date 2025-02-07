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
  users: any;
  orders: any;
  address: any;
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

type UpdateProductPayload = {
  id: string;
  formData: FormData;
};

const initialState: UserState = {
  data: {},
  doctors: {},
  categories: [],
  loading: false,
  error: null,
  products: [],
  users: [],
  orders: [],
  address: null,
};



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

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`admin/deleteProduct/${productId}`);
      return res.data;
    } catch (error: any) {
      toast.error("Failed to delete product");
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const AddProducts = createAsyncThunk(
  "admin/addProduct",
  async (data) => {
    try {
      // console.log("product data:", data);
      const response = await axiosInstance.post('/admin/addProduct', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      toast.error("Failed to add product");
    }
  }
)

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, formData }: UpdateProductPayload, { rejectWithValue }) => {
    const toastId = toast.loading("Updating product...");
    try {

      
      // Send request to update product
      const response = await axiosInstance.put(`admin/updateProduct/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully", { id: toastId });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to update product.";
      toast.error(errorMessage, { id: toastId });
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProductImage = createAsyncThunk(
  "admin/deleteProductImage",
  async({id,public_id})=>{
    try {
      const response = await axiosInstance.delete(`admin/deleteProductImage/${id}/${public_id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response)
            return response.data;
    } catch (error: any) {
      toast.error("Failed to delete product image");
    }
  }
)

export const getAllProduct = createAsyncThunk(
  "admin/getAllProduct",
  async () => {
    try {
      const res = await axiosInstance.get("admin/allProducts");
      // Return the nested products data
      console.log("res", res);
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


export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (currentPage) => {
    try {
      const res = axiosInstance.get(`admin/allUsers?page=${currentPage}`, {
        withCredentials: true,
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

export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (currentPage) => {
    try {
      const res = axiosInstance.get(`admin/allOrders?page=${currentPage}`, {
        withCredentials: true,
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

//fetchOrderByid

export const getAddressById = createAsyncThunk(
  "admin/getAddressById",
  async (addressId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`admin/getAddressById/${addressId}`);
      // console.log("res: ", res);
      return res?.data;
    } catch (error: any) {
      // toast.error("Failed to fetch address");
      return rejectWithValue(error.response?.data || "An error occurred");
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
      // updateProduct
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Update the specific product in the products array
        const updatedProduct = action.payload.data;
        const productIndex = state.products.findIndex(
          (product: any) => product._id === updatedProduct._id
        );
        if (productIndex !== -1) {
          state.products[productIndex] = updatedProduct;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to update product";
      })
      // fetch users 
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.users = action.payload.data;
        state.error = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data;
        state.error = null;
      })
      .addCase(getAddressById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.address = action.payload.data;
        state.error = null;
      })
  },
});

export default authSlice.reducer;
