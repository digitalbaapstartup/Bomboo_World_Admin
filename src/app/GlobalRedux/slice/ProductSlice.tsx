import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/Helpers/axiosInstance";

interface UserState {
  categories: Array<any>;
}

const initialState: UserState = {
  categories: [],
};

export const fetchAllCategories = createAsyncThunk(
  "admin/allCategories",
  async () => {
    try {
      const res = await axiosInstance.get(`admin/allCategory`, {
        withCredentials: true,
      });
      console.log("res: ", res?.data?.data);
      
      // Extract the token from the response

      return res?.data?.data;
    } catch (error: any) {
      throw error;
    } finally {
      console.log("finally");
    }
  }
);


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.fulfilled, (state, action: PayloadAction<any>) => {
          state.categories = action?.payload;
        //   console.log("action: ", state.categories)
      })
  },
});

export default productSlice.reducer;
