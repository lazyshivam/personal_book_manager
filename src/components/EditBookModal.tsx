import React, { useState, useEffect } from "react";
import { bookService } from "@/services/api";
import { Book, BookStatus } from "@/types";

interface EditBookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditBookModal({ book, isOpen, onClose, onSuccess }: EditBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BookStatus>("Want to Read");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setStatus(book.status);
      setTags(book.tags ? book.tags.join(", ") : "");
      setError("");
    }
  }, [book]);

  if (!isOpen || !book) return null;

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !author.trim()) {
      setError("Title and Author are required.");
      return;
    }

    setIsLoading(true);

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const response = await bookService.updateBook(book.id, {
        title,
        author,
        status,
        tags: tagsArray,
      });

      if (response.code === 200) {
        onSuccess();
      } else {
        setError(response.message || "Failed to update book.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-serif text-gray-900">Edit Book</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 sm:text-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input type="text" required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 sm:text-sm" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reading Status</label>
            <select className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 sm:text-sm bg-white" value={status} onChange={(e) => setStatus(e.target.value as BookStatus)}>
              <option value="Want to Read">Want to Read</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags <span className="text-gray-400 font-normal">(comma separated)</span></label>
            <input type="text" className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 sm:text-sm" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>

          {error && <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm text-center">{error}</div>}

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors hover:cursor-pointer">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-colors hover:cursor-pointer disabled:opacity-50">
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}