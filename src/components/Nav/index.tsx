"use client";
import Link from "next/link";

import { Home, Clock } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/فنجان",
    icon: Home,
    label: "الواجهة",
  },
  {
    href: "/recent",
    icon: Clock,
    label: "اخر ماتم تشغيلة",
  },
];

const Nav = () => {
  const path = usePathname();

  return (
    <nav className="fixed space-y-2 max-w-[19rem] mt-2">
      <ul className="space-y-2">
        {navItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-right transition-colors  ${
                decodeURIComponent(path) === item.href ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <item.icon className="size-5 min-w-5" />
              <span className="hidden sm:block">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
