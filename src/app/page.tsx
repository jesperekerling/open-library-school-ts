import Image from "next/image";
import FetchBooks from './api/fetchBooks';
import { BookProvider } from "@/context/books";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 container">
      <FetchBooks books={[]} />
    </main>
  );
}