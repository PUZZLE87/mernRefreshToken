import React, { useEffect, useRef, useState } from "react";
import loginImg from "../img/login.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "./../hooks/useAuth";

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const usernameRef = useRef();

  const [username, setUsername] = useState("");
  const [isValidUn, setIsValidUn] = useState(false);
  const [unFocus, setUnFocus] = useState(false);

  const [pwd, setPwd] = useState();
  const [isValidPwd, setIsValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    usernameRef?.current?.focus();
  }, []);

  useEffect(() => {
    setIsValidUn(USERNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setIsValidPwd(PWD_REGEX.test(pwd));
  }, [pwd]);

  useEffect(() => {
    setErrMsg("");
  }, [username, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ username, roles, accessToken });
      setUsername("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("پیامی از سمت سرور دریافت نشد");
      } else if (err.response?.status === 400) {
        setErrMsg("نام کاربری و رمز عبور نمی تواند خالی باشد");
      } else if (err.response?.status === 401) {
        setErrMsg("نام کاربری و رمز عبور صحیح نمی باشد");
      } else {
        setErrMsg("خطایی در هنگام ورود رخ داد");
      }
    }
  };

  return (
    <section>
      <div className="h-screen w-full flex justify-center items-center bgBlueGradient ">
        <div className="m-3 md:m-0 flex flex-col p-4 bg-white justify-start items-center w-[400px] rounded-md shadow-md overflow-hidden">
          <p className="text-center text-3xl pt-3 font-black text-cyan-300">
            ورود به سایت
          </p>
          <div className="flex items-center justify-center">
            <div className="w-52 h-52 inline-block">
              <img src={loginImg} alt="" />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6 justify-center items-center w-full p-4 my-3"
          >
            {errMsg && (
              <p className="mt-4 bg-red-200 p-2 text-center w-full rounded-md text-red-700">
                خطای سرور
              </p>
            )}
            <div className="w-full">
              <input
                ref={usernameRef}
                required
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setUnFocus(true)}
                onBlur={() => setUnFocus(false)}
                className="textInput"
                placeholder="نام کاربری "
                type="text"
              />
              <p
                className={`errMsg ${
                  !isValidUn && unFocus && username ? "visible" : "hidden"
                }`}
              >
                نام کاربری باید بیشتر از 3 کاراکتر و انگلیسی باشد
              </p>
            </div>
            <div className="w-full">
              <input
                required
                onChange={(e) => setPwd(e.target.value)}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                className="textInput"
                placeholder="پسورد"
                type="password"
              />
              <p
                className={`errMsg ${
                  !isValidPwd && pwd && pwdFocus ? "visible" : "hidden"
                }`}
              >
                پسورد بیشتر از 8 کاراکتر و شامل یکی از علائم %$#@! باشد
              </p>
            </div>

            <button
              disabled={!isValidUn || !isValidPwd ? true : false}
              className="cyanBtn disabled:bg-cyan-200"
            >
              ورود به حساب کاربری
            </button>
          </form>
          <div className="flex justify-center items-center">
            <span className="text-gray-500">حساب کاربری ندارید؟ </span>
            <Link
              className="mr-2 text-cyan-400 font-semibold hover:text-cyan-500"
              to="/register"
            >
              ثبت نام
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
