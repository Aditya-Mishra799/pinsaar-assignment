import React from "react";
import '../App.css'

const Input = ({ label, name, register, required, type = "text", errors, placeholder }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      {...register(name, { required })}
      className={`form-input ${errors[name] ? "input-error" : ""}`}
    />
    {errors[name] && <span className="error-message">{label} is required.</span>}
  </div>
);

export default Input;
