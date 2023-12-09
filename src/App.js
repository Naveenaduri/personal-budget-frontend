import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import logo from './logo.svg';
import "./fonts/icomoon/style.css";
import "./css/bootstrap.min.css";
import "./css/magnific-popup.css";
import "./css/jquery-ui.css";
import "./css/owl.carousel.min.css";
import "./css/owl.theme.default.min.css";
import "./css/bootstrap-datepicker.css";
import "./css/animate.css";
import "./fonts/flaticon/font/flaticon.css";
import "./css/aos.css";
import "./css/style.css";

import Signup from './signup/signup';
import HomePage from './homePage/homePage';
import Login from './login/login';
import Budget from './budget/budget';
import AddExpenses from './expenses/addExpense';
import VisualizeExpenses from './visualizeExpenses/visualizeExpenses';
import ViewExpenses from './viewExpenses/viewExpenses';
import LoginHomePage from './homePage/loginHomePage';
function App() {
  return (
    <Router>
      <div className="site-wrap">  
        <Routes>
          <Route path="/loginhomepage" element={<LoginHomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/expenses" element={<AddExpenses />} />
          <Route path="/viewexpenses" element={<ViewExpenses />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/expensevisualization" element={<VisualizeExpenses />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;
