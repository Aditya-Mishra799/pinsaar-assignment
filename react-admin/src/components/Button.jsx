import React from "react";
import '../App.css'

const Button = ({ type = "button", onClick, children, disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="btn"
    >
      {children}
    </button>
  );
};

export default Button;
