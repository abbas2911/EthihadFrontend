import React from 'react';

const Header = ({ title }) => {
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userID');
    window.location.href = '/login';
  };

  return (
    <header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
      <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>
        <button
          onClick={logout}
          className='bg-purple-700 text-purple-100 px-4 py-2 rounded hover:bg-purple-400 uppercase'
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;