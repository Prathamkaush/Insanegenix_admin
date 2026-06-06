export default function UserStatsCards({ users }: { users: any }) {
  return (
    <>
      <StatCard
        title="Total Users"
        value={users.total}
        color="text-brandRed"
      />
      <StatCard
        title="New Today"
        value={users.today}
        color="text-brandRedLight"
      />
      <StatCard
        title="Last 7 Days"
        value={users.last7Days}
        color="text-brandRed"
      />
    </>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className="admin-surface flex flex-col justify-center min-h-[110px] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{title}</p>
      <p className={`text-2xl font-black ${color}`}>
        {value}
      </p>
    </div>
  );
}