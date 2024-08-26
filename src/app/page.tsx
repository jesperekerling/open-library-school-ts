import Image from "next/image";
import FetchBooks from './api/fetchBooks';
import { BookProvider } from "@/context/books";


export default function Home() {
  return (
    <main className="flex md:min-h-[500px] flex-col items-center justify-between ontainer">
      <FetchBooks books={[]} />
    </main>
  );
}