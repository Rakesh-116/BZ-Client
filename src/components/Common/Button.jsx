import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <button className={`rounded-lg px-4 py-2 ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
