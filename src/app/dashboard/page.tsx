"use client";

import React, { useEffect, useState } from "react";
import { bookService } from "@/services/api";
import { Book } from "@/types";
import AddBookModal from "@/components/AddBookModal";
import EditBookModal from "@/components/EditBookModal";

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null); 

  // Pagination & Insight states
  const [page, setPage] = useState<number>(1);
  const limit = 9; // 9 items fits beautifully in a 3-column grid
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
const [totalCollectionCount, setTotalCollectionCount] = useState<number>(0);
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>(""); // What the user types
  const [appliedTag, setAppliedTag] = useState<string>(""); // What is actually sent to API

  useEffect(() => {
    fetchBooks();
  }, [page, statusFilter, appliedTag]); // Re-run when these change

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      
      // Build our query parameters dynamically
      const params: any = { limit, page };
      if (statusFilter) params.status = statusFilter;
      if (appliedTag) params.tag = appliedTag;

      const response = await bookService.getBooks(params);
      
      if (response.code === 200) {
       setBooks(response.data.results);
        setTotalPages(response.data.totalPages);
        setTotalResults(response.data.totalResults); // Filtered count
        setTotalCollectionCount(response.data.totalCollectionCount);
      } else {
        setError(response.message || "Failed to load books");
      }
    } catch (err: any) {
      setError("Failed to fetch books. Please try logging in again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bookId: string, bookTitle: string) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${bookTitle}"?`);
    if (!isConfirmed) return;

    try {
      await bookService.deleteBook(bookId);
      // If deleting the last item on a page, go back a page
      if (books.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchBooks(); 
      }
    } catch (err) {
      alert("Failed to delete book. Please try again.");
    }
  };

  // Filter Handlers
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to page 1 on new filter
  };

  const handleTagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedTag(tagInput.trim());
    setPage(1); // Reset to page 1 on new filter
  };

  const clearFilters = () => {
    setStatusFilter("");
    setTagInput("");
    setAppliedTag("");
    setPage(1);
  };

  return (
    <div className="space-y-8 relative pb-12">
      
     
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">My Books</h1>
          
         
          <p className="text-sm text-gray-500 mt-1">
            {statusFilter || appliedTag ? (
              <>Showing <span className="font-semibold text-gray-900">{totalResults}</span> of <span className="font-semibold text-gray-900">{totalCollectionCount}</span> books</>
            ) : (
              <>You have <span className="font-semibold text-gray-900">{totalCollectionCount}</span> {totalCollectionCount === 1 ? 'book' : 'books'} in your collection</>
            )}
          </p>

        </div>
       
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm hover:bg-black transition-colors hover:cursor-pointer"
        >
          + Add a Book
        </button>
      </div>

     
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        <div className="w-full sm:w-48">
          <select 
            value={statusFilter} 
            onChange={handleStatusChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Want to Read">Want to Read</option>
            <option value="Reading">Reading</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <form onSubmit={handleTagSearch} className="w-full flex-1 flex gap-2">
          <input 
            type="text" 
            placeholder="Search by tag (e.g. Fiction)" 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
          <button type="submit" className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            Filter
          </button>
        </form>

        {(statusFilter || appliedTag) && (
          <button onClick={clearFilters} className="text-sm font-medium text-red-500 hover:text-red-700 w-full sm:w-auto">
            Clear Filters
          </button>
        )}
      </div>

     
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm text-center">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
          <span className="text-4xl mb-4">📚</span>
          <h3 className="text-lg font-medium text-gray-900">No books found</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6 max-w-sm">
            {statusFilter || appliedTag ? "Try adjusting or clearing your filters to see more results." : "You haven't added any books yet."}
          </p>
          {!(statusFilter || appliedTag) && (
             <button onClick={() => setIsAddModalOpen(true)} className="text-sm font-medium text-gray-900 underline hover:text-black">Add your first book</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex-1">
                <h3 className="font-serif text-xl text-gray-900 leading-tight mb-1">{book.title}</h3>
                <p className="text-gray-500 text-sm mb-4">by {book.author}</p>
                
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border
                  ${book.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                  ${book.status === 'Reading' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                  ${book.status === 'Want to Read' ? 'bg-gray-50 text-gray-700 border-gray-200' : ''}
                `}>
                  {book.status}
                </span>

                {book.tags && book.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {book.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                <p className="text-xs text-gray-400">Added {new Date(book.createdAt).toLocaleDateString()}</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setEditingBook(book)} 
                    className="text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors hover:cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(book.id, book.title)} 
                    className="text-sm font-medium text-red-400 hover:text-red-600 transition-colors hover:cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

     
      {!isLoading && (
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={() => setPage((p) => p - 1)} 
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage((p) => p + 1)} 
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Modal */}
      <AddBookModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => { setIsAddModalOpen(false); setPage(1); fetchBooks(); }} 
      />

      {/* Edit Modal */}
      <EditBookModal 
        book={editingBook}
        isOpen={!!editingBook} 
        onClose={() => setEditingBook(null)} 
        onSuccess={() => { setEditingBook(null); fetchBooks(); }} 
      />
      
    </div>
  );
}