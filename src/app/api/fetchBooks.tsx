'use client'
import { useState } from 'react';
import Image from 'next/image'; // Ensure you import Image from next/image
import Link from 'next/link';

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
      <input type="text" value={query} onChange={handleInputChange} placeholder="Search for books" className='px-5 py-4 dark:text-black font-semibold' autoFocus />
      <button type="submit" className='px-5 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 hover:text-white dark:hover:text-black font-semibold'>Search</button>
    </form>
  );
};

const FetchBooks = ({ books }: Props) => {
  const [searchResults, setSearchResults] = useState<Book[]>(books);
  const [loading, setLoading] = useState(false);
  const [sortMethod, setSortMethod] = useState<'newest' | 'oldest'>('newest'); // State for sorting method

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
      key: doc.key
    }));
    setSearchResults(books);
    setLoading(false);
  };

  const handleSortChange = (method: 'newest' | 'oldest') => {
    setSortMethod(method);
  };

  const sortedResults = [...searchResults].sort((a, b) => {
    if (a.cover_i && !b.cover_i) {
      return -1;
    } else if (!a.cover_i && b.cover_i) {
      return 1;
    } else if (sortMethod === 'newest') {
      return (b.first_publish_year || 0) - (a.first_publish_year || 0);
    } else {
      return (a.first_publish_year || 0) - (b.first_publish_year || 0);
    }
  });

  return (
    <div>
      <SearchBookForm onSearch={handleSearch} />
      {loading ? (
        <div className="loading-icon">Loading...</div>
      ) : (
        <div>
        <div>Total Results: {searchResults.length}</div>
          <div>
            Sort: 
            <button className='p-3' onClick={() => handleSortChange('newest')}>Sort by Newest</button>
            <button onClick={() => handleSortChange('oldest')}>Sort by Oldest</button>
          </div>
            <div className='bg-white dark:bg-black grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:gap-5 sm:gap-3'>
          {sortedResults.map((book, index) => (
            <div key={index} className='p-4 flex hover:opacity-75'>
              <div className='mr-5 place-content-center'>
                <Link href={`${book.key}`}>
                  <Image 
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} 
                    alt={book.title} 
                    width={250} 
                    height={333} 
                    onError={(e) => {
                      e.currentTarget.onerror = null; // Prevents infinite loop
                      e.currentTarget.src = '/placeholder-author.png';
                    }} 
                  />
                  <h2 className='font-semibold text-lg py-3'>
                      {book.title}
                  </h2>
                  <p className='flex'>
                    {book.author_key && book.author_key.length > 0 && (
                      <Image 
                      src={`https://covers.openlibrary.org/a/olid/${book.author_key[0]}-M.jpg`} 
                      alt={book.title}
                      style={{
                        objectFit: 'contain',
                        width: 'auto',
                        height: 'auto',
                      }}
                      width={30}
                      height={50}
                      onError={(e) => {
                        e.currentTarget.onerror = null; // Prevents infinite loop
                        e.currentTarget.src = '/placeholder-author.png';
                      }} 
                      />
                    )}
                    {book.author_name && book.author_name.join(', ')}
                  </p>
                  <p>Published: {book.first_publish_year}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default FetchBooks;