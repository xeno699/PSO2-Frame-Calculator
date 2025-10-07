"use client";
import { trpc } from "@/utils/trpc";

export default function ActionsPage() {
  const { data, isLoading } = trpc.actions.list.useQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.map(a => (
        <li key={a.id}>{a.name} - Power: {a.power}</li>
      ))}
    </ul>
  );
}