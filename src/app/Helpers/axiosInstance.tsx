import axios, {AxiosInstance} from "axios";

const BASE_URL:string =  "http://localhost:5000/api/v1/" //http://localhost:5000 , https://your-lab-userpage-backend.onrender.com

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;