import React from 'react';
import useAuth from '../components/hook/useAuth';


export default function Index() {
    const {isAuthenticated, logout, user} = useAuth();

  return (
    <div>
        <button
              type="button"
              onClick={logout}
              className="w-full bg-blue-600 text-white rounded-xl py-4 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Sign out
            </button>
    </div>
  )
}
