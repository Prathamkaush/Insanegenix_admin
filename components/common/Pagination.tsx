export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-4 items-center">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
      >
        ←
      </button>

      <span className="bg-white px-6 py-2 rounded-md border border-gray-100 shadow-sm font-bold text-brandBlack">
        Page {page} <span className="text-brandGray font-normal mx-1">of</span> {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-md hover:border-brandRed hover:text-brandRed transition-all disabled:opacity-30"
      >
        →
      </button>
    </div>
  );
}
