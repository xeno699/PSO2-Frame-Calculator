'use client';

import { trpc } from '@/utils/trpc';

export const dynamic = 'force-dynamic'; // ← これを追加

export default function ActionsPage() {
const { data, isLoading, error } = trpc.actions.list.useQuery();

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">エラー: {error.message}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">名前</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">威力</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">フレーム数</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">最大使用回数</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">猶予フレーム</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">クラスID</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.map((a) => (
            <tr key={a.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-600">{a.id}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{a.name}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{a.power}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{a.frames}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{a.maxUsage}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{a.buffer}</td>
              <td className="px-4 py-2 text-sm text-gray-800">{a.classId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
