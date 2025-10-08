'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { calculateOptimalActions } from '@/utils/optimalActions';
import FrameInput from './components/FrameInput';

export const dynamic = 'force-dynamic';

export default function ActionsPage() {
  const { data, isLoading, error } = trpc.actions.list.useQuery();
  const [frameLimit, setFrameLimit] = useState(100); // Default frame limit

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">エラー: {error.message}</p>;

  // Transform data from trpc.actions.list to match the algorithm requirements
  const items =
    data?.map((a) => ({
      name: a.name,
      frames: a.frames,
      power: a.power,
    })) || [];

  const result = calculateOptimalActions(frameLimit, items);

  return (
    <div className="overflow-x-auto">
      <h1>Optimal Action Combinations</h1>
      <FrameInput onSubmit={setFrameLimit} />
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">順位</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">組み合わせ</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">威力</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">動作フレーム数</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">猶予フレーム数</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {result.combinations.map((combo: any, index: number) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {combo.actions.map((a: any) => a.name).join(', ')}
              </td>
              <td className="px-4 py-2 text-sm text-gray-800">{combo.totalPower}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{combo.totalFrames}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{combo.remainingFrames}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
