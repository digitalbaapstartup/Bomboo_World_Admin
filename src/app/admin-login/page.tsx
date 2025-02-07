"use client";
import Link from "next/link";

// import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {AdminLogin} from '@/app/GlobalRedux/slice/AuthSlice'
import { useRouter } from "next/navigation";

const AdminSignin = () => {
  // console.log(signup);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const router = useRouter();

  const role = "admin";

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await dispatch(AdminLogin({email: email, password:password}));
      if(res?.payload?.success){
        router.push("/Add-Product")
      }

    } catch (error) {
      console.error('Login error:', error);
    }
    }

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[120px]">
        <div className="">
          <div className="mx-auto flex flex-wrap">
            <div className="w-full px-4">
              <div className="[box-shadow:0_0_0.5rem_0_lightgray] mx-auto max-w-[500px] rounded px-6 py-5 dark:bg-dark sm:p-[30px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl">
                  Create your account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  It’s totally free and super easy
                </p>

                <form>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm text-dark"
                    >
                      {" "}
                      Work Email{" "}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your Email"
                      className="border-stroke dark:text-body-color-dark bg-[#f8f8f8] dark:shadow-two w-full rounded-sm border px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:focus:border-primary dark:focus:shadow-none"
                    />
                  </div>
                  <div className="mb-4 relative">
                    <label
                      htmlFor="password"
                      className="mb-3 block text-sm text-dark"
                    >
                      {" "}
                      Your Password{" "}
                    </label>
                    <input
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your Password"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:focus:border-primary dark:focus:shadow-none"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[3rem] hover:text-gray-medium dark:text-gray-300 dark:hover:text-gray-low text-[1.2rem]"
                    >
                      {<FaEye /> }
                    </button>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="checkboxLabel"
                      className="flex cursor-pointer select-none text-sm font-medium text-body-color items-start gap-2"
                    >
                      <div className="relative mt-[.3rem]">
                        <input
                          type="checkbox"
                          id="checkboxLabel"
                          className="w-4 h-4 border-[.01rem]"
                        />
                        
                      </div>
                      <span>
                        By creating account means you agree to the
                        <a href="#0" className="text-primary hover:underline">
                          {" "}
                          Terms and Conditions{" "}
                        </a>
                        , and our
                        <a href="#0" className="text-primary hover:underline">
                          {" "}
                          Privacy Policy{" "}
                        </a>
                      </span>
                    </label>
                  </div>
                  <div className="mb-6">
                    <button
                      onClick={(e) => {
                        handleLogin(e);
                      }}
                      className="shadow-submit hover:bg-gray-100 dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium border duration-300 hover:bg-primary/90"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>

                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                  <p className="w-full px-5 text-center text-base font-medium text-body-color">
                    Or, register with Google
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color/50 sm:block"></span>
                </div>
                {/* <SignInButton /> */}
                <p className="text-center text-base font-medium text-body-color">
                  Already using Startup?{" "}
                  <Link href="/signin" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default AdminSignin;
