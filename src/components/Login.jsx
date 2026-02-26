import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("dikshant@gmail.com");
  const [password, setPassword] = useState("Dikshant@123");
  const [error, setError] = useState("");

  let navigate = useNavigate();
  let dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          email: emailId,
          password,
        },
        { withCredentials: true },
      );
      console.log(res);
      if (res.status === 200) {
        dispatch(addUser(res.data.user));
        return navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message);
      console.error(err?.response);
    }
  };

  return (
    <>
      <div className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col gap-4 m-auto my-40 form bg-base-200 border-base-300 rounded-box w-xs border p-4"
        >
          <p className="form-legend">Login</p>

          <div className="input-box">
            <label className="label mb-3">Email</label>
            <input
              value={emailId}
              type="email"
              className="input outline-none"
              placeholder="Email"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div className="input-box">
            <label className="label mb-3">Password</label>
            <input
              value={password}
              type="password"
              className="input outline-none"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <p className="text-red-500 w-full text-center">{error}</p>

          <button className="btn btn-neutral mt-4" onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
