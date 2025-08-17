import React from "react";

const ResultsSkeleton = ({ length }: { length?: number }) => {
  return (
    <div className="space-y-4 my-10">
      <div className="my-10">
        <div className="h-12 w-1/3 bg-200 rounded animate-pulse"></div>
        <div className="h-3 w-1/4 bg-200 rounded animate-pulse my-5"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
        {Array.from({ length: length || 10 }).map((_, index) => (
          <div key={index} className="h-40 bg-200 rounded-xl animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};

export default ResultsSkeleton;
