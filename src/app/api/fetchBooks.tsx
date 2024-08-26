'use client'
import { useState } from 'react';
import Image from 'next/image'; // Ensure you import Image from next/image


const SearchBookForm = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className='text-center'>
      <input type="text" value={query} onChange={handleInputChange} placeholder="Search for books" className='p-3 dark:text-black font-semibold' autoFocus />
      <button type="submit" className='px-5 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 hover:text-white dark:hover:text-black font-semibold'>Search</button>
    </form>
  );
};

const FetchBooks = ({ books }: Props) => {
  const [searchResults, setSearchResults] = useState<Book[]>(books);
  const [loading, setLoading] = useState(false);
  const [sortMethod, setSortMethod] = useState<'year' | 'title'>('year'); // State for sorting method

  const handleSearch = async (query: string) => {
    setLoading(true);
    const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    const data = await res.json();
    const books: Book[] = data.docs.map((doc: any) => ({
      title: doc.title,
      author_name: doc.author_name || [],
      first_publish_year: doc.first_publish_year || 'N/A',
      author_key: doc.author_key || [], // Extract author_key
      cover_i: doc.cover_i,
    }));
    setSearchResults(books);
    setLoading(false);
  };

  const handleSortChange = (method: 'year' | 'title') => {
    setSortMethod(method);
  };

  const sortedResults = [...searchResults].sort((a, b) => {
    if (sortMethod === 'year') {
      return (a.first_publish_year || 0) - (b.first_publish_year || 0);
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  return (
    <div>
      <SearchBookForm onSearch={handleSearch} />
      <div>
        Sort: 
        <button className='p-3' onClick={() => handleSortChange('year')}>Sort by Year</button>
        <button onClick={() => handleSortChange('title')}>Sort by Title</button>
      </div>
      {loading ? (
        <div className="loading-icon">Loading...</div>
      ) : (
        <ul className='bg-white dark:bg-black'>
          {sortedResults.map((book, index) => (
            <li key={index} className='p-4 flex'>
                
              <div className='mr-5'>
                <Image 
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} 
                  alt={book.title} 
                  width={100} 
                  height={166} 
                  onError={(e) => (e.currentTarget.src = '/path/to/placeholder.jpg')} // Optional: handle missing images
                />
              </div>
              <div className='flex-1'>
              <h2 className='font-semibold text-xl pb-3'>{book.title}</h2>
              <p className='flex'>{book.author_key && book.author_key.length > 0 && (
                <Image 
                  src={`https://covers.openlibrary.org/a/olid/${book.author_key[0]}-M.jpg`} 
                  alt={book.title}
                  style={{
                    objectFit: 'contain',
                  }}
                  width={30}
                  height={50}
                  onError={(e) => (e.currentTarget.src = '/path/to/placeholder.jpg')} // Optional: handle missing images
                />
              )} Author: {book.author_name && book.author_name.join(', ')}</p>
              <p>Published: {book.first_publish_year}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const query = context.query.q || 'the+lord+of+the+rings';
  const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
  const data = await res.json();
  const books: Book[] = data.docs.map((doc: any) => ({
    title: doc.title,
    author_name: doc.author_name || [],
    first_publish_year: doc.first_publish_year || 'N/A',
    cover_i: doc.cover_i,
  }));
  console.log(books)

  return {
    props: {
      books,
    },
  };
}

export default FetchBooks;