import React, { useState } from 'react';

interface FrameInputProps {
  onSubmit: (frameLimit: number) => void;
}

const FrameInput: React.FC<FrameInputProps> = ({ onSubmit }) => {
  const [frameLimit, setFrameLimit] = useState(100); // Default value

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(frameLimit);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="frameLimit" className="block text-sm font-medium text-gray-700">
        操作可能なフレーム数:
      </label>
      <div className="mt-1 flex items-center">
        <input
          type="number"
          id="frameLimit"
          value={frameLimit}
          onChange={(e) => setFrameLimit(Number(e.target.value))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <button
          type="submit"
          className="ml-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          設定
        </button>
      </div>
    </form>
  );
};

export default FrameInput;
