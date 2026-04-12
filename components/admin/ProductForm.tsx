"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type InitialProduct = {
  _id?: string;
  slug: string;
  categoryId?: string;
  brand: string;
  nameFr: string;
  nameAr: string;
  descFr: string;
  descAr: string;
  priceDzd: number;
  stock: number;
  images: string[];
  featured: boolean;
  specs: Record<string, any>;
};

export function ProductForm({ initial }: { initial?: InitialProduct }) {
  const router = useRouter();
  const categories = useQuery(api.categories.list, {});
  const create = useMutation(api.products.create);
  const update = useMutation(api.products.update);

  const [form, setForm] = useState<InitialProduct>(
    initial ?? {
      slug: "",
      categoryId: "",
      brand: "",
      nameFr: "",
      nameAr: "",
      descFr: "",
      descAr: "",
      priceDzd: 0,
      stock: 0,
      images: [],
      featured: false,
      specs: { type: "other" },
    }
  );
  const [imagesText, setImagesText] = useState(form.images.join("\n"));
  const [specsText, setSpecsText] = useState(JSON.stringify(form.specs, null, 2));
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const images = imagesText.split("\n").map((s) => s.trim()).filter(Boolean);
      let specs: any = {};
      try {
        specs = JSON.parse(specsText);
      } catch {
        alert("Invalid specs JSON");
        setSaving(false);
        return;
      }
      if (initial?._id) {
        await update({
          id: initial._id as any,
          patch: { ...form, images, specs },
        });
      } else {
        await create({
          slug: form.slug,
          categoryId: form.categoryId as any,
          brand: form.brand,
          nameFr: form.nameFr,
          nameAr: form.nameAr,
          descFr: form.descFr,
          descAr: form.descAr,
          priceDzd: form.priceDzd,
          stock: form.stock,
          images,
          featured: form.featured,
          specs,
        });
      }
      router.push("/admin/products");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="p-8 space-y-6 max-w-4xl">
      <h1 className="text-4xl font-black tracking-tighter uppercase">
        {initial ? "Edit Product" : "New Product"}
      </h1>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Slug</Label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Brand</Label>
          <Input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Category</Label>
          <Select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            <option value="">—</option>
            {categories?.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.nameFr}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Name (FR)</Label>
          <Input
            value={form.nameFr}
            onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Name (AR)</Label>
          <Input
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            required
            dir="rtl"
          />
        </div>
        <div>
          <Label>Desc (FR)</Label>
          <Textarea
            rows={3}
            value={form.descFr}
            onChange={(e) => setForm({ ...form, descFr: e.target.value })}
          />
        </div>
        <div>
          <Label>Desc (AR)</Label>
          <Textarea
            rows={3}
            value={form.descAr}
            onChange={(e) => setForm({ ...form, descAr: e.target.value })}
            dir="rtl"
          />
        </div>
        <div>
          <Label>Price (DZD)</Label>
          <Input
            type="number"
            value={form.priceDzd}
            onChange={(e) => setForm({ ...form, priceDzd: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Image URLs (one per line)</Label>
          <Textarea
            rows={4}
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Specs (JSON)</Label>
          <Textarea
            rows={8}
            className="font-mono"
            value={specsText}
            onChange={(e) => setSpecsText(e.target.value)}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-on-surface-variant text-xs font-bold uppercase"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
