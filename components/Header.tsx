
import React, { useState } from 'react';
import type { View } from '../types';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const BreadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.23,8.23l-3-3a1.5,1.5,0,0,0-2.12,0l-1,1a1.5,1.5,0,0,0,0,2.12l1,1a1.5,1.5,0,0,0,2.12,0l3-3A1.5,1.5,0,0,0,21.23,8.23ZM14.59,8.41,3.23,19.77a2.5,2.5,0,0,0,0,3.54,2.5,2.5,0,0,0,3.54,0L18.13,11.95a1.5,1.5,0,0,0,0-2.12l-1.42-1.42A1.5,1.5,0,0,0,14.59,8.41Z" />
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
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <BreadIcon className="h-8 w-8 sm:h-10 sm:w-10 text-brand-primary" />
            <h1 className="ml-2 sm:ml-3 text-2xl sm:text-3xl font-bold font-serif text-brand-dark truncate">
              Panificadora Góes
            </h1>
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
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
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
