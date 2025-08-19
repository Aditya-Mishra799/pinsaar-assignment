import React from "react";
import '../App.css'

const Textarea = ({ label, name, register, required, rows = 4, errors, placeholder }) => (
  <div className="form-group">
    <label htmlFor={name} className="form-label">{label}</label>
    <textarea
      id={name}
      name={name}
      rows={rows}
      placeholder={placeholder}
      {...register(name, { required })}
      className={`form-textarea ${errors[name] ? "input-error" : ""}`}
    />
    {errors[name] && <span className="error-message">{label} is required.</span>}
  </div>
);

export default Textarea;
