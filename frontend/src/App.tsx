import { useState, useEffect } from 'react'
import './App.css'

type Book = {
  id: number
  title: string
  author: string
  isbn?: string
  created_at: string
  updated_at: string
}

function App() {
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    fetch('http://localhost:8080/books')
      .then((res) => res.json())
      .then((data) => setBooks(data))
  }, [])

  return (
    <>
    {
      books.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        <div className='container mx-auto'>
          <h1 className='text-2xl font-normal py-4'>書籍一覧</h1>
          <table className='w-full border border-gray-200'>
            <thead className='bg-gray-100'>
              <tr className='border-b border-gray-200'>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
              </tr>
            </thead>
            <tbody>
              {
                books.map((book) => (
                  <tr key={book.id} className='text-center border-b border-gray-200'>
                    <td>
                      {book.title}
                    </td>
                    <td>
                      {book.author}
                    </td>
                    <td>
                      {book?.isbn || 'N/A'}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )
    }
    </>
  )
}

export default App
