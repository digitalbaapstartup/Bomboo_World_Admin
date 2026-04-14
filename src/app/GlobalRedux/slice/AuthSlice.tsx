import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/Helpers/axiosInstance";
import toast from "react-hot-toast";
import AuthHelper from "@/app/Helpers/authHelper";

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
  isAuthenticated: boolean;
}

type UpdateProductPayload = {
  id: string;
  formData: FormData;
};

const initialState: UserState = {
  data: {},
  categories: [],
  loading: false,
  error: null,
  products: [],
  users: [],
  orders: [],
  address: null,
  isAuthenticated: typeof window !== 'undefined' ? AuthHelper.isAuthenticated() : false,
};

export const getAllCategories = createAsyncThunk(
  "admin/getAllCategories",
  async (_, { rejectWithValue }) => {
    const toastId = toast.loading("Loading categories...");
    try {
      const response = await axiosInstance.get("admin/allCategory");
      toast.success("Categories loaded", { id: toastId });
      return response.data;
    } catch (error: any) {
      toast.error("Failed to load categories", { id: toastId });
      return rejectWithValue(error.response?.data || "Failed to load categories");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId: string, { rejectWithValue }) => {
    const toastId = toast.loading("Deleting product...");
    try {
      const res = await axiosInstance.delete(`admin/deleteProduct/${productId}`);
      toast.success("Product deleted successfully", { id: toastId });
      return res.data;
    } catch (error: any) {
      toast.error("Failed to delete product", { id: toastId });
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const AddCategories = createAsyncThunk(
  "admin/addCategory",
  async (data, { rejectWithValue }) => {
    const toastId = toast.loading("Adding category...");
    try {
      const response = await axiosInstance.post("/admin/addCategory", data);
      toast.success("Category added successfully", { id: toastId });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add category", { id: toastId });
      return rejectWithValue(error.response?.data?.message || "Failed to add category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "admin/updateCategory",
  async (
    { id, data }: { id: string; data: any },
    { rejectWithValue }
  ) => {
    const toastId = toast.loading("Updating category...");
    try {
      const response = await axiosInstance.put(`/admin/updateCategory/${id}`, data);
      toast.success("Category updated successfully", { id: toastId });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update category", { id: toastId });
      return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (id: string, { rejectWithValue }) => {
    const toastId = toast.loading("Deleting category...");
    try {
      const response = await axiosInstance.delete(`/admin/deleteCategory/${id}`);
      toast.success("Category deleted successfully", { id: toastId });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category", { id: toastId });
      return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
  }
);

export const AddProducts = createAsyncThunk(
  "admin/addProduct",
  async (data, { rejectWithValue }) => {
    const toastId = toast.loading("Adding product...");
    try {
      const response = await axiosInstance.post("/admin/addProduct", data);
      toast.success("Product added successfully", { id: toastId });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add product", { id: toastId });
      return rejectWithValue(error.response?.data?.message || "Failed to add product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, formData }: UpdateProductPayload, { rejectWithValue }) => {
    const toastId = toast.loading("Updating product...");
    try {
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
  async (
    { id, public_id }: { id: string; public_id: string },
    { rejectWithValue }
  ) => {
    const toastId = toast.loading("Deleting product image...");
    try {
      const response = await axiosInstance.delete(
        `admin/deleteProductImage/${id}/${public_id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Product image deleted successfully", { id: toastId });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product image", { id: toastId });
      return rejectWithValue(error.response?.data?.message || "Failed to delete product image");
    }
  }
);

export const getAllProduct = createAsyncThunk(
  "admin/getAllProduct",
  async (_, { rejectWithValue }) => {
    const toastId = toast.loading("Loading products...");
    try {
      const res = await axiosInstance.get("admin/allProducts");
      toast.success("Products loaded", { id: toastId });
      return res.data;
    } catch (error: any) {
      toast.error("Failed to fetch products", { id: toastId });
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);

export const AdminLogin = createAsyncThunk(
  "admin/adminLogin",
  async (data: any, { rejectWithValue }) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res = await axiosInstance.post("auth/login", data);
      const token = res?.data?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      if (res.data.success) {
        toast.success("Login Success", { id: toastId });
      }
      return res.data;
    } catch (error: any) {
      toast.error("Login failed. Please check your credentials and try again.", { id: toastId });
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const Logout = createAsyncThunk(
  "admin/logout",
  async (_, { rejectWithValue }) => {
    const toastId = toast.loading("Logging out...");
    try {
      const res = await axiosInstance.post("auth/logout");
      toast.success("Logout Success", { id: toastId });
      return res.data;
    }
      catch (error: any) {
      toast.error("Logout failed. Please try again.", { id: toastId });
      return rejectWithValue(error.response?.data || "Logout failed");
    } 
  })      

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (currentPage: number, { rejectWithValue }) => {
    const toastId = toast.loading("Loading users...");
    try {
      const response = await axiosInstance.get(`admin/allUsers?page=${currentPage}`, {
        withCredentials: true,
      });
      toast.success("Users loaded", { id: toastId });
      return response.data;
    } catch (error: any) {
      toast.error("Failed to load users", { id: toastId });
      return rejectWithValue(error.response?.data || "Failed to load users");
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (currentPage: number, { rejectWithValue }) => {
    const toastId = toast.loading("Loading orders...");
    try {
      const response = await axiosInstance.get(`admin/allOrders?page=${currentPage}`, {
        withCredentials: true,
      });
      toast.success("Orders loaded", { id: toastId });
      return response.data;
    } catch (error: any) {
      toast.error("Failed to load orders", { id: toastId });
      return rejectWithValue(error.response?.data || "Failed to load orders");
    }
  }
);

export const getAddressById = createAsyncThunk(
  "admin/getAddressById",
  async (addressId: string, { rejectWithValue }) => {
    const toastId = toast.loading("Loading address...");
    try {
      const res = await axiosInstance.get(`admin/getAddressById/${addressId}`);
      toast.success("Address loaded", { id: toastId });
      return res.data;
    } catch (error: any) {
      toast.error("Failed to fetch address", { id: toastId });
      return rejectWithValue(error.response?.data || "Failed to fetch address");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllCategories.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.categories = action.payload.data;
          state.error = null;
        }
      )
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(getAllProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.products = action.payload.data.products || [];
        state.error = null;
      })
      .addCase(getAllProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
        state.products = [];
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
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
        state.error = (action.payload as string) || "Failed to update product";
      })
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
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data;
        state.error = null;
      })
      .addCase(getAddressById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.address = action.payload.data;
        state.error = null;
      });
    builder.addCase(AddCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(AddCategories.fulfilled, (state, action) => {
      state.loading = false;
      if (state.categories) {
        state.categories.push(action.payload.data);
      }
    });
    builder.addCase(AddCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add category";
    });
    // Handle AdminLogin
    builder.addCase(AdminLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(AdminLogin.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.data = action.payload?.data || {};
      state.error = null;
      // Save auth state to localStorage
      AuthHelper.setAuthFromResponse(action.payload?.data);
    });
    builder.addCase(AdminLogin.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.error.message || "Login failed";
    });
    // Handle Logout
    builder.addCase(Logout.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(Logout.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.data = {};
      state.error = null;
      // Clear auth state from localStorage
      AuthHelper.clearAuthState();
    });
    builder.addCase(Logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Logout failed";
    });
  },
});

export default authSlice.reducer;
