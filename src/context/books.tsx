import { Children, createContext, PropsWithChildren } from 'react';
import { useState } from 'react';
import { useContext } from 'react';

type BookState = {
    books: Book[];
    getBooks: (query: string) => Promise<Book[]>;
}

const defaultState: BookState = {
    books: [],
    getBooks: () => Promise.resolve([])
}
const BookContext = createContext<BookState>(defaultState);

const BookProvider = ({ children }: PropsWithChildren) => {
    const [books, setBooks] = useState<Book[]>([]);

    async function getBooks(query: string) {
        return []
    }

    const getBooks2: typeof defaultState.getBooks = async (query) => {
        const res = await fetch(`https://openlibrary.org/search.json?q=${query}`);
        const data = await res.json();
        const books: Book[] = data.docs.map((doc: any) => ({
            title: doc.title,
            author_name: doc.author_name || [],
            first_publish_year: doc.first_publish_year || 'N/A',
            author_key: doc.author_key || [], // Extract author_key
            cover_i: doc.cover_i,
        }));
        setBooks(books);
        return books;
    }

    return (
        <BookContext.Provider value={defaultState}>
            {children}
        </BookContext.Provider>
    )
}

function useBooks() {
    const books = useContext(BookContext);
    if (!books) {
        throw new Error('useBooks must be used within a BookProvider');
    }
    return books;
}

export { BookContext, BookProvider }