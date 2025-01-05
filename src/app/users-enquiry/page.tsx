'use client';

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllUsers } from "../GlobalRedux/slice/AuthSlice";

const UsersList = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);
  
  const { users } = useSelector((state: any) => state.auth);
  console.log("users", users);

  return (
    <div>
      <h1>All Users</h1>
      {/* <p>Total Users: {totalUsers}</p>
      <ul>
        {users.map((user: any) => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
      <p>Page {currentPage} of {totalPages}</p> */}
    </div>
  );
};

export default UsersList;
