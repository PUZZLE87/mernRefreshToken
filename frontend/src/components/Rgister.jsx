import React, { useEffect, useRef, useState } from "react";
import registerImg from "../img/register.jpg";
import successImg from "../img/success.png";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";

const Rgister = () => {
  const usernameRef = useRef();

  const [username, setUsername] = useState("");
  const [isValidUn, setIsValidUn] = useState(false);
  const [unFocus, setUnFocus] = useState(false);

  const [pwd, setPwd] = useState();
  const [isValidPwd, setIsValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [isValidMatchPwd, setIsValidMatchPwd] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    usernameRef?.current?.focus();
  }, []);

  useEffect(() => {
    setIsValidUn(USERNAME_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setIsValidPwd(PWD_REGEX.test(pwd));
    setIsValidMatchPwd(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [username, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const unValidation = USERNAME_REGEX.test(username);
    const pwdValidation = PWD_REGEX.test(pwd);
    if (!unValidation || !pwdValidation) {
      setErrMsg("اطاعات فرم را تکمیل کنید");
    }
    try {
      await axios.post(
        REGISTER_URL,
        JSON.stringify({ username, password: pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setSuccess(true);
      setUsername("");
      setPwd("");
      setMatchPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("پیامی از سمت سرور دریافت نشد");
      } else if (err.response?.status === 409) {
        setErrMsg("نام کاربری قبلا رزرو شده است");
      } else {
        setErrMsg("خطایی در هنگام ثبت نام رخ داد");
      }
    }
  };

  return (
    <>
      {success ? (
        <section className="h-screen w-full flex justify-center items-center bgBlueGradient">
          <div className="flex flex-col m-4 justify-center space-y-6 items-center bg-white shadow-sm rounded-md overflow-hidden px-4 pb-14">
            <img className="h-72 object-contain" src={successImg} alt="" />
            <h1 className="text-[#4AACF3] text-lg sm:text-2xl font-black p-3">
              حساب کاربری با موفقیت ایجاد شد
            </h1>
            <Link
              className="bg-yellow-200 w-52 rounded-md text-gray-800 text-lg font-semibold text-center hover:bg-yellow-300 transition-all p-3 inline-block"
              to="/login"
            >
              ورود به سایت
            </Link>
          </div>
        </section>
      ) : (
        <section>
          <div className="h-screen w-full flex justify-center items-center bgBlueGradient ">
            <div className="m-3 md:m-0 flex flex-col p-4 bg-white justify-start items-center w-[400px] rounded-md shadow-md overflow-hidden">
              <p className="text-center text-3xl pt-3 font-black text-cyan-300">
                ثــبـــت نــــام
              </p>
              <div className="flex items-center justify-center">
                <div className="w-52 h-52 inline-block">
                  <img src={registerImg} alt="" />
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
                <div className="w-full">
                  <input
                    required
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    className="textInput"
                    placeholder="تکرار پسورد"
                    type="password"
                  />
                  <p
                    className={`errMsg ${
                      !isValidMatchPwd && matchPwd ? "visible" : "hidden"
                    }`}
                  >
                    پسورد یکسان نیست
                  </p>
                </div>
                <button
                  disabled={
                    !isValidUn || !isValidPwd || !isValidMatchPwd ? true : false
                  }
                  className="cyanBtn disabled:bg-cyan-200"
                >
                  ثــبـــت نــــام
                </button>
              </form>
              <div className="flex justify-center items-center">
                <span className="text-gray-500">قبلا ثبت نام کردید؟</span>
                <Link
                  className="mr-2 text-cyan-400 font-semibold hover:text-cyan-500"
                  to="/login"
                >
                  ورود
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Rgister;
