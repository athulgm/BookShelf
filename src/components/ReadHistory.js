import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import './Readhistory.css';

function ReadHistory() {
  const [finishedBooks, setFinishedBooks] = useState([]);

  useEffect(() => {
    const fetchFinishedBooks = async () => {
      const q = query(collection(db, 'finished_reading'), where("user_id", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const books = [];

      querySnapshot.forEach((doc) => {
        const { title, author, publisher, book_image, progress, comment, description, userEmail, finished_date } = doc.data();
        books.push({ id: doc.id, title, author, publisher, book_image, progress, comment, description, userEmail, finished_date });
      });
      setFinishedBooks(books);
    };

    fetchFinishedBooks();
  }, []);

const handleEditComment = (id) => {
  const bookToUpdate = finishedBooks.find((book) => book.id === id);
  const updatedComment = prompt('Enter new comment', bookToUpdate.comment);

  if (updatedComment !== null) {
    const docRef = doc(db, 'finished_reading', id);
    updateDoc(docRef, { comment: updatedComment })
      .then(() => {
 
        const updatedBooks = finishedBooks.map((book) => {
          if (book.id === id) {
            return { ...book, comment: updatedComment };
          }
          return book;
        });
        setFinishedBooks(updatedBooks);
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
      });
  }
};


const handleDeleteBook = async (id) => {
  const confirmation = window.confirm('Are you sure you want to delete this book?');
  
  if (confirmation) {
    try {
      // delete the book from Firebase
      const docRef = doc(db, 'finished_reading', id);
      await deleteDoc(docRef);

      // update the local state to remove the deleted book
      const updatedBooks = finishedBooks.filter((book) => book.id !== id);
      setFinishedBooks(updatedBooks);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  }
};


  return (
    <>
      <h2 className='heading'>Finished Books List</h2>
    <div className='rh-container'>
      <ul className='rh-list'>
        {finishedBooks.map((book) => (
          <p className='rh-items' key={book.id}>
            <div className='book_img'>
                <img src={book.book_image} alt={book.title}/>
            </div>
            <div className='rh-table_info'>
            <h3 className='title'>{book.title}</h3>
            <p className='description'>{book.description}</p>
            <p><b>Author:</b> {book.author}</p>
            <p><b>Publisher:</b> {book.publisher}</p>
            <p><b>Progress:</b> {book.progress || '0'}%</p>
            {book.comment && <p><b>Comment:</b> {book.comment}</p>}
            <p>@<i>{book.userEmail}</i> finished reading on {new Date(book.finished_date).toLocaleString()}</p>

               <div className='rh-actions'>
    <button className='crud_btn' onClick={() => handleEditComment(book.id)}>Edit</button>
    <button className='crud_btn' onClick={() => handleDeleteBook(book.id)}>Delete</button>
  </div>

            </div>
          </p>
        ))}
      </ul>
    </div>
    </>
  );
}

export default ReadHistory;
