import React, { useEffect, useState } from 'react';
import './Signup.css'
import { auth, googleProvider, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import Home from './Home';

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccount, setHasAccount] = useState(false);
  const [user, setUser] = useState(null);




  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  }
  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  }


const signUp = async () => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, "users", auth.currentUser.uid); // create user document reference in Firestore
    await setDoc(userRef, { email: auth.currentUser.email });

  } catch (error) {
  }
};


  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      clearInputs();
      clearErrors();
    } catch (error) {
    }
  };


  const signInWithGoogle = async () => {
    try {
     const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, "users", result.user.uid); // create user document reference in Firestore
      await setDoc(userRef, { email: result.user.email }); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  }

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
     {user ? (
        <Home userEmail={user.email} signOutUser={signOutUser} />
     ) : (
        <div className='login'>
      <div className='loginContainer'>
          <h1>BookShelf</h1>
        <label>Email Address</label>
        <input type="email" required placeholder="Enter your Email Address" value={email} onChange={handleEmailChange}/>
        <p className='errorMsg'>{emailError}</p>
        <label>Password</label>
        <input type="password" required placeholder="Enter your Password" value={password} onChange={handlePasswordChange}/>
        <p className='errorMsg'>{passwordError}</p>
        <div className='btnContainer'>
            {
                hasAccount ? (
                <>
                    <button onClick={logIn}> Log in</button>
                    <p>Don't have an account ?
                        <span onClick={()=> setHasAccount(!hasAccount)}>Sign Up</span>
                    </p>
                </>
                ) : (
                <>
                    <button onClick={() => {
                               signUp();
                               
                                }}> Sign Up</button>
                    <p> Have an account ?
                        <span onClick={()=> setHasAccount(!hasAccount)}>Log In </span>
                    </p>
                </>
                )}
        </div>
        <button onClick={signInWithGoogle}> Sign in with Google</button>
      </div>      
    </div>
     )}
    </> 
  )
}

export default SignUp