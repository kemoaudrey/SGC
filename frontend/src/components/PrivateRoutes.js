import React from "react";
import {Navigate} from "react-router-dom";
const PrivateRoute = ({element , allowedRoles}) => {
  const userRole = localStorage.getItem('userRole');
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to='/'/>;
  }
  return element;
}
export default PrivateRoute;