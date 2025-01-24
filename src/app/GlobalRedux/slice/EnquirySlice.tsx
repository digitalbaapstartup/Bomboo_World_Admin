import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/Helpers/axiosInstance";

interface UserState {
  enquiries: Array<any>;
}

const initialState: UserState = {
  enquiries: [],
};

export const getAllEnquiries = createAsyncThunk(
  "admin/getAllEnquiries",
  async()=>{
    try {
      const res = await axiosInstance.get(`admin/allEnquiry`, {
        withCredentials: true,
      });
      console.log("allEnquiries res: ", res?.data);
      
      // Extract the token from the response

      return res?.data?.data;
    } catch (error: any) {
      throw error;
    } finally {
      console.log("finally");
    }
  }
)


const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllEnquiries?.fulfilled, (state, action: PayloadAction<any>)=>{
        state.enquiries = action.payload;
      })
  },
});

export default enquirySlice.reducer;
