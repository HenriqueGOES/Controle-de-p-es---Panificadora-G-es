
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/70 rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
};
