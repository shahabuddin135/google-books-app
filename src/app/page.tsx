import BooksClient from './components/BooksClient';

// Fetch initial data on the server
async function fetchBooksData() {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=lord+of+the+rings&maxResults=6&key=${process.env.NEXT_PUBLIC_API_KEY}`,
    { next: { revalidate: 3600 } } 
  );
  const data = await response.json();
  return data.items || [];
}

export default async function Home() {
  const initialBooks = await fetchBooksData();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Google Books Search</h1>
     
      <BooksClient initialBooks={initialBooks} />
    </div>
  );
}
