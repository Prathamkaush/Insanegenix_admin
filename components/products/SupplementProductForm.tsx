"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";
import { api } from "@/lib/api";

type Variant = {
  id?: number;
  sku: string;
  flavour: string;
  weightLabel: string;
  netQuantity: string;
  servings: string;
  mrp: string;
  price: string;
  discountType: string;
  discountValue: string;
  stock: string;
  weightKg: string;
  isDefault: boolean;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  image5: string | null;
  image6: string | null;
  video: string | null;
  imageFiles: (File | null)[];
  videoFile: File | null;
};

type NutritionFact = {
  name: string;
  amount: string;
  unit: string;
  per: string;
  amountPer100g: string;
  rdaPercentage: string;
};

const emptyVariant = (): Variant => ({
  sku: "",
  flavour: "",
  weightLabel: "",
  netQuantity: "",
  servings: "",
  mrp: "",
  price: "",
  discountType: "",
  discountValue: "",
  stock: "0",
  weightKg: "",
  isDefault: false,
  image1: null,
  image2: null,
  image3: null,
  image4: null,
  image5: null,
  image6: null,
  video: null,
  imageFiles: [null, null, null, null, null, null],
  videoFile: null,
});

const emptyNutrition = (): NutritionFact => ({
  name: "",
  amount: "",
  unit: "",
  per: "",
  amountPer100g: "",
  rdaPercentage: "",
});

const NUTRITION_META_PREFIX = "nutrition-label:";

function parseNutritionMeta(per?: string | null) {
  if (!per?.startsWith(NUTRITION_META_PREFIX)) {
    return {
      per: per || "",
      amountPer100g: "",
      rdaPercentage: "",
    };
  }

  const params = new URLSearchParams(per.slice(NUTRITION_META_PREFIX.length));

  return {
    per: params.get("serving") || "",
    amountPer100g: params.get("per100g") || "",
    rdaPercentage: params.get("rda") || "",
  };
}

function buildNutritionMeta(fact: NutritionFact, servingSize: string) {
  if (!fact.amountPer100g && !fact.rdaPercentage && !fact.per) {
    return servingSize || "serving";
  }

  const params = new URLSearchParams();
  params.set("serving", fact.per || servingSize || "serving");
  if (fact.amountPer100g) params.set("per100g", fact.amountPer100g);
  if (fact.rdaPercentage) params.set("rda", fact.rdaPercentage);

  return `${NUTRITION_META_PREFIX}${params.toString()}`;
}

const imageUrl = (fileName?: string | null) =>
  fileName
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${fileName}`
    : "";

const mediaUrl = imageUrl;

export default function SupplementProductForm({
  mode,
  productId,
  initialProduct,
}: {
  mode: "create" | "edit";
  productId?: string;
  initialProduct?: any;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [subtypes, setSubtypes] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [brandName, setBrandName] = useState("InsaneGenix");
  const [productLine, setProductLine] = useState("");
  const [goal, setGoal] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [dietaryType, setDietaryType] = useState("UNSPECIFIED");
  const [tags, setTags] = useState("");
  const [proteinType, setProteinType] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [subtypeId, setSubtypeId] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [gstRate, setGstRate] = useState("0");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  const [servingSize, setServingSize] = useState("");
  const [servingsPerContainer, setServingsPerContainer] = useState("");
  const [proteinPerServing, setProteinPerServing] = useState("");
  const [bcaaPerServing, setBcaaPerServing] = useState("");
  const [eaaPerServing, setEaaPerServing] = useState("");
  const [caloriesPerServing, setCaloriesPerServing] = useState("");
  const [proteinPercentage, setProteinPercentage] = useState("");

  const [ingredients, setIngredients] = useState("");
  const [howToUse, setHowToUse] = useState("");
  const [whenToUse, setWhenToUse] = useState("");
  const [safetyInformation, setSafetyInformation] = useState("");
  const [allergenInfo, setAllergenInfo] = useState("");
  const [fssaiLicense, setFssaiLicense] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("India");
  const [marketedBy, setMarketedBy] = useState("");
  const [manufacturedBy, setManufacturedBy] = useState("");
  const [sellerName, setSellerName] = useState("InsaneGenix");
  const [authenticityNote, setAuthenticityNote] = useState(
    "Scan or verify the product code before use. Buy only from authorized InsaneGenix channels.",
  );
  const [returnPolicy, setReturnPolicy] = useState(
    "Returns accepted only for damaged, incorrect, or sealed unused products as per policy.",
  );
  const [keyBenefitsText, setKeyBenefitsText] = useState("");
  const [certificationsText, setCertificationsText] = useState("");

  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewLaunch, setIsNewLaunch] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);

  const [variants, setVariants] = useState<Variant[]>([
    { ...emptyVariant(), isDefault: true },
  ]);
  const [nutritionFacts, setNutritionFacts] = useState<NutritionFact[]>([
    emptyNutrition(),
  ]);
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [existingImages, setExistingImages] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [video, setVideo] = useState<File | null>(null);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/categories")
      .then((r) => setCategories(r.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setTypes([]);
      return;
    }
    api
      .get(`/product-types?categoryId=${categoryId}`)
      .then((r) => setTypes(r.data || []))
      .catch(console.error);

  }, [categoryId]);

  useEffect(() => {
    if (!typeId) {
      setSubtypes([]);
      return;
    }
    api
      .get(`/product-subtypes?typeId=${typeId}`)
      .then((r) => setSubtypes(r.data || []))
      .catch(console.error);
  }, [typeId]);

  useEffect(() => {
    if (!initialProduct) return;

    setTitle(initialProduct.title || "");
    setShortDescription(initialProduct.shortDescription || "");
    setDescription(initialProduct.description || "");
    setBrandName(initialProduct.brandName || "InsaneGenix");
    setProductLine(initialProduct.productLine || "");
    setGoal(initialProduct.goal || "");
    setDietaryPreference(initialProduct.dietaryPreference || "");
    setDietaryType(initialProduct.dietaryType || "UNSPECIFIED");
    setTags(
      Array.isArray(initialProduct.tags)
        ? initialProduct.tags.join(", ")
        : "",
    );
    setProteinType(initialProduct.proteinType || "");
    setCategoryId(
      String(initialProduct.category?.id || initialProduct.categoryId || ""),
    );
    setTypeId(String(initialProduct.type?.id || initialProduct.typeId || ""));
    setSubtypeId(
      String(initialProduct.subtype?.id || initialProduct.subtypeId || ""),
    );
    setStatus(initialProduct.status || "ACTIVE");
    setMetaTitle(initialProduct.metaTitle || "");
    setMetaDescription(initialProduct.metaDescription || "");
    setMetaKeywords(initialProduct.metaKeywords || "");
    setGstRate(
      initialProduct.gstRate !== undefined && initialProduct.gstRate !== null
        ? String(initialProduct.gstRate)
        : "0",
    );

    setServingSize(initialProduct.servingSize || "");
    setServingsPerContainer(
      initialProduct.servingsPerContainer
        ? String(initialProduct.servingsPerContainer)
        : "",
    );
    setProteinPerServing(
      initialProduct.proteinPerServing
        ? String(initialProduct.proteinPerServing)
        : "",
    );
    setBcaaPerServing(
      initialProduct.bcaaPerServing
        ? String(initialProduct.bcaaPerServing)
        : "",
    );
    setEaaPerServing(
      initialProduct.eaaPerServing ? String(initialProduct.eaaPerServing) : "",
    );
    setCaloriesPerServing(
      initialProduct.caloriesPerServing
        ? String(initialProduct.caloriesPerServing)
        : "",
    );
    setProteinPercentage(
      initialProduct.proteinPercentage
        ? String(initialProduct.proteinPercentage)
        : "",
    );

    setIngredients(initialProduct.ingredients || "");
    setHowToUse(initialProduct.howToUse || "");
    setWhenToUse(initialProduct.whenToUse || "");
    setSafetyInformation(initialProduct.safetyInformation || "");
    setAllergenInfo(initialProduct.allergenInfo || "");
    setFssaiLicense(initialProduct.fssaiLicense || "");
    setCountryOfOrigin(initialProduct.countryOfOrigin || "India");
    setMarketedBy(initialProduct.marketedBy || "");
    setManufacturedBy(initialProduct.manufacturedBy || "");
    setSellerName(initialProduct.sellerName || "InsaneGenix");
    setAuthenticityNote(initialProduct.authenticityNote || "");
    setReturnPolicy(initialProduct.returnPolicy || "");
    setKeyBenefitsText(
      Array.isArray(initialProduct.keyBenefits)
        ? initialProduct.keyBenefits.join("\n")
        : "",
    );
    setCertificationsText(
      Array.isArray(initialProduct.certifications)
        ? initialProduct.certifications.join("\n")
        : "",
    );

    setIsTrending(Boolean(initialProduct.isTrending));
    setIsFeatured(Boolean(initialProduct.isFeatured));
    setIsBestSeller(Boolean(initialProduct.isBestSeller));
    setIsNewLaunch(Boolean(initialProduct.isNewLaunch));
    setFreeShipping(Boolean(initialProduct.freeShipping));
    setExistingImages([
      initialProduct.img1 || null,
      initialProduct.img2 || null,
      initialProduct.img3 || null,
      initialProduct.img4 || null,
      initialProduct.img5 || null,
      initialProduct.img6 || null,
    ]);
    setExistingVideo(initialProduct.video || null);

    if (
      Array.isArray(initialProduct.variants) &&
      initialProduct.variants.length
    ) {
      setVariants(
        initialProduct.variants.map((v: any) => ({
          id: v.id,
          sku: v.sku || "",
          flavour: v.flavour || "",
          weightLabel: v.weightLabel || "",
          netQuantity: v.netQuantity || "",
          servings: v.servings ? String(v.servings) : "",
          mrp: v.mrp ? String(v.mrp) : "",
          price: v.price ? String(v.price) : "",
          discountType: v.discountType || "",
          discountValue: v.discountValue ? String(v.discountValue) : "",
          stock: v.stock ? String(v.stock) : "0",
          weightKg: v.weightKg ? String(v.weightKg) : "",
          isDefault: Boolean(v.isDefault),
          image1: v.image1 || null,
          image2: v.image2 || null,
          image3: v.image3 || null,
          image4: v.image4 || null,
          image5: v.image5 || null,
          image6: v.image6 || null,
          video: v.video || null,
          imageFiles: [null, null, null, null, null, null],
          videoFile: null,
        })),
      );
    }

    if (
      Array.isArray(initialProduct.nutritionFacts) &&
      initialProduct.nutritionFacts.length
    ) {
      setNutritionFacts(
        initialProduct.nutritionFacts.map((n: any) => {
          const meta = parseNutritionMeta(n.per);

          return {
            name: n.name || "",
            amount: n.amount ? String(n.amount) : "",
            unit: n.unit || "",
            per: meta.per,
            amountPer100g: meta.amountPer100g,
            rdaPercentage: meta.rdaPercentage,
          };
        }),
      );
    }

  }, [initialProduct]);

  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
  const totalStock = useMemo(
    () =>
      variants.reduce((sum, variant) => sum + Number(variant.stock || 0), 0),
    [variants],
  );

  const updateVariant = (index: number, patch: Partial<Variant>) => {
    setVariants((prev) =>
      prev.map((variant, i) => {
        if (i !== index)
          return patch.isDefault ? { ...variant, isDefault: false } : variant;
        return { ...variant, ...patch };
      }),
    );
  };

  const updateNutrition = (index: number, patch: Partial<NutritionFact>) => {
    setNutritionFacts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const handleImageChange = (index: number, file: File | null) => {
    setImages((prev) => prev.map((img, i) => (i === index ? file : img)));
    if (file)
      setExistingImages((prev) =>
        prev.map((img, i) => (i === index ? null : img)),
      );
  };

  const handleVideoChange = (file: File | null) => {
    setVideo(file);
    if (file) setExistingVideo(null);
  };

  const handleVariantImageChange = (
    variantIndex: number,
    imageIndex: number,
    file: File | null,
  ) => {
    setVariants((prev) =>
      prev.map((variant, index) => {
        if (index !== variantIndex) return variant;

        const imageFiles = variant.imageFiles.map((item, i) =>
          i === imageIndex ? file : item,
        );
        const imageKey = `image${imageIndex + 1}` as
          | "image1"
          | "image2"
          | "image3"
          | "image4"
          | "image5"
          | "image6";

        return {
          ...variant,
          imageFiles,
          ...(file ? { [imageKey]: null } : {}),
        };
      }),
    );
  };

  const handleVariantVideoChange = (variantIndex: number, file: File | null) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex
          ? { ...variant, videoFile: file, ...(file ? { video: null } : {}) }
          : variant,
      ),
    );
  };

  const appendArrayLines = (fd: FormData, key: string, value: string) => {
    fd.append(
      key,
      JSON.stringify(
        value
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      ),
    );
  };

  const submit = async () => {
    if (!title || !categoryId) {
      alert("Product name and category are required");
      return;
    }

    const sellableVariants = variants
      .map((variant) => ({ variant }))
      .filter(({ variant }) => variant.price && variant.weightLabel);
    const defaultVariantIndex = sellableVariants.findIndex(
      ({ variant }) => variant.isDefault,
    );
    const selectedDefaultIndex =
      defaultVariantIndex === -1 ? 0 : defaultVariantIndex;
    const cleanVariants = sellableVariants
      .map(({ variant }, index) => ({
        id: variant.id,
        sku: variant.sku,
        flavour: variant.flavour,
        weightLabel: variant.weightLabel,
        netQuantity: variant.netQuantity,
        servings: variant.servings ? Number(variant.servings) : null,
        mrp: variant.mrp || variant.price,
        price: variant.price,
        discountType: variant.discountType,
        discountValue: variant.discountValue || null,
        stock: Number(variant.stock || 0),
        weightKg: variant.weightKg ? Number(variant.weightKg) : null,
        image1: variant.image1,
        image2: variant.image2,
        image3: variant.image3,
        image4: variant.image4,
        image5: variant.image5,
        image6: variant.image6,
        video: variant.video,
        isDefault: index === selectedDefaultIndex,
      }));

    if (!cleanVariants.length) {
      alert("Add at least one sellable variant with weight and price");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("shortDescription", shortDescription);
    fd.append("description", description);
    fd.append("brandName", brandName);
    fd.append("productLine", productLine);
    fd.append("goal", goal);
    fd.append("dietaryPreference", dietaryPreference);
    fd.append("dietaryType", dietaryType);
    fd.append(
      "tags",
      JSON.stringify(
        Array.from(
          new Set(
            tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          ),
        ),
      ),
    );
    fd.append("proteinType", proteinType);
    fd.append("categoryId", categoryId);
    fd.append("typeId", typeId);
    fd.append("subtypeId", subtypeId);
    fd.append("status", status);
    fd.append("gstRate", gstRate || "0");
    fd.append("metaTitle", metaTitle);
    fd.append("metaDescription", metaDescription);
    fd.append("metaKeywords", metaKeywords);
    fd.append("price", defaultVariant?.price || "0");
    fd.append("weight", defaultVariant?.weightKg || "0.5");
    fd.append("stock", String(totalStock));
    fd.append("variants", JSON.stringify(cleanVariants));
    const factAmount = (names: string[], fallback: string) =>
      nutritionFacts.find((fact) =>
        names.some((name) =>
          fact.name.toLowerCase().includes(name.toLowerCase()),
        ),
      )?.amount || fallback;

    fd.append(
      "nutritionFacts",
      JSON.stringify(
        nutritionFacts
          .filter((fact) => fact.name && fact.amount)
          .map((fact, index) => ({
            name: fact.name,
            amount: fact.amount,
            unit: fact.unit,
            per: buildNutritionMeta(fact, servingSize),
            position: index,
          })),
      ),
    );
    fd.append("servingSize", servingSize);
    fd.append("servingsPerContainer", servingsPerContainer);
    fd.append("proteinPerServing", factAmount(["protein"], proteinPerServing));
    fd.append("bcaaPerServing", factAmount(["bcaa"], bcaaPerServing));
    fd.append("eaaPerServing", factAmount(["eaa"], eaaPerServing));
    fd.append("caloriesPerServing", factAmount(["energy", "calorie"], caloriesPerServing));
    fd.append("proteinPercentage", proteinPercentage);
    fd.append("ingredients", ingredients);
    fd.append("howToUse", howToUse);
    fd.append("whenToUse", whenToUse);
    fd.append("safetyInformation", safetyInformation);
    fd.append("allergenInfo", allergenInfo);
    fd.append("fssaiLicense", fssaiLicense);
    fd.append("countryOfOrigin", countryOfOrigin);
    fd.append("marketedBy", marketedBy);
    fd.append("manufacturedBy", manufacturedBy);
    fd.append("sellerName", sellerName);
    fd.append("authenticityNote", authenticityNote);
    fd.append("returnPolicy", returnPolicy);
    fd.append("isTrending", String(isTrending));
    fd.append("isFeatured", String(isFeatured));
    fd.append("isBestSeller", String(isBestSeller));
    fd.append("isNewLaunch", String(isNewLaunch));
    fd.append("freeShipping", String(freeShipping));
    appendArrayLines(fd, "keyBenefits", keyBenefitsText);
    appendArrayLines(fd, "certifications", certificationsText);
    images.forEach((img, i) => img && fd.append(`image${i + 1}`, img));
    if (video) fd.append("video", video);
    sellableVariants.forEach(({ variant }, cleanIndex) => {
      variant.imageFiles.forEach((file, imageIndex) => {
        if (file) fd.append(`variant_${cleanIndex}_image${imageIndex + 1}`, file);
      });
      if (variant.videoFile) fd.append(`variant_${cleanIndex}_video`, variant.videoFile);
    });

    try {
      setSaving(true);
      if (mode === "edit" && productId)
        await api.patch(`/products/${productId}`, fd);
      else await api.post("/products", fd);
      router.push("/products");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayoutShell
      title={mode === "edit" ? "Edit Supplement" : "Add Supplement"}
      subtitle="Build a detailed PDP with variants, nutrition, compliance, and authenticity"
      onBack={() => router.push("/products")}
      onSave={submit}
      saving={saving}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <Section title="Product Identity">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Product name"
                value={title}
                onChange={setTitle}
                className="md:col-span-2"
              />
              <Field label="Brand" value={brandName} onChange={setBrandName} />
              <Field
                label="Product line"
                value={productLine}
                onChange={setProductLine}
                placeholder="e.g. Hardcore Series"
              />
              <Field
                label="Short description"
                value={shortDescription}
                onChange={setShortDescription}
                className="md:col-span-2"
              />
              <TextArea
                label="Full description"
                value={description}
                onChange={setDescription}
                className="md:col-span-2"
              />
            </div>
          </Section>

          <Section title="Search Metadata">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Meta title"
                value={metaTitle}
                onChange={setMetaTitle}
                placeholder="SEO title shown in search"
                className="md:col-span-2"
              />
              <TextArea
                label="Meta description"
                value={metaDescription}
                onChange={setMetaDescription}
                className="md:col-span-2"
              />
              <Field
                label="Meta tags / keywords"
                value={metaKeywords}
                onChange={setMetaKeywords}
                placeholder="whey protein, creatine, supplement"
                className="md:col-span-2"
              />
            </div>
          </Section>

          <Section title="Catalog Metadata">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="Goal"
                value={goal}
                onChange={setGoal}
                placeholder="Muscle gain, recovery"
              />
              <SelectField
                label="Dietary classification"
                value={dietaryType}
                onChange={setDietaryType}
                placeholder="Select classification"
                options={[
                  { value: "UNSPECIFIED", label: "Not specified" },
                  { value: "VEGETARIAN", label: "Vegetarian" },
                  { value: "NON_VEGETARIAN", label: "Non-vegetarian" },
                  { value: "VEGAN", label: "Vegan" },
                ]}
              />
              <Field
                label="Dietary notes"
                value={dietaryPreference}
                onChange={setDietaryPreference}
                placeholder="Gluten-free, lactose-free"
              />
              <Field
                label="Shop tags"
                value={tags}
                onChange={setTags}
                placeholder="Energy, recovery, performance"
                className="md:col-span-2"
              />
            </div>
          </Section>

          <Section title="Nutrition Facts">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field
                  label="Serving size"
                  value={servingSize}
                  onChange={setServingSize}
                  placeholder="1 scoop (33 g)"
                />
                <Field
                  label="Servings / container"
                  type="number"
                  value={servingsPerContainer}
                  onChange={setServingsPerContainer}
                  placeholder="30"
                />
                <Field
                  label="Protein type"
                  value={proteinType}
                  onChange={setProteinType}
                  placeholder="Whey isolate"
                />
              </div>

              <div className="overflow-hidden rounded-md border border-white/10">
                <div className="grid grid-cols-12 gap-3 bg-white/5 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span className="col-span-12 md:col-span-3">Nutrient</span>
                  <span className="col-span-6 md:col-span-2">Amt per 100g</span>
                  <span className="col-span-6 md:col-span-2">Amt per serving</span>
                  <span className="col-span-6 md:col-span-2">Unit</span>
                  <span className="col-span-6 md:col-span-2">%RDA / serving</span>
                  <span className="hidden md:block md:col-span-1" />
                </div>

                <div className="divide-y divide-white/10">
                  {nutritionFacts.map((fact, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-3 px-3 py-3"
                    >
                      <Field
                        label="Nutrient"
                        value={fact.name}
                        onChange={(v) => updateNutrition(index, { name: v })}
                        placeholder="Protein"
                        className="col-span-12 md:col-span-3"
                      />
                      <Field
                        label="Amt per 100g"
                        type="number"
                        value={fact.amountPer100g}
                        onChange={(v) =>
                          updateNutrition(index, { amountPer100g: v })
                        }
                        placeholder="90"
                        className="col-span-6 md:col-span-2"
                      />
                      <Field
                        label="Amt per serving"
                        type="number"
                        value={fact.amount}
                        onChange={(v) => updateNutrition(index, { amount: v })}
                        placeholder="29.7"
                        className="col-span-6 md:col-span-2"
                      />
                      <Field
                        label="Unit"
                        value={fact.unit}
                        onChange={(v) => updateNutrition(index, { unit: v })}
                        placeholder="g"
                        className="col-span-6 md:col-span-2"
                      />
                      <Field
                        label="%RDA / serving"
                        type="number"
                        value={fact.rdaPercentage}
                        onChange={(v) =>
                          updateNutrition(index, { rdaPercentage: v })
                        }
                        placeholder="55"
                        className="col-span-6 md:col-span-2"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNutritionFacts((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="col-span-12 self-end rounded-md border border-white/10 bg-white/5 px-3 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:bg-white/10 hover:text-red-500 md:col-span-1"
                      >
                        <Trash2 size={14} className="mx-auto" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNutritionFacts((prev) => [...prev, emptyNutrition()])
                }
                className="admin-chip"
              >
                + Add Nutrient
              </button>
            </div>
          </Section>

          <Section title="Variants">
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="rounded-md border border-white/5 bg-white/5 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <label className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-300">
                      <input
                        type="radio"
                        checked={variant.isDefault}
                        onChange={() =>
                          updateVariant(index, { isDefault: true })
                        }
                        className="accent-brandRed"
                      />
                      Default PDP variant
                    </label>
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setVariants((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-md bg-white/5 border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-white/10 hover:text-white"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Field
                      label="SKU"
                      value={variant.sku}
                      onChange={(v) => updateVariant(index, { sku: v })}
                    />
                    <Field
                      label="Flavour"
                      value={variant.flavour}
                      onChange={(v) => updateVariant(index, { flavour: v })}
                    />
                    <Field
                      label="Weight label"
                      value={variant.weightLabel}
                      onChange={(v) => updateVariant(index, { weightLabel: v })}
                      placeholder="1 kg"
                    />
                    <Field
                      label="Net quantity"
                      value={variant.netQuantity}
                      onChange={(v) => updateVariant(index, { netQuantity: v })}
                    />
                    <Field
                      label="MRP"
                      type="number"
                      value={variant.mrp}
                      onChange={(v) => updateVariant(index, { mrp: v })}
                    />
                    <Field
                      label="Selling price"
                      type="number"
                      value={variant.price}
                      onChange={(v) => updateVariant(index, { price: v })}
                    />
                    <Field
                      label="Stock"
                      type="number"
                      value={variant.stock}
                      onChange={(v) => updateVariant(index, { stock: v })}
                    />
                    <Field
                      label="Weight kg"
                      type="number"
                      value={variant.weightKg}
                      onChange={(v) => updateVariant(index, { weightKg: v })}
                    />
                    <Field
                      label="Servings"
                      type="number"
                      value={variant.servings}
                      onChange={(v) => updateVariant(index, { servings: v })}
                    />
                    <SelectField
                      label="Discount type"
                      value={variant.discountType}
                      onChange={(v) =>
                        updateVariant(index, { discountType: v })
                      }
                      options={["", "PERCENT", "FLAT"]}
                    />
                    <Field
                      label="Discount value"
                      type="number"
                      value={variant.discountValue}
                      onChange={(v) =>
                        updateVariant(index, { discountValue: v })
                      }
                    />
                  </div>
                  <div className="mt-4 rounded-md border border-white/5 bg-black/20 p-3">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-300">
                        Variant media
                      </p>
                      <p className="text-[10px] font-bold text-zinc-500">
                        Used when this variant is selected
                      </p>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {[0, 1, 2, 3, 4, 5].map((mediaIndex) => {
                        const imageKey = `image${mediaIndex + 1}` as
                          | "image1"
                          | "image2"
                          | "image3"
                          | "image4"
                          | "image5"
                          | "image6";
                        const preview = variant.imageFiles[mediaIndex]
                          ? URL.createObjectURL(variant.imageFiles[mediaIndex]!)
                          : imageUrl(variant[imageKey]);

                        return (
                          <label
                            key={imageKey}
                            className="relative aspect-square cursor-pointer overflow-hidden rounded-md border border-dashed border-white/10 bg-white/5"
                          >
                            {preview ? (
                              <img
                                src={preview}
                                alt={`${variant.flavour || "Variant"} media`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-zinc-500">
                                <ImagePlus size={18} />
                              </span>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleVariantImageChange(
                                  index,
                                  mediaIndex,
                                  e.target.files?.[0] || null,
                                )
                              }
                            />
                          </label>
                        );
                      })}
                    </div>
                    <label className="mt-2 flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-white/10 bg-white/5">
                      {variant.videoFile ? (
                        <video
                          src={URL.createObjectURL(variant.videoFile)}
                          className="h-full w-full object-cover"
                          muted
                          controls
                        />
                      ) : variant.video ? (
                        <video
                          src={mediaUrl(variant.video)}
                          className="h-full w-full object-cover"
                          muted
                          controls
                        />
                      ) : (
                        <span className="flex flex-col items-center justify-center gap-2 text-zinc-500">
                          <Video size={22} />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Variant video
                          </span>
                        </span>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) =>
                          handleVariantVideoChange(
                            index,
                            e.target.files?.[0] || null,
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setVariants((prev) => [...prev, emptyVariant()])}
                className="inline-flex items-center gap-2 rounded-md bg-brandBlack px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-brandRed"
              >
                <Plus size={16} /> Add Variant
              </button>
            </div>
          </Section>

          <Section title="Usage, Benefits & Safety">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextArea
                label="Key benefits, one per line"
                value={keyBenefitsText}
                onChange={setKeyBenefitsText}
              />
              <TextArea
                label="Certifications, one per line"
                value={certificationsText}
                onChange={setCertificationsText}
              />
              <TextArea
                label="Ingredients"
                value={ingredients}
                onChange={setIngredients}
              />
              <TextArea
                label="How to use"
                value={howToUse}
                onChange={setHowToUse}
              />
              <TextArea
                label="When to use"
                value={whenToUse}
                onChange={setWhenToUse}
              />
              <TextArea
                label="Safety information"
                value={safetyInformation}
                onChange={setSafetyInformation}
              />
              <TextArea
                label="Allergen info"
                value={allergenInfo}
                onChange={setAllergenInfo}
              />
              <TextArea
                label="Authenticity note"
                value={authenticityNote}
                onChange={setAuthenticityNote}
              />
            </div>
          </Section>
        </div>

        <aside className="xl:col-span-4 space-y-6">
          <Section title="Catalog Path">
            <div className="space-y-4">
              <SelectField
                label="Category"
                value={categoryId}
                onChange={(v) => {
                  setCategoryId(v);
                  setTypeId("");
                  setSubtypeId("");
                }}
                options={categories.map((c) => ({
                  value: String(c.id),
                  label: c.name,
                }))}
                placeholder="Select category"
              />
              <SelectField
                label="Type (optional)"
                value={typeId}
                onChange={(v) => {
                  setTypeId(v);
                  setSubtypeId("");
                }}
                options={types.map((t) => ({
                  value: String(t.id),
                  label: t.name,
                }))}
                placeholder={categoryId ? "No type" : "Select category first"}
                disabled={!categoryId}
              />
              <SelectField
                label="Subtype (optional)"
                value={subtypeId}
                onChange={setSubtypeId}
                options={subtypes.map((s) => ({
                  value: String(s.id),
                  label: s.name,
                }))}
                placeholder={typeId ? "No subtype" : "Select type first"}
                disabled={!typeId}
              />
              <SelectField
                label="Status"
                value={status}
                onChange={setStatus}
                options={["ACTIVE", "DRAFT", "ARCHIVED"]}
              />
              <Field
                label="GST rate %"
                type="number"
                value={gstRate}
                onChange={setGstRate}
                placeholder="18"
              />
            </div>
          </Section>

          <Section title="Product Media">
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const preview = images[i]
                  ? URL.createObjectURL(images[i]!)
                  : imageUrl(existingImages[i]);
                return (
                  <label
                    key={i}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-md border border-dashed border-white/10 bg-white/5"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Product media"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-zinc-500">
                        <ImagePlus size={24} />
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(i, e.target.files?.[0] || null)
                      }
                    />
                  </label>
                );
              })}
            </div>
            <label className="mt-3 flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-white/10 bg-white/5">
              {video ? (
                <video
                  src={URL.createObjectURL(video)}
                  className="h-full w-full object-cover"
                  muted
                  controls
                />
              ) : existingVideo ? (
                <video
                  src={mediaUrl(existingVideo)}
                  className="h-full w-full object-cover"
                  muted
                  controls
                />
              ) : (
                <span className="flex flex-col items-center justify-center gap-2 text-zinc-500">
                  <Video size={26} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Product video
                  </span>
                </span>
              )}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleVideoChange(e.target.files?.[0] || null)}
              />
            </label>
          </Section>

          <Section title="Badges & Shipping">
            <div className="space-y-3">
              <Toggle
                label="Trending"
                checked={isTrending}
                onChange={setIsTrending}
              />
              <Toggle
                label="Featured"
                checked={isFeatured}
                onChange={setIsFeatured}
              />
              <Toggle
                label="Best seller"
                checked={isBestSeller}
                onChange={setIsBestSeller}
              />
              <Toggle
                label="New launch"
                checked={isNewLaunch}
                onChange={setIsNewLaunch}
              />
              <Toggle
                label="Free shipping"
                checked={freeShipping}
                onChange={setFreeShipping}
              />
            </div>
          </Section>

          <Section title="Compliance">
            <div className="space-y-4">
              <Field
                label="FSSAI license"
                value={fssaiLicense}
                onChange={setFssaiLicense}
              />
              <Field
                label="Country of origin"
                value={countryOfOrigin}
                onChange={setCountryOfOrigin}
              />
              <Field
                label="Marketed by"
                value={marketedBy}
                onChange={setMarketedBy}
              />
              <Field
                label="Manufactured by"
                value={manufacturedBy}
                onChange={setManufacturedBy}
              />
              <Field
                label="Seller name"
                value={sellerName}
                onChange={setSellerName}
              />
              <TextArea
                label="Return policy"
                value={returnPolicy}
                onChange={setReturnPolicy}
              />
            </div>
          </Section>

          <div className="rounded-md bg-brandBlack p-5 text-white">
            <div className="mb-4 flex items-center gap-3">
              <Image
                src="/insanegenix/logo/favicon.svg"
                alt=""
                width={26}
                height={26}
              />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Catalog Summary
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Summary label="Variants" value={variants.length} />
              <Summary label="Stock" value={totalStock} />
              <Summary
                label="Default price"
                value={`₹${defaultVariant?.price || 0}`}
              />
              <Summary label="GST" value={`${gstRate || 0}%`} />
              <Summary label="Goal" value={goal || "Not set"} />
              <Summary
                label="Diet"
                value={dietaryType.replaceAll("_", " ")}
              />
            </div>
          </div>
        </aside>
      </div>
    </AdminLayoutShell>
  );
}

function AdminLayoutShell({
  title,
  subtitle,
  onBack,
  onSave,
  saving,
  children,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  onSave: () => void;
  saving: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 rounded-md bg-brandBlack p-5 text-white md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md bg-white/10 p-3 text-white hover:bg-white/20"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brandRed px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              <BadgeCheck size={14} /> InsaneGenix Catalog
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brandRed px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-brandBlack disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving" : "Save Product"}
        </button>
      </div>
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-surface rounded-md p-5">
      <h2 className="mb-5 border-b border-white/10 pb-3 text-[11px] font-black uppercase tracking-[0.22em] text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="admin-label mb-2 block">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="admin-field"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="admin-label mb-2 block">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="admin-field resize-y leading-relaxed"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
}) {
  const normalized = options.map((option) =>
    typeof option === "string"
      ? { value: option, label: option || "None" }
      : option,
  );
  return (
    <div>
      <label className="admin-label mb-2 block">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-field"
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {normalized.map((option: any) => (
          <option key={option.value || "none"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">
        {label}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-brandRed"
      />
    </label>
  );
}

function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-white/5 p-3">
      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className="mt-1 truncate font-black text-white">{value}</p>
    </div>
  );
}
