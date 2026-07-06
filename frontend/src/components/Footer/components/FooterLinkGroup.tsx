import React from "react";
import Link from "next/link";

interface LinkItem {
  label: string;
  href: string;
}

interface FooterLinkGroupProps {
  title: string;
  links: LinkItem[];
  children?: React.ReactNode;
}

export default function FooterLinkGroup({ title, links, children }: FooterLinkGroupProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[#FFD100] font-bold text-sm tracking-wide uppercase mb-2">{title}</h4>
      <ul className="flex flex-col gap-3">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="text-[#999999] hover:text-white transition-colors text-sm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* Optional Contact info slot at bottom */}
      {children}
    </div>
  );
}
