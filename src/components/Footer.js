import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  /*const { pathname } = useLocation();
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }*/

  return (
    <footer className="bg-pink-600 py-8 text-center text-white">
      <div className="w-full flex text-center justify-center">
        Copyright &copy; 2024. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
