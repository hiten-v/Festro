import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="h-44 bg-stone-100" />
            <div className="p-4">
              <div className="h-5 bg-stone-100 rounded-full w-3/4 mb-3" />
              <div className="h-4 bg-stone-100 rounded-full w-1/2 mb-4" />
              <div className="h-4 bg-stone-100 rounded-full w-full mb-2" />
              <div className="h-4 bg-stone-100 rounded-full w-5/6 mb-4" />
              <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                <div>
                  <div className="h-3 bg-stone-100 rounded-full w-16 mb-1" />
                  <div className="h-4 bg-stone-100 rounded-full w-20" />
                </div>
                <div className="h-6 bg-stone-100 rounded-lg w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;