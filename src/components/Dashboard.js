import { collection, doc, getDocs, query, setDoc, where, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import './Dashboard.css';
import axios from 'axios';
import { db, auth } from '../config/firebase';

function Dashboard({userEmail}) {
  const [books, setBooks] = useState([]);
  
  useEffect (() => {
    const fetchBooks = async () => {
      const res = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=mUpf1IRL3AkUJENKvIUQtmRAzjiM4aeP`)
      setBooks(res.data.results.books);
    }
    fetchBooks();
  },[]);

const handleAddToWishlist = async (book) => {
    const { author, book_image, buy_links, description, publisher, primary_isbn10, rank, title } = book;

    try {
      const userRef = doc(collection(db, 'users'), auth.currentUser.uid);
      const booksCollectionRef = collection(userRef, 'books');
      
      const querySnapshot = await getDocs(query(booksCollectionRef, where('title', '==', title)));

      if (querySnapshot.empty) {
        const bookRef = doc(booksCollectionRef);

        await setDoc(bookRef, {
          author,
          book_image,
          buy_links,
          description,
          publisher,
          primary_isbn10,
          rank,
          title,
          userEmail
        });
        
        console.log('Added to wishlist');
      } else {
        console.log('Book already exists in wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
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
        userEmail: auth.currentUser.email
      },
    });
  } catch (error) {
    console.error('Error adding to currently reading:', error);
  }
};


  
  return (
    <>
    <h1 className='headline'>Books List</h1>
    <section>
      {books.map((book) => {
        const {author, book_image, buy_links, description, publisher, primary_isbn10, rank, title } = book;

        return (
          <article key={rank}>
            <div className='book_img'>
              <img src={book_image} alt={title} />
            </div>
            <div className='table_info'>
              <h3 className='title'>{title}</h3>
              <p className='description'><b>Description:</b> {description}</p>
              <p className='author'><b>Author:</b> {author}</p>
              <p className='publisher' ><b>Publisher:</b> {publisher}</p>
              <p className='ISBN' ><b>ISBN:</b> {primary_isbn10}</p>
              <ul >
                <p><b>Buy Now:-</b></p>
                {buy_links.map((link) => {
                  const {name, url} = link;
                  return (
                    <div className='buylink' key={name}>
                      <a href={url}>{name}</a>
                    </div>
                  );
                })}
              </ul>
                <div className='button'>  
              <button className='crud_btn' onClick={() => handleAddToWishlist(book)}>
                Add to Wishlist
              </button>
              <button className='crud_btn' onClick={() => handleReadNow(book)}>Read Now</button>
                </div>
            </div>
          </article>
        );
      })}
    </section>
    </>
  );
}

export default Dashboard;
