'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { calculateOptimalActions } from '@/utils/optimalActions';
import FrameInput from './components/FrameInput';

export const dynamic = 'force-dynamic';

interface ActionItem {
  name: string;
  frames: number;
  power: number;
  maxUsage: number;
  WeaponId?: number;
}

interface Combination {
  actions: ActionItem[];
  totalPower: number;
  totalFrames: number;
  remainingFrames: number;
}

export default function ActionsPage() {
  const { data: actionsData, isLoading, error } = trpc.actions.list.useQuery();
  const { data: weaponsData } = trpc.weapons.list.useQuery();

  const [frameLimit, setFrameLimit] = useState(100);
  const [selectedWeaponId, setSelectedWeaponId] = useState<number>(weaponsData?.[0]?.id ?? 0);

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">エラー: {error.message}</p>;

  const filteredActions = actionsData?.filter((a) => a.weaponId === selectedWeaponId) || [];

  const items: ActionItem[] = filteredActions.map((a) => ({
    name: a.name,
    frames: a.frames,
    power: a.power,
    maxUsage: a.maxUsage,
  }));

  const result = calculateOptimalActions(frameLimit, items);

  return (
    <div className="mx-auto min-h-screen max-w-5xl space-y-6 bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-red-800">Optimal Action Combinations</h1>

      {/* 入力フォーム */}
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-y-0 sm:space-x-6">
          <div className="flex-1">
            <FrameInput onSubmit={setFrameLimit} />
          </div>

          <div className="flex w-full flex-col sm:w-48">
            <label htmlFor="weaponTypeSelect" className="mb-1 text-sm font-medium text-gray-700">
              武器種を選択
            </label>
            <select
              id="weaponTypeSelect"
              value={selectedWeaponId ?? ''}
              onChange={(e) => setSelectedWeaponId(e.target.value ? Number(e.target.value) : 0)}
              className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">未選択</option>
              {weaponsData?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 結果テーブル */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">順位</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                組み合わせ
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">威力</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                動作フレーム数
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                猶予フレーム数
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {result.combinations.map((combo: Combination, index: number) => (
              <tr
                key={index}
                className={`hover:bg-indigo-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-800">
                  {combo.actions.map((a: ActionItem) => a.name).join(', ')}
                </td>
                <td className="px-4 py-2 text-sm font-semibold text-indigo-700">
                  {combo.totalPower}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800">{combo.totalFrames}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{combo.remainingFrames}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
