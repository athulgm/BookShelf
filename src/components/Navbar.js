import React from 'react'
import {  Link, useNavigate } from "react-router-dom";
import Avatar from '../asset/user.png'
import { auth } from '../config/firebase';

function Navbar({ userEmail }) {
  const navigate = useNavigate();
  
    const handleSignOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <>
    <div className="home">
      <div className="homebuttons">
        <div className='links'>
              <p><Link to="/" ><p className='linkp'>Home</p></Link></p>   
          </div>
          <div className='links'>
              <p><Link to="/main" ><p className='linkp'>Currently Reading</p></Link></p>   
          </div>
          <div className='links'>
              <p><Link to="/mylist" ><p className='linkp'>My WishList</p></Link></p>   
          </div>
          <div className='avatar-button'>
            <Link to="/profile" ><img className='avatar' src={Avatar} alt={userEmail}></img></Link>
          </div>
              <button className='homebtn' onClick={handleSignOut}>Log Out</button>
      </div>
      </div>
      </>
  )
}

export default Navbar