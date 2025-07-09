import React from "react";
import { useTransaction } from "../context/TransactionContext";

const YearArrowsSelector = () => {
  const { currentYear, handleYearChange } = useTransaction();
  return (
    <div className="flex items-center justify-center space-x-4 py-4 w-full bg-[#1F1D2C] rounded-lg shadow-sm">
      <button
        onClick={() => handleYearChange("prev")}
        className="p-2 text-[#B9042C] hover:bg-gray-100 rounded-full"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-[#B9042C]">{currentYear}</h2>
      <button
        onClick={() => handleYearChange("next")}
        className="p-2 text-[#B9042C] hover:bg-gray-100 rounded-full"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default YearArrowsSelector;
