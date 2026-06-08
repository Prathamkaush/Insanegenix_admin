import { FiRefreshCw, FiSearch } from "react-icons/fi";

export default function UsersFilters({
  search,
  setSearch,
  sort,
  setSort,
  range,
  setRange,
  onReset,
}: any) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative group flex-1 min-w-[220px] md:flex-none">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brandRed transition-colors" size={14} />
        <input
          className="admin-field pl-10 md:w-72 text-[11px] font-bold uppercase tracking-widest placeholder:text-zinc-600"
          placeholder="      Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="admin-field w-auto min-w-[150px] text-[11px] font-black uppercase tracking-widest cursor-pointer"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="new" className="bg-zinc-950 text-white">Newest First</option>
        <option value="old" className="bg-zinc-950 text-white">Oldest First</option>
      </select>

      <select
        className="admin-field w-auto min-w-[150px] text-[11px] font-black uppercase tracking-widest cursor-pointer"
        value={range || ""}
        onChange={(e) => setRange(e.target.value || undefined)}
      >
        <option value="" className="bg-zinc-950 text-white">All Time</option>
        <option value="7d" className="bg-zinc-950 text-white">Last 7 Days</option>
        <option value="30d" className="bg-zinc-950 text-white">Last 30 Days</option>
      </select>

      <button
        onClick={onReset}
        className="ml-auto inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/10 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest text-zinc-300 transition-all hover:border-brandRed hover:text-brandRed hover:bg-white/20"
      >
        <FiRefreshCw size={14} />
        Reset
      </button>
    </div>
  );
}
