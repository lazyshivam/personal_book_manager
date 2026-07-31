
import React, { useState } from "react";
import { bookService } from "@/services/api";
import { BookStatus } from "@/types";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBookModal({ isOpen, onClose, onSuccess }: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<BookStatus>("Want to Read");
  const [tags, setTags] = useState(""); // We'll accept comma-separated tags
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 
  if (!isOpen) return null;

  const validateForm = () => {
    if (!title.trim()) return "Book title is required.";
    if (!author.trim()) return "Author name is required.";
    return null;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
     
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const response = await bookService.createBook({
        title,
        author,
        status,
        tags: tagsArray,
      });

      if (response.code === 201 || response.code === 200) {
        // Reset form
        setTitle("");
        setAuthor("");
        setStatus("Want to Read");
        setTags("");
        
      
        onSuccess();
      } else {
        setError(response.message || "Failed to add book.");
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
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-serif text-gray-900">Add a New Book</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none sm:text-sm"
              placeholder="e.g. Atomic Habits"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              id="author"
              type="text"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none sm:text-sm"
              placeholder="e.g. James Clear"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Reading Status
            </label>
            <select
              id="status"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none sm:text-sm bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value as BookStatus)}
            >
              <option value="Want to Read">Want to Read</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags <span className="text-gray-400 font-normal">(comma separated)</span>
            </label>
            <input
              id="tags"
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none sm:text-sm"
              placeholder="e.g. Self-Help, Productivity"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-100">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-black focus:outline-none disabled:opacity-50 transition-colors hover:cursor-pointer"
            >
              {isLoading ? "Saving..." : "Save Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}