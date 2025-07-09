import React from "react";
import { useTransaction } from "../context/TransactionContext";

const YearSelector = () => {
  const { currentYear, setCurrentYear } = useTransaction();
  const availableYears = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="flex items-center space-x-2">
      <label className="text-white text-sm">Ano:</label>
      <select
        value={currentYear}
        onChange={(e) => setCurrentYear(Number(e.target.value))}
        className="bg-[#1a1a2e] text-white border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-[#A0052B]"
      >
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;
