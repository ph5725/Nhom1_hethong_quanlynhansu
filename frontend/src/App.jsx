
// import './App.css'

// function App() {

//   return (
//     <>
//       <h1>Hi!!!, Dev</h1>
//     </>
//   )
// }

// export default App

import { Outlet } from 'react-router-dom'
import React from 'react';
import Login from './pages/Login';
import Footer from './components/Footer';
import './index.css';

const App = () => {
  return (
    <>
    {/* <NavItems/> */}
    {/* <Login /> */}
      <div className='min-vh-100'>
        <Outlet />
        <Login />
      </div>
      <Footer />
      </>
  );
};

export default App;