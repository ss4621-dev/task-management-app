
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/Auth/LoginForm';
import RegisterForm from '@/components/Auth/RegisterForm';

const Auth: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div className="sm:w-1/2 bg-sidebar-background hidden sm:flex items-center justify-center p-8">
        <div className="max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-xl font-semibold">
              T
            </div>
            <h1 className="text-3xl font-bold text-black">TaskFlow</h1>
          </div>
          <h2 className="text-2xl font-bold text-white">Streamlined Task Management</h2>
          <ul className="space-y-4">
            <li className="flex gap-3 text-black">
              <svg className="h-6 w-6 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Effortlessly create and assign tasks</span>
            </li>
            <li className="flex gap-3 text-black">
              <svg className="h-6 w-6 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Track progress with real-time updates</span>
            </li>
            <li className="flex gap-3 text-black">
              <svg className="h-6 w-6 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Collaborate with your team seamlessly</span>
            </li>
            <li className="flex gap-3 text-black">
              <svg className="h-6 w-6 flex-shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Stay organized with powerful filtering</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="sm:hidden mb-8 flex items-center gap-3 justify-center">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-xl font-semibold">
              T
            </div>
            <h1 className="text-3xl font-bold text-black">TaskFlow</h1>
          </div>
          {showLogin ? (
            <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
