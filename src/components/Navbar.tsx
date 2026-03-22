import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Bookmark, Search, PlusCircle, Moon, Sun, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Search', path: '/', icon: Search },
    ...(isAuthenticated ? [{ label: 'Bookmarks', path: '/bookmarks', icon: Bookmark }] : []),
    ...(isAdmin ? [{ label: 'Admin', path: '/admin', icon: PlusCircle }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                Σ
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">FormulaHub</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-indigo-600 ${
                  location.pathname === item.path ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <UserIcon size={18} className="text-slate-400" />
                  <span className="text-sm font-medium">{user?.email.split('@')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t py-4 px-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          {!isAuthenticated ? (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-2 rounded-lg bg-indigo-600 text-white"
            >
              <UserIcon size={20} />
              <span className="font-medium">Login</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 p-2 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
