import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className=" ">
      <Outlet></Outlet>
    </div>
  );
};

export default AuthLayout;