import Image from "next/image";
import FetchBooks from './api/fetchBooks';



export default function Home() {
  return (
    <main className="md:min-h-[500px] container mx-auto">
      <FetchBooks books={[]} />
    </main>
  );
}