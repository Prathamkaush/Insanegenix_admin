"use client";

interface Props {
  price: string;
  discountType: string;
  discountValue: string;
  onChange: (data: {
    discountType: string;
    discountValue: string;
  }) => void;
}

function calculateFinalPrice(
  price: number,
  discountType?: string,
  discountValue?: number
) {
  if (!discountType || !discountValue) return price;

  if (discountType === "PERCENT") {
    return Math.max(
      0,
      price - (price * discountValue) / 100
    );
  }

  if (discountType === "FLAT") {
    return Math.max(0, price - discountValue);
  }

  return price;
}

export default function ProductDiscountSection({
  price,
  discountType,
  discountValue,
  onChange,
}: Props) {
  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discountValue || 0);

  let finalPrice = numericPrice;

  if (discountType === "PERCENT") {
    finalPrice = numericPrice - (numericPrice * numericDiscount) / 100;
  }

  if (discountType === "FLAT") {
    finalPrice = numericPrice - numericDiscount;
  }

  finalPrice = Math.max(finalPrice, 0);

  return (
    <div className="bg-zinc-950/80 border border-white/10 shadow-2xl rounded-xl p-5 space-y-4 text-white">
      <h2 className="text-lg font-black uppercase tracking-tight text-white">
        Discount (Optional)
      </h2>

      <select
        className="w-full rounded-md border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none transition focus:border-brandRed focus:ring-2 focus:ring-brandRed/20"
        value={discountType}
        onChange={(e) =>
          onChange({
            discountType: e.target.value,
            discountValue: "",
          })
        }
      >
        <option value="" className="bg-zinc-950 text-white">No Discount</option>
        <option value="PERCENT" className="bg-zinc-950 text-white">Percentage</option>
        <option value="FLAT" className="bg-zinc-950 text-white">Flat Amount</option>
      </select>

      <input
        type="number"
        disabled={!discountType}
        placeholder="Discount value"
        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-brandRed focus:ring-2 focus:ring-brandRed/20"
        value={discountValue}
        onChange={(e) =>
          onChange({
            discountType,
            discountValue: e.target.value,
          })
        }
      />

      {discountType && (
        <div className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">
          Final Price:&nbsp;
          <span className="font-black text-brandRed">
            ₹{finalPrice.toFixed(0)}
          </span>
        </div>
      )}
    </div>
  );
}
