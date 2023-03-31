import React, { useEffect, useState } from 'react';
import { getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../asset/user.png';
import './Profile.css';

function Profile({ userEmail }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [updatedName, setUpdatedName] = useState("");
    const navigate = useNavigate();

useEffect(() => {
  const fetchUserDetails = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const { email, name } = userDoc.data();
      setEmail(email);
      setName(name);
    } else if (isGoogleUser) {
      const { displayName, email } = auth.currentUser;
      await setDoc(userRef, { name: displayName, email: email });
      setName(displayName);
      setEmail(email);
    }
  };
  fetchUserDetails();
}, []);



const handleNameUpdate = async () => {
  const userRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(userRef, { name: updatedName });
  setName(updatedName);
  setUpdatedName("");
};


  const isGoogleUser = auth.currentUser.providerData.some((provider) => provider.providerId === 'google.com');

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
      </div>
    </div>
    <div className='Profile-details'>
      <h1>Profile Details</h1>
      {isGoogleUser ? (
        <p>Name: {auth.currentUser.displayName}</p>
      ) : (
        <p>Name: {name}</p>
      )}
      <p>Email: {email}</p>
      {name === "" && !isGoogleUser && (
        <div>
          <label>Update Name</label><input type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
          <button className='update_btn' onClick={handleNameUpdate}>Update Name</button>
        </div>
      )}
    </div>
    <button className='signout-btn' onClick={handleSignOut}>Sign Out</button>
  </>
);

}

export default Profile;
