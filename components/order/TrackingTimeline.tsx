export default function TrackingTimeline({ scans }: { scans: any[] }) {
  if (!scans.length) {
    return (
      <p className="text-sm text-gray-500">
        Tracking not started yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {scans.map((scan, i) => (
        <div
          key={i}
          className="flex gap-3 border-l-2 border-brandRed pl-4"
        >
          <div>
            <p className="text-sm font-semibold">
              {scan.activity}
            </p>
            <p className="text-xs text-gray-500">
              {scan.location}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(scan.time).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
