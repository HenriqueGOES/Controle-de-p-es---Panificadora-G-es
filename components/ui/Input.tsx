
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-brand-primary mb-1">
        {label}
      </label>
      <input
        id={id}
        className="block w-full px-4 py-2 bg-white/50 border border-brand-primary/30 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm transition-colors"
        {...props}
      />
    </div>
  );
};
