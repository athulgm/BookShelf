import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebase';
import {  Link } from "react-router-dom";
import './Mylist.css';
import Background from './Background';
import Navbar from './Navbar';

function Mylist( { userEmail }) {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);


useEffect(() => {
  const getUsers = async () => {
    if (auth.currentUser) {
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('email', '==', auth.currentUser.email));
      const data = await getDocs(q);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }
  };

  getUsers();
}, []);


  useEffect(() => {
    const getBooks = async () => {
    const userRef = users.find((user) => user.email === auth.currentUser.email);
  if (userRef) {
    const booksCollectionRef = collection(db, 'users', userRef.id, 'books');
    const data = await getDocs(booksCollectionRef);
    setBooks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    };
    getBooks();
  }, [users]);

const handleDelete = async (bookId) => {
try {
const userRef = users.find((user) => user.email === auth.currentUser.email);
const bookRef = doc(db, 'users', userRef.id, 'books', bookId);
await deleteDoc(bookRef);
setBooks(books.filter((book) => book.id !== bookId));
} catch (error) {
console.log(error);
}
};


const handleReadNow = async (book) => {
    const { author, book_image, buy_links, description, publisher, primary_isbn10, rank, title } = book;


  try {
    const userRef = doc(collection(db, 'users'), auth.currentUser.uid);
  await updateDoc(userRef, {
      currently_reading: {
        author,
        book_image,
        buy_links,
        description,
        publisher,
        primary_isbn10,
        rank,
        title,
        user_id: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
      },
    });
  } catch (error) {
    console.error('Error adding to currently reading:', error);
  }
};

 return (
  <>
  <Navbar />
  <Background />
  <div className='container'>
  <div className='navbar'>
  <h4 className='heading'>My WishList</h4>
  </div>
  {books.length > 0 ? (
    <section className='books'>
      {books.map((book) => {
        return (
          <div className='mainContainer' key={book.id}>
            <div className='table_info'>
            <div className='book_img'>
            <img src={book.book_image} alt={book.title} />
            </div>
              <h3 className='title'>{book.title}</h3>
              <p><b>Description:</b> {book.description}</p>
              <p><b>Author:</b> {book.author}</p>
              <p><b>Publisher:</b> {book.publisher}</p>
              <p><b>ISBN:</b> {book.primary_isbn10}</p>
              <ul className='List'>
                <p><b>Buy Now:-</b></p>
                {book.buy_links.map((link) => {
                  const {name, url} = link;
                  return (
                    <div className='links' key={name}>
                      <a href={url}>{name}</a><br></br>
                    </div>
                  );
                })}
              </ul>
              <div className='button'>
                <button className='crud_btn' onClick={() => handleDelete(book.id)}>Delete</button>
                <button className='crud_btn' onClick={() => handleReadNow(book)}>Read Now</button>
                </div>
            </div>
          </div>
        );
      })}
    </section>
  ) : (
    <p>You don't have any wish list, please add a book to the list. <Link to="/" >Click here</Link> to go to home</p>
  )}
  </div>
  </>
);
}

export default Mylist;
