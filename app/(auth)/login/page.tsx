"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PixelGrid } from "@/components/ui/PixelGrid";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0A0A0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <PixelGrid opacity={0.05} />

      {/* Left blue bar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          backgroundColor: "#2D2DFF",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, width: 420 }}>
        {/* Logo */}
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <Image
            src="/images/EDT-lockup-dark.svg"
            alt="EDT"
            width={140}
            height={32}
            priority
          />
          <p
            style={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2D2DFF",
              marginTop: 8,
            }}
          >
            SLIDEBUILDER
          </p>
        </div>

        {/* Login card */}
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            backgroundColor: "#111",
          }}
        >
          {/* Title bar */}
          <div
            style={{
              height: 32,
              backgroundColor: "#0A0A0A",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 6,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 9999,
                  display: "block",
                }}
              />
            ))}
            <span
              style={{
                fontFamily: '"Space Grotesk", monospace',
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#555",
                marginLeft: 4,
              }}
            >
              STAFF_LOGIN.EXE
            </span>
          </div>

          <form onSubmit={handleLogin} style={{ padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
            <Input
              label="Email"
              type="email"
              placeholder="you@weareedt.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p
                style={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontSize: 13,
                  color: "#f87171",
                  margin: 0,
                }}
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              arrow
              className="w-full justify-center mt-2"
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </Button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 12,
            color: "#444",
            marginTop: 24,
          }}
        >
          No account?{" "}
          <a
            href="/register"
            style={{ color: "#2D2DFF", textDecoration: "none", fontWeight: 600 }}
          >
            Register
          </a>
          {" "}· EDT internal tool — staff access only
        </p>
      </div>
    </div>
  );
}
