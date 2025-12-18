export default function TrackingTimeline({ status }: { status: string }) {
  const steps = [
    { key: "PENDING", label: "Order Placed" },
    { key: "CONFIRMED", label: "Order Confirmed" },
    { key: "SHIPPED", label: "Shipped" },
    { key: "DELIVERED", label: "Delivered" },
  ];

  const currentIndex = steps.findIndex(
    (step) => step.key === status
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-6">Order Tracking</h2>

      <div className="relative pl-10">

        {/* VERTICAL LINE */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-brandPink" />

        <div className="space-y-8">
          {steps.map((step, i) => {
            const isCompleted = i <= currentIndex;
            const isActive = i === currentIndex;

            return (
              <div key={step.key} className="relative flex gap-4">

                {/* DOT */}
                <div
                  className={`
                    relative z-10
                    w-8 h-8 rounded-full
                    flex items-center justify-center
                    text-sm font-bold
                    ${
                      isCompleted
                        ? "bg-brandPink text-white"
                        : "bg-gray-300 text-transparent"
                    }
                  `}
                >
                  ✓
                </div>

                {/* CONTENT */}
                <div>
                  <p
                    className={`font-semibold leading-tight ${
                      isActive
                        ? "text-brandPink"
                        : "text-brandBlack"
                    }`}
                  >
                    {step.label}
                  </p>

                  {isActive && (
                    <p className="text-sm text-brandGray mt-1">
                      Current Status: {status}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
