import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col h-screen w-full justify-center items-center bgBlueGradient space-y-5">
      <h1 className="text-4xl font-semibold text-gray-200">صفحه اصلی</h1>
      <Link
        className="text-xl bg-green-500 hover:bg-green-600 p-4 w-80 rounded-md shadow-sm text-center text-white"
        to="/editor"
      >
        ویرایش مطالب
      </Link>
      <Link
        className="text-xl bg-rose-600 hover:bg-rose-700 p-4 w-80 rounded-md shadow-sm text-center text-white"
        to="/admin"
      >
        پنل مدیریت
      </Link>
      <Link
        className="text-xl bg-violet-500 hover:bg-violet-600 p-4 w-80 rounded-md shadow-sm text-center text-white"
        to="/users"
      >
        نمایش کاربران
      </Link>
      <Link
        className="text-xl bg-orange-500 hover:bg-orange-600 p-4 w-80 rounded-md shadow-sm text-center text-white"
        to="/login"
      >
        صفحه ورود
      </Link>
      <Link
        className="text-xl bg-red-500 hover:bg-red-600 p-4 w-80 rounded-md shadow-sm text-center text-white"
        to="/register"
      >
        صفحه عضویت در سایت
      </Link>
    </div>
  );
};

export default Home;
