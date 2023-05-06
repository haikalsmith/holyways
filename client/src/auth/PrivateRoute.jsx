import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext"

export function PrivateRouteLogin() {
  const [state] = useContext(UserContext);
  
  if (!state.isLogin) {
    return (
        <Navigate to="/"/>
      )
  }
  return <Outlet />
}
