'use client'

import Image from 'next/image';
import React from 'react'
import { useState } from 'react';
import placeholderImage from '../../../public/images/placeholder-iamge.jpg'
import Link from 'next/link';

type VolumeInfo = {

    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
        thumbnail?: string;
    };
    publishedDate?: string;

}

type Book = {
    id: string;
    volumeInfo: VolumeInfo;
};

type BooksClientProps = {
    initialBooks: Book[];
};

const BooksClient = ({ initialBooks }: BooksClientProps) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [books, setBooks] = useState<Book[]>(initialBooks);
    const [searchTerm, setSearchTerm] = useState<string>("")

    async function getBooks() {

        setLoading(true);


        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
            searchTerm
        )}&maxResults=6&key=${process.env.NEXT_PUBLIC_API_KEY}`,);

        if (!response.ok) {
            throw new Error("Error fetching Books");
        }

        try {
            const data = await response.json();
            setBooks(data.items || []);

        } catch (error) {
            console.error('Error fetching Books', error)
        }
        setLoading(false);
    }

    return (

        <main>
            <div className='flex gap-5 items-center justify-center'>

                <input
                className='p-3 rounded-md w-[20rem] outline-none hover:bg-slate-200 hover:scale-105 focus:scale-100 focus:bg-slate-200 transition-all '
                    type="text"
                    placeholder='Search Books'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)
                        
                    }
                />

                <button onClick={getBooks} className='bg-blue-600 rounded-md p-2 text-white hover:scale-105 active:scale-100 transition-all'>
                    Search Books
                </button>
            </div>


            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-fit m-auto my-24 '>

                {
                    books.map((book) => {

                        const info = book.volumeInfo;
                        return (

                            <Link  key={book.id} href={`/${book.id}`}>
                            <div className='overflow-hidden shadow-md w-[20rem] h-[35rem] rounded-lg hover:opacity-90 transition-all hover:shadow-xl cursor-pointer'>
                                <Image src={info.imageLinks?.thumbnail || placeholderImage  } className='object-cover h-[25rem] w-[20rem] ' height={100} width={100} alt={info.title}/>
                               <div className='p-3'>
                                <h2 className='text-xl font-bold text-start'>{info.title || "No title availible"}</h2>
                                <p className='text-start line-clamp-1 mb-3'>{info.description || "No description availible"}</p>
                                <p className='text-start text-gray-500 line-clamp-1'>{info.authors?.join(', ') || "Unknown"}</p>
                                <p className='text-start  text-gray-500'>{info.publishedDate || "Unknown"}</p>
                               </div>
                            </div>
                            </Link>
                        )

                    })

                }

            </div>

            {!loading && books.length === 0 && searchTerm && (
        <p className="text-center mt-4 text-gray-500">
          No books found. Try another search.
        </p>
      )}

        </main>

    )
}

export default BooksClient;