"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "DECKS" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      style={{
        width: 220,
        backgroundColor: "#0A0A0A",
        borderRight: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Image
          src="/images/EDT-lockup-dark.svg"
          alt="EDT"
          width={120}
          height={28}
          priority
        />
        <div
          style={{
            marginTop: 6,
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#2D2DFF",
          }}
        >
          SLIDEBUILDER
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "10px 20px",
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: active ? "#2D2DFF" : "#8C8C8C",
                borderLeft: active ? "2px solid #2D2DFF" : "2px solid transparent",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        style={{
          margin: "16px",
          padding: "8px 12px",
          backgroundColor: "transparent",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "#555",
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          textAlign: "left",
          borderRadius: 0,
          transition: "color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#555";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
        }}
      >
        SIGN OUT
      </button>
    </aside>
  );
}
