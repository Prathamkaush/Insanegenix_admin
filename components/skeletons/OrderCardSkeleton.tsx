import Skeleton from "@/components/common/Skeleton";

export default function OrderCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-28" />
      </div>

      <Skeleton className="h-9 w-32 mt-4" />
    </div>
  );
}
