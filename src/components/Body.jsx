import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import { useEffect } from "react";

const Body = () => {
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let userData = useSelector((appStore) => appStore.user);
  let location = useLocation();

  const fetchUser = async () => {
    try {
      if (userData) return;

      let res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        if (location.pathname === "/signup") {
          return navigate("/signup");
        } else {
          navigate("/login");
        }
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
