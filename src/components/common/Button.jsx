import React from 'react';

/**
 * Reusable Button component
 * @param {string} variant - 'primary' or 'secondary'
 * @param {function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} children - Button content
 */
const Button = ({ 
  variant = 'primary', 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button',
  children 
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;