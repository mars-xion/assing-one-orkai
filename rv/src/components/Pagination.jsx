import React from "react";

const Pagination = ({ page, setPage, totalPages }) => {
  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        className="px-4 py-2 bg-gray-600 text-black rounded-md hover:bg-gray-700 transition-all disabled:opacity-50"
        disabled={page === 1}
      >
        ⬅ Previous
      </button>
      <span className="text-gray-700 font-medium">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        className="px-4 py-2 bg-gray-600 text-black rounded-md hover:bg-gray-700 transition-all disabled:opacity-50"
        disabled={page === totalPages}
      >
        Next ➡
      </button>
    </div>
  );
};

export default Pagination;
