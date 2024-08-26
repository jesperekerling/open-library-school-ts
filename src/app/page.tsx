import Image from "next/image";
import FetchBooks from './api/fetchBooks';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 container">
      <h1 className="text-3xl font-bold">Book Search</h1>
      <FetchBooks books={[]} />
    </main>
  );
}