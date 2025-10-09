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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    // Clamp the value between 0 and 500
    if (value < 0) value = 0;
    if (value > 600) value = 600;
    setFrameLimit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label htmlFor="frameLimit" className="block text-sm font-medium text-gray-700">
        操作可能なフレーム数:
      </label>
      <div className="mt-1 flex items-center space-x-2">
        {/* 入力 */}
        <input
          type="number"
          id="frameLimit"
          value={frameLimit}
          onChange={handleChange}
          min={0}
          max={600}
          className="block w-full flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />

        {/* ボタン */}
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          設定
        </button>
      </div>
    </form>
  );
};

export default FrameInput;
