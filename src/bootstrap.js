import React, { useState, useEffect, Suspense, Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate, Redirect } from 'react-router-dom';
import LoadingIcon from './components/Loading/loading';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //   <React.StrictMode>
    <Router>
      <Suspense fallback={<div className="loadingIcon"><LoadingIcon /></div>}>
        <Routes>
          <Route path="/development" element={<App route={"Development"} />} />
          <Route path="/production" element={<App route={"Production"} />} />
          <Route path="*" element={<Navigate to="/development" replace={true} />} />
        </Routes>
      </Suspense>
    </Router>

  //   </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
