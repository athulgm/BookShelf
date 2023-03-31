import React from 'react'
import Background from './Background';
import Dashboard from './Dashboard';
import './Home.css'
import Navbar from './Navbar';

function Home({ userEmail, signOutUser }) {
  return (
    <>
      <Navbar userEmail={userEmail}/>
      <Background />
      <Dashboard userEmail={userEmail} />
    </>
  )
}

export default Home
