import { useState } from "react";

export default function Progress({ total, current }: { total: number, current: number }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-gray-500 mb-1 text-normal dark:text-gray-300">
        <span>Progreso</span>
        <div>
          <span>Paso {`${(current + 1)} / ${total}`} </span>
        </div>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-[#fde047] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}