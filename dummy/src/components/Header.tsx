
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import ProgressRing from './ProgressRing';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { overallProgress } = useProgress();

  return (
    <header className="border-b w-full">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/" className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">Sault Resources</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/progress" className="flex items-center">
                <ProgressRing progress={overallProgress} radius={20} stroke={4} />
              </Link>
              <div className="flex items-center">
                <span className="mr-4">Welcome, {user.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
