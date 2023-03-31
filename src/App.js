import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from './components/Signup';
import Home from './components/Home';
import Mylist from './components/Mylist';
import CurrentRead from './components/CurrentRead';
import MainPage from './components/MainPage';
import Profile from './components/Profile';


function App() {
  return (
    <BrowserRouter>
    <Routes>
          <Route exact path="/" element={<SignUp />}/>
          <Route exact path="/main" element={<MainPage />}/>              
          <Route exact path="/home" element={<Home />}/>              
          <Route exact path="/mylist" element={<Mylist />}/>       
          <Route exact path="/profile" element={<Profile />}/>       
          <Route exact path="/currentread" element={<CurrentRead />}/>       
    </Routes>
    </BrowserRouter>

  );
}

export default App;
