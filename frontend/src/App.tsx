import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "./App.css";

type Book = {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  created_at: string;
  updated_at: string;
};

type Inputs = {
  title: string;
  author: string;
  isbn: string | null;
};

const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

function App() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setError(null);
    fetch(`${backendUrl}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((book) => {
        if (books === null) {
          setBooks([book]);
        } else {
          setBooks([...books, book]);
        }
        reset();
      })
      .catch((error) => {
        setError(error);
      });
  };

  useEffect(() => {
    fetch(`${backendUrl}/books`)
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  return (
    <>
      {books === null ? (
        <h1>Loading...</h1>
      ) : (
        <div className="container mx-auto">
          <h1 className="text-2xl font-normal py-4">書籍一覧</h1>
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="border-b border-gray-200">
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="text-center border-b border-gray-200"
                >
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book?.isbn || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="py-8">
            <h1 className="text-2xl font-normal py-4">書籍登録</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <label className="flex flex-col">
                <div className="flex flex-row gap-2">
                  Title
                  <span className="text-red-500">必須</span>
                </div>
                <input
                  type="text"
                  {...register("title", {
                    required: "Title is required",
                  })}
                  className="border border-gray-200 rounded-md p-2"
                />
              </label>
              <label className="flex flex-col">
                <div className="flex flex-row gap-2">
                  Author
                  <span className="text-red-500">必須</span>
                </div>
                <input
                  type="text"
                  {...register("author", {
                    required: "Author is required",
                  })}
                  className="border border-gray-200 rounded-md p-2"
                />
              </label>
              <label className="flex flex-col">
                ISBN
                <input
                  type="text"
                  {...register("isbn")}
                  className="border border-gray-200 rounded-md p-2"
                />
              </label>
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-md mt-4 hover:bg-blue-700"
              >
                登録
              </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
