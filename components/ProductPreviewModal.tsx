"use client";

import { X } from "lucide-react";

type ProductPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: any;
};

export default function ProductPreviewModal({ isOpen, onClose, product }: ProductPreviewModalProps) {
  if (!isOpen || !product) return null;

  const variants = product.variants || [];
  const defaultVariant = variants.find((v: any) => v.isDefault) || variants[0];
  const images = [
    product.img1,
    product.img2,
    product.img3,
    product.img4,
    product.img5,
    product.img6,
  ].filter(Boolean);
  const price = Number(defaultVariant?.price || product.finalPrice || product.price || 0);
  const mrp = Number(defaultVariant?.mrp || product.price || 0);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-zinc-950/95 border border-white/10 w-full max-w-[1040px] max-h-[90vh] overflow-y-auto rounded-md shadow-2xl text-white backdrop-blur-md">
        <div className="sticky top-0 z-10 flex justify-between items-center border-b border-white/10 bg-brandBlack px-6 py-4 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brandRed">Supplement Preview</p>
            <h2 className="text-xl font-black uppercase tracking-tight">{product.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-md bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="space-y-3">
            {images.length ? (
              images.map((img: string, i: number) => (
                <img key={img} src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${img}`} alt={`Preview ${i + 1}`} className="w-full h-52 object-cover rounded-md border border-white/10 bg-white/5" />
              ))
            ) : (
              <img src="/insanegenix/product/Whey.png" alt="" className="w-full h-64 object-contain rounded-md border border-white/10 bg-white/5 p-8" />
            )}
            {product.video ? (
              <video
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.video}`}
                className="w-full h-52 object-cover rounded-md border border-white/10 bg-white/5"
                controls
              />
            ) : null}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Chip>{product.category?.name || "Supplement"}</Chip>
                {product.goal && <Chip>{product.goal}</Chip>}
                {product.dietaryPreference && <Chip>{product.dietaryPreference}</Chip>}
                {product.status && <Chip>{product.status}</Chip>}
              </div>
              <h3 className="text-3xl font-black text-white">{product.title}</h3>
              {product.shortDescription && <p className="mt-2 text-sm font-semibold text-zinc-400">{product.shortDescription}</p>}
              {product.description && <p className="mt-3 text-sm leading-6 text-zinc-400">{product.description}</p>}
            </div>

            <div className="rounded-md bg-white/5 border border-white/10 p-5">
              <div className="flex items-end gap-3">
                <p className="text-4xl font-black text-brandRed">₹{price.toLocaleString()}</p>
                {mrp > price && <p className="pb-1 text-sm text-zinc-500 line-through">₹{mrp.toLocaleString()}</p>}
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <Metric label="Stock" value={product.stock || 0} />
                <Metric label="Variants" value={variants.length} />
                <Metric label="Serving" value={product.servingSize || "-"} />
                <Metric label="Protein" value={product.proteinPerServing ? `${product.proteinPerServing}g` : "-"} />
              </div>
            </div>

            <Panel title="Variants">
              {variants.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {variants.map((variant: any) => (
                    <div key={variant.id || variant.sku} className="rounded-md border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between">
                        <p className="font-black text-white">{variant.weightLabel || variant.netQuantity || "Variant"}</p>
                        {variant.isDefault && <span className="rounded-full bg-brandRed/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-brandRed">Default</span>}
                      </div>
                      <p className="mt-1 text-sm text-zinc-400">{variant.flavour || "Unflavoured"} / SKU {variant.sku || "-"}</p>
                      <p className="mt-2 text-sm font-bold text-white">₹{Number(variant.price || 0).toLocaleString()} · Stock {variant.stock}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No variants added.</p>
              )}
            </Panel>

            <Panel title="Nutrition & Use">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="Goal" value={product.goal} />
                <Info label="Protein Type" value={product.proteinType} />
                <Info label="Calories / serving" value={product.caloriesPerServing} />
                <Info label="BCAA / serving" value={product.bcaaPerServing ? `${product.bcaaPerServing}g` : ""} />
                <Info label="How to use" value={product.howToUse} />
                <Info label="When to use" value={product.whenToUse} />
              </div>
            </Panel>

            <Panel title="Compliance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Info label="FSSAI" value={product.fssaiLicense} />
                <Info label="Country" value={product.countryOfOrigin} />
                <Info label="Seller" value={product.sellerName} />
                <Info label="Manufacturer" value={product.manufacturedBy} />
                <Info label="Authenticity" value={product.authenticityNote} />
                <Info label="Allergen" value={product.allergenInfo} />
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: any) {
  return <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-300">{children}</span>;
}

function Metric({ label, value }: any) {
  return (
    <div className="rounded-md bg-zinc-950 border border-white/5 p-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function Panel({ title, children }: any) {
  return (
    <div className="rounded-md border border-white/10 bg-zinc-950/40 p-4">
      <h4 className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-white">{title}</h4>
      {children}
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-300">{value || "-"}</p>
    </div>
  );
}
