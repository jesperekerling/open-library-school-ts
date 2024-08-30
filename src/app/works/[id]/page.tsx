'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Book {
  identifiers: {
    goodreads: string[];
    librarything: string[];
  };
  title: string;
  authors: { key: string }[];
  publish_date: string;
  publishers: string[];
  covers: number[];
  contributions: string[];
  languages: { key: string }[];
  source_records: string[];
  local_id: string[];
  type: { key: string };
  first_sentence: { type: string; value: string };
  key: string;
  number_of_pages: number;
  works: { key: string }[];
  classifications: object;
  ocaid: string;
  isbn_10: string[];
  isbn_13: string[];
  latest_revision: number;
  revision: number;
  created: { type: string; value: string };
  last_modified: { type: string; value: string };
}

interface Work {
  description: { type: string; value: string };
  subjects: string[];
}

const BookPage: React.FC = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [work, setWork] = useState<Work | null>(null);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (id) {
      fetch(`https://openlibrary.org/books/${id}.json`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch book data');
          }
          return res.json();
        })
        .then((data) => {
          setBook(data);
          const workId = data.works[0].key.split('/').pop();
          return fetch(`https://openlibrary.org/works/${workId}.json`);
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch work data');
          }
          return res.json();
        })
        .then((data) => {
          setWork(data);
          setError(null);
        })
        .catch((err) => {
          setError('The API request failed. Probably since this API have made too many calls to the API. ' + err.message);
          setBook(null);
          setWork(null);
        }); 
    }
  }, [id]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!book || !work) {
    return <div>Loading...</div>;
  }


  return (
    <div className='container mx-auto max-w-[800px]'>
      <div className='flex gap-20 my-4'>
        <div className='pr-6'>
          {book.covers.length > 0 && (
            <Image
              src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
              alt={book.title}
              width={200}
              height={300}
              priority
              style={{ width: 'auto', height: 'auto' }}
            />
          )}
        </div>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold'>{book.title}</h1>
          <p>Authors: {book.authors.map((author) => author.key).join(', ')}</p>
          <p className='py-3'>Book Description<br /> {typeof work.description === 'string' ? work.description : work.description.value}</p>
          <p>Published: {book.publish_date}</p>
          <p>Publishers: {book.publishers.join(', ')}</p>
          <p>Contributions: {book.contributions.join(', ')}</p>
          <p>Languages: {book.languages.map((lang) => lang.key).join(', ')}</p>
          <p>Number of Pages: {book.number_of_pages}</p>
          <p>First Sentence: {book.first_sentence.value}</p>
          <p>ISBN-10: {book.isbn_10.join(', ')}</p>
          <p>ISBN-13: {book.isbn_13.join(', ')}</p>
          <p className='py-3'>Subjects:<br />{work.subjects.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default BookPage;