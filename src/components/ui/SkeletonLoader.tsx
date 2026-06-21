export function SkeletonCard() {
  return (
    <div className="ui-card p-5 space-y-3">
      <div className="skeleton h-5 w-1/3 rounded" />
      <div className="skeleton h-3.5 w-full rounded" />
      <div className="skeleton h-3.5 w-4/5 rounded" />
      <div className="skeleton h-28 w-full rounded mt-2" />
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="ui-card p-5 space-y-4">
      <div className="flex gap-4 items-center">
        <div className="skeleton w-20 h-20 rounded-lg shrink-0" />
        <div className="space-y-2 w-full">
          <div className="skeleton h-6 w-1/3 rounded" />
          <div className="skeleton h-3.5 w-1/4 rounded" />
          <div className="flex gap-2 mt-1">
            <div className="skeleton h-5 w-16 rounded" />
            <div className="skeleton h-5 w-20 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 pt-3 border-t border-[#1A1A1A]">
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton h-10 w-full rounded" />
        <div className="skeleton h-10 w-full rounded" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <SkeletonProfile />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard />
        <div className="md:col-span-2">
          <SkeletonCard />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
