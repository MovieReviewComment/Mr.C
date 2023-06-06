import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import React, { Fragment } from 'react';

function App() {
  return (
    <Fragment>
      <Header />
      <Outlet />
    </Fragment>
  );
}

export default App;
