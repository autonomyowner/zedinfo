import Image from "next/image";
import { Link } from "@/lib/i18n/routing";

const categories = [
  { label: "Laptops", slug: "laptops", image: "/categories/categories/cpu.jpg" },
  { label: "GPU", slug: "graphics-cards", image: "/categories/categories/gpu.jpg" },
  { label: "CPU", slug: "processors", image: "/categories/categories/cpu.jpg" },
  { label: "Motherboard", slug: "motherboards", image: "/categories/categories/motherboard.jpg" },
  { label: "RAM", slug: "ram", image: "/categories/categories/ram.jpg" },
  { label: "Storage", slug: "storage", image: "/categories/categories/storage.jpg" },
  { label: "PSU", slug: "power-supplies", image: "/categories/categories/psu.jpg" },
  { label: "Cases", slug: "cases", image: "/categories/categories/case.jpg" },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/shop/${cat.slug}`}
          className="group rounded-2xl border border-outline-variant/30 overflow-hidden bg-surface-container transition-shadow hover:shadow-card-hover"
        >
          <div className="aspect-video overflow-hidden">
            <Image
              src={cat.image}
              alt={cat.label}
              width={400}
              height={225}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <p className="py-3 text-center text-sm font-semibold text-on-surface transition-colors group-hover:text-[#0ea5e9]">
            {cat.label}
          </p>
        </Link>
      ))}
    </div>
  );
}
