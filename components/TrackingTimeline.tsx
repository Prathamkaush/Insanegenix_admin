type Scan = {
  time: string;
  location: string;
  activity: string;
  status: string;
};

export default function TrackingTimeline({
  scans,
}: {
  scans: Scan[];
}) {
  if (!scans?.length) {
    return (
      <p className="text-sm text-zinc-500 uppercase tracking-widest font-black text-[10px]">
        Tracking information not available yet.
      </p>
    );
  }

  return (
    <ol className="border-l border-white/10 pl-4 space-y-4">
      {scans.map((scan, i) => (
        <li key={i}>
          <p className="text-sm font-semibold text-white">
            {scan.status}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {scan.location} ·{" "}
            {new Date(scan.time).toLocaleString()}
          </p>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
            {scan.activity}
          </p>
        </li>
      ))}
    </ol>
  );
}
