import { Metadata } from "next";

// Set metadata for SEO purposes
export async function generateMetadata({ params }: { params: { bookID: string } }): Promise<Metadata> {
  const book = await fetchBookByID(params.bookID); // Fetch the book
  return {
    title: book?.volumeInfo.title || "Book Details",
    description: book?.volumeInfo.description || "Details about the book.",
  };
}

// Function to fetch book details by ID
async function fetchBookByID(bookID: string) {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookID}?key=${process.env.NEXT_PUBLIC_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch book details for ID: ${bookID}`);
  }

  return response.json();
}

// Dynamic Page Component
export default async function BookPage({ params }: { params: { bookID: string } }) {
  try {
    const book = await fetchBookByID(params.bookID);

    if (!book) {
      return <p>Book not found.</p>;
    }

    const info = book.volumeInfo;

    return (
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
        <h1 className="text-3xl font-bold">{info.title}</h1>
        <p className="text-gray-500 mt-2">
          {info.authors ? `By ${info.authors.join(", ")}` : "Unknown Author"}
        </p>
        <img
          src={info.imageLinks?.thumbnail || "/placeholder.jpg"}
          alt={info.title}
          className="w-full h-64 object-contain mt-4"
        />
         <div className="text-gray-700 mt-10" dangerouslySetInnerHTML={
          { __html: info.description || "<p>No description available.</p>",}
        }></div>
        <p className="text-gray-500 mt-4">Published: {info.publishedDate || "Unknown"}</p>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <p>Error loading book details. Please try again later.</p>;
  }
}
