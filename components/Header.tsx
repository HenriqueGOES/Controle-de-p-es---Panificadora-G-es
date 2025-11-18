
import React, { useState } from 'react';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

// Novo Logo Premium "GÓES" - Alta qualidade vetorial
const GoesLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 300 180" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      {/* Gradiente para o pão parecer dourado e assado */}
      <linearGradient id="breadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" /> {/* Amber 400 */}
        <stop offset="100%" stopColor="#D97706" /> {/* Amber 600 */}
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15"/>
      </filter>
    </defs>

    <g transform="translate(150, 90)">
      {/* Trigos Cruzados no Fundo */}
      <g stroke="#FCD34D" strokeWidth="3" fill="none" strokeLinecap="round">
        {/* Trigo Esquerdo */}
        <path d="M-40,40 Q-60,0 -30,-50" />
        <g fill="#FCD34D" stroke="none">
           <ellipse cx="-30" cy="-50" rx="4" ry="8" transform="rotate(-15)" />
           <ellipse cx="-35" cy="-35" rx="4" ry="8" transform="rotate(-25)" />
           <ellipse cx="-25" cy="-40" rx="4" ry="8" transform="rotate(-5)" />
           <ellipse cx="-45" cy="-20" rx="4" ry="8" transform="rotate(-35)" />
        </g>
        
        {/* Trigo Direito */}
        <path d="M40,40 Q60,0 30,-50" />
        <g fill="#FCD34D" stroke="none">
           <ellipse cx="30" cy="-50" rx="4" ry="8" transform="rotate(15)" />
           <ellipse cx="35" cy="-35" rx="4" ry="8" transform="rotate(25)" />
           <ellipse cx="25" cy="-40" rx="4" ry="8" transform="rotate(5)" />
           <ellipse cx="45" cy="-20" rx="4" ry="8" transform="rotate(35)" />
        </g>
      </g>

      {/* O Pão Central */}
      <g filter="url(#shadow)">
        {/* Forma principal do pão */}
        <path 
          d="M-55,20 C-55,-30 55,-30 55,20 C55,35 40,45 0,45 C-40,45 -55,35 -55,20 Z" 
          fill="url(#breadGradient)" 
          stroke="#B45309" 
          strokeWidth="2"
        />
        
        {/* Cortes do Pão (Pestana) */}
        <path d="M-30,5 Q-10,-5 10,5" fill="none" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M-15,15 Q5,5 25,15" fill="none" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
        <path d="M0,25 Q20,15 40,25" fill="none" stroke="#FEF3C7" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Faixa decorativa inferior (Opcional, dá acabamento) */}
      <path d="M-60,45 Q0,65 60,45" fill="none" stroke="#1E3A8A" strokeWidth="2" opacity="0.5" />
    </g>

    {/* Texto GÓES */}
    <text 
      x="150" 
      y="155" 
      textAnchor="middle" 
      fontFamily="'Playfair Display', serif" 
      fontWeight="bold" 
      fontSize="42" 
      fill="#1E3A8A" 
      style={{ textShadow: '1px 1px 0px #fff' }}
    >
      GÓES
    </text>
    
    {/* Texto PANIFICADORA */}
    <text 
      x="150" 
      y="172" 
      textAnchor="middle" 
      fontFamily="'Inter', sans-serif" 
      fontWeight="600" 
      fontSize="11" 
      fill="#3B82F6" 
      letterSpacing="4"
    >
      PANIFICADORA
    </text>
  </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItemClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap";
  const mobileNavItemClasses = "block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 border-b border-brand-primary/10 last:border-0";
  
  const activeClasses = "bg-brand-primary text-white shadow";
  const inactiveClasses = "text-brand-primary hover:bg-brand-primary/10";

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-brand-light/80 backdrop-blur-sm sticky top-0 z-20 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28 sm:h-32"> 
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 cursor-pointer py-2" onClick={() => handleNavClick('form')}>
            {/* Logo Premium */}
            <GoesLogo className="h-32 w-auto sm:h-40 sm:w-auto drop-shadow-md hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={() => handleNavClick('form')}
              className={`${navItemClasses} ${currentView === 'form' ? activeClasses : inactiveClasses}`}
            >
              Novo Pedido
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`${navItemClasses} ${currentView === 'dashboard' ? activeClasses : inactiveClasses}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick('financial')}
              className={`${navItemClasses} ${currentView === 'financial' ? activeClasses : inactiveClasses}`}
            >
              Financeiro
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-brand-primary hover:bg-brand-primary/10 focus:outline-none"
              aria-label="Abrir menu"
            >
              {isMenuOpen ? (
                <XIcon className="h-8 w-8" />
              ) : (
                <MenuIcon className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-light border-t border-brand-primary/10 shadow-lg absolute w-full z-20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => handleNavClick('form')}
              className={`${mobileNavItemClasses} ${currentView === 'form' ? activeClasses : inactiveClasses}`}
            >
              Novo Pedido
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`${mobileNavItemClasses} ${currentView === 'dashboard' ? activeClasses : inactiveClasses}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavClick('financial')}
              className={`${mobileNavItemClasses} ${currentView === 'financial' ? activeClasses : inactiveClasses}`}
            >
              Financeiro
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
