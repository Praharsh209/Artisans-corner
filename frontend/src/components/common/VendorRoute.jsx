import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VendorRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  const isVendor = userInfo.role === 'vendor' || userInfo.role === 'both';

  return isVendor ? <Outlet /> : <Navigate to="/profile" replace />;
};

export default VendorRoute;
