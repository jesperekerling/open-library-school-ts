// Books.d.ts

interface Book {
    title: string;
    author_name?: string[];
    author_key?: string[];
    cover_i?: number;
    cover_edition_key?: string[];
    first_publish_year: number;
    key: string;
  }
  
  interface Props {
    books: Book[];
  }
  