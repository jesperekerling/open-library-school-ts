// Books.d.ts

interface Book {
    title: string;
    author_name?: string[];
    author_key?: string[];
    cover_i?: number;
    cover_edition_key?: string[];
    first_publish_year: number;
    cover_i: number;
  }
  
  interface Props {
    books: Book[];
  }