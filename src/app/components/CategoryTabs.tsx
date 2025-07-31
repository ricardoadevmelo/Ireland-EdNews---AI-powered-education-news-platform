"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "../constants/categories";

export default function CategoryTabs() {
  const pathname = usePathname();
  // Extract slug from path, e.g., '/category/slug'
  const parts = pathname.split('/');
  const current = parts[1] === 'category' && parts[2] ? parts[2] : '';
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map(({ slug, label }) => (
        <Link
          key={slug}
          href={slug ? `/category/${slug}` : '/'}
          className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
            current === slug
              ? "bg-emerald-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
