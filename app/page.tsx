'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { calculateOptimalActions } from '@/utils/optimalActions';
import FrameInput from './components/FrameInput';

export const dynamic = 'force-dynamic';

// ページ内で使うAction型を統一
interface ActionItem {
  name: string;
  frames: number;
  power: number;
  maxUsage: number;
  classId?: number; // classId はオプションにしておく
}

interface Combination {
  actions: ActionItem[];
  totalPower: number;
  totalFrames: number;
  remainingFrames: number;
}

export default function ActionsPage() {
  const { data: actionsData, isLoading, error } = trpc.actions.list.useQuery();
  const { data: classesData } = trpc.classes.list.useQuery();

  const [frameLimit, setFrameLimit] = useState(100); // Default frame limit
  const [selectedClassId, setSelectedClassId] = useState<number>(classesData?.[0]?.id ?? 0);

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">エラー: {error.message}</p>;

  // クラスでフィルタ
  const filteredActions = actionsData?.filter((a) => a.classId === selectedClassId) || [];

  // calculateOptimalActions用に変換
  const items: ActionItem[] = filteredActions.map((a) => ({
    name: a.name,
    frames: a.frames,
    power: a.power,
    maxUsage: a.maxUsage,
  }));

  const result = calculateOptimalActions(frameLimit, items);

  return (
    <div className="space-y-4 overflow-x-auto">
      <h1 className="mb-2 text-xl font-bold">Optimal Action Combinations</h1>

      {/* フレーム数入力 + クラス選択 */}
      <div className="mb-4 flex flex-col space-y-2 sm:flex-row sm:items-end sm:space-y-0 sm:space-x-4">
        <FrameInput onSubmit={setFrameLimit} />

        <div className="flex flex-col">
          <label htmlFor="classSelect" className="block text-sm font-medium text-gray-700">
            クラスを選択:
          </label>
          <select
            id="classSelect"
            value={selectedClassId ?? ''}
            onChange={(e) => setSelectedClassId(e.target.value ? Number(e.target.value) : 0)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">未選択</option>
            {classesData?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 結果テーブル */}
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">順位</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">組み合わせ</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">威力</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              動作フレーム数
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              猶予フレーム数
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {result.combinations.map((combo: Combination, index: number) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
              <td className="px-4 py-2 text-sm text-gray-800">
                {combo.actions.map((a: ActionItem) => a.name).join(', ')}
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
