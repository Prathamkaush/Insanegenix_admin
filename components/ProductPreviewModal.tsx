"use client";

type ProductPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: any;
};

export default function ProductPreviewModal({
  isOpen,
  onClose,
  product,
}: ProductPreviewModalProps) {
  if (!isOpen || !product) return null;

  const hasImages = [
    product.img1,
    product.img2,
    product.img3,
    product.img4,
  ].some(Boolean);

  const createdAtValid =
    product.createdAt && !isNaN(Date.parse(product.createdAt));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-bold text-brandPink">
            Product Preview
          </h2>
          <button
            className="text-brandGray text-xl hover:text-brandBlack"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT: IMAGES */}
          <div className="space-y-3">
            {hasImages ? (
              [product.img1, product.img2, product.img3, product.img4]
                .filter(Boolean)
                .map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:3030/uploads/products/${img}`}
                    className="w-full h-44 object-cover rounded-lg border"
                    alt={`Product image ${i + 1}`}
                  />
                ))
            ) : (
              <div className="h-44 flex items-center justify-center text-gray-400 border rounded-lg">
                No images uploaded
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-brandBlack">
              {product.title}
            </h3>

            {product.description && (
              <p className="text-sm text-brandGray">
                {product.description}
              </p>
            )}

            <p className="text-brandPink font-bold text-xl">
              ₹ {product.price}
            </p>

            <p className="text-brandBlack">
              Total Stock:{" "}
              <span className="font-semibold">
                {product.stock}
              </span>
            </p>

            {/* SIZES */}
            <div>
              <p className="font-medium mb-1 text-brandBlack">
                Available Sizes
              </p>

              {Array.isArray(product.sizes) &&
              product.sizes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s: any) => (
                    <span
                      key={s.id}
                      className={`px-3 py-1 text-sm rounded border
                        ${
                          s.stock > 0
                            ? "border-brandPink text-brandPink"
                            : "border-gray-300 text-gray-400 line-through"
                        }
                      `}
                    >
                      {s.size} ({s.stock})
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No sizes added
                </p>
              )}
            </div>

            {/* CATEGORY */}
            <p className="text-brandGray text-sm">
              Category:{" "}
              {product.category?.name || "-"} →{" "}
              {product.type?.name || "-"} →{" "}
              {product.subtype?.name || "-"}
            </p>

            {/* DATE */}
            <p className="text-xs text-brandGray">
              Added on:{" "}
              {createdAtValid
                ? new Date(product.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
