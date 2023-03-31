import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import React, { useEffect, useState } from 'react';
import './currentread.css';
import { Link } from 'react-router-dom';
import Background from './Background';
import Navbar from './Navbar';

function CurrentRead({ userEmail }) {
  const [currentBook, setCurrentBook] = useState("");
   const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState("");
  const [finishedBook, setFinishedBook] = useState(null);
const [comment, setComment] = useState("");



useEffect(() => {
  const fetchCurrentReading = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const { currently_reading } = userDoc.data();
      setCurrentBook(currently_reading);  
    }
  };

  fetchCurrentReading();
}, []);

  const handleUpdateProgress = async () => {
    setShowPopup(true);
  };


  const handleSaveProgress = async () => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      currently_reading: {
        ...currentBook,
        progress: progress,
        comment: comment
      }
    });
    setShowPopup(false);
    setCurrentBook({ ...currentBook, progress: progress,comment: comment  }); 
  };



const handleFinish = async () => {
  const userRef = doc(db, 'users', auth.currentUser.uid);
  await updateDoc(userRef, {
    currently_reading: {
      ...currentBook,
      progress: 100
    }
  });
  const now = new Date();
  setFinishedBook({
    ...currentBook,
    finished_date: now.toString()
  });
  setCurrentBook(null);
};



  useEffect(() => {
    const addFinishedBook = async () => {
      if (finishedBook) {
        const finishedRef = collection(db, 'finished_reading');
        await addDoc(finishedRef, finishedBook);
      }
    };

    addFinishedBook();
  }, [finishedBook]);



return (
  <>
 <Navbar />
  <div className='container'>
    <h4 className='heading'>My Currently Reading</h4>
    {currentBook && (
      <div className='mainContainers'>
        <div className='table_infos'>
          <div className='table_imgs'>
          <img src={currentBook.book_image} alt={currentBook.title} />
          </div>
          <div className='table_contents'>
          <h3 className='title'>{currentBook.title}</h3>
          <p><b>Description:</b> {currentBook.description}</p>
          <p><b>Author:</b> {currentBook.author}</p>
          <p><b>Publisher:</b> {currentBook.publisher}</p>
          <p><b>Progress:</b> {currentBook.progress || '0'}%</p>
          <progress value={currentBook.progress} max="100"></progress>
          {currentBook.comment && <p><b>Comment:</b> {currentBook.comment}</p>}
          <div className='button'>
            <button className='crud_btn' onClick={handleUpdateProgress}>Update Progress</button>
            <button className='crud_btn' onClick={handleFinish}>Finished Reading</button>
          </div>
          <p className='user_ids'><i>@{currentBook.userEmail}</i> is reading the book now.</p>
          </div>
        </div>
      </div>
    )}
    {!currentBook && <p>You don't have any currently reading book, please add a book to read. <Link to="/" >Click here</Link> to go to home</p>}
    {showPopup && (
      <div className='popup'>
        <div className='popup_inner'>
          <h2>Update Progress</h2>
          <div className='progress-bar'>
            <input
              type='range'
              min='0'
              max='100'
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className='slider'
            />
            <div className='slider-value'>{progress}%</div>
          </div>
          <div className='comment'>
            <label>Comment:</label>
            <input
              type='text'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className='button'>
            <button className='crud_btn' onClick={handleSaveProgress}>Save</button>
            <button className='crud_btn' onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
        <p><i>@{currentBook.userEmail}</i> is updating the progress</p>
      </div>
    )}
  </div>
  <Background />
   </>
);


}

export default CurrentRead;
