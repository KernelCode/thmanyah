"use client";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export type MenuItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

const MenuClick = ({ items }: { items?: MenuItem[] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (event.target instanceof Element && !event.target.closest(".menu-container")) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative menu-container">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 hover:bg-200 rounded-full transition-colors cursor-pointer"
      >
        <MoreHorizontal className="size-5 min-w-5 text-gray-400" />
      </button>
      {isMenuOpen && (
        <div className="absolute left-0 w-max top-8 text-start  bg-100 border border-200 rounded-lg shadow-lg z-10">
          <ul className="py-2">
            {items?.map((item, index) =>
              item.href ? (
                <li
                  key={index}
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-200 cursor-pointer"
                >
                  <Link
                    prefetch={false}
                    href={item.href}
                    className="block  py-2 text-gray-400 hover:text-white hover:bg-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li
                  key={index}
                  onClick={() => {
                    item.onClick?.();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-200 cursor-pointer"
                >
                  {item.label}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MenuClick;
