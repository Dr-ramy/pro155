"use client";

import ContentSection from "@/components/mainpage/ContentSection";
import CarouselSlider from "@/components/mainpage/CarouselSlider";
import QuickLinksDialog from "@/components/mainpage/QuickLinksDialog";

import Link from "next/link";
import {
  FaSignInAlt,
  FaFacebookF,
  FaWhatsapp,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { siteContent } from "@/components/mainpage/site.content";

export default function MainPage() {
  const { data: session } = useSession();
  const c = siteContent.home;

  // ===== Social (always inline, never wraps to next line) =====
  const SocialButtons = (
    <div className="flex items-center gap-2 flex-nowrap">
      <Button
        asChild
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 shrink-0"
      >
        <a
          href={c.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebookF className="h-4 w-4" />
        </a>
      </Button>

      <Button
        asChild
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full border-green-600 text-green-600 hover:bg-green-50 shrink-0"
      >
        <a
          href={c.social.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );

  // ===== Auth (always inline, never stacks) =====
  const AuthButtons = !session ? (
    <Button asChild variant="outline" size="sm" className="shrink-0">
      <Link href="/login" className="flex items-center gap-2">
        <FaSignInAlt className="h-4 w-4" />
        <span>{c.labels.login}</span>
      </Link>
    </Button>
  ) : (
    <div className="flex items-center gap-2 flex-nowrap">
      <Button asChild variant="outline" size="sm" className="shrink-0">
        <Link href={session.user.groupid === 10 ? "/admin" : "/content"}>
          <div className="flex items-center gap-2">
            <FaUserShield className="h-4 w-4" />
            <span>
              {session.user.groupid === 10 ? c.labels.admin : c.labels.profile}
            </span>
          </div>
        </Link>
      </Button>

      <Button
        onClick={() => signOut()}
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 border-red-600 text-red-600 hover:bg-red-50"
        aria-label={c.labels.logout}
      >
        <FaSignOutAlt className="h-4 w-4" />
      </Button>
    </div>
  );

  // ===== QuickLinks (full sidebar width, stacked) =====
  const QuickLinks = (
    <nav className="w-full space-y-2" aria-label="أقسام الصفحة" dir="rtl">
      {c.sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className="block w-full rounded-xl border px-4 py-3 text-sm sm:text-base hover:bg-muted transition text-right"
        >
          {s.label}
        </a>
      ))}
    </nav>
  );

  // ===== Shared bar: Social + Auth always on the same line =====
  const TopBar = (
    <div className="flex items-center justify-between gap-3 flex-nowrap overflow-x-auto">
      <div className="shrink-0">{SocialButtons}</div>
      <div className="shrink-0">{AuthButtons}</div>
    </div>
  );

  // =========================
  // Variant: NEWS
  // =========================
  if (c.variant === "news") {
    return (
      <div className={`${c.layout.backgroundClass} py-6`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main */}
            <div className="lg:col-span-9 space-y-4">
              <p
                className="custom-font text-sm sm:text-base md:text-lg font-bold warep-break-words text-center"
                dir="rtl"
                lang="ar"
              >
                {c.title}
              </p>

              {/* Social + Auth on same line (all screen sizes) */}
              {TopBar}

              <CarouselSlider />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-3 lg:sticky lg:top-6 space-y-4">
              <div className="rounded-2xl border p-4 bg-slate-50 lg:min-h-[calc(100vh-96px)]">

                <QuickLinksDialog />              
              </div>
            </aside>
          </div>

        </div>
      </div>
    );
  }

  // =========================
  // Variant: CLASSIC
  // =========================
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="text-center mb-4 space-y-4">
        <p
          className="custom-font text-xl sm:text-2xl md:text-3xl font-bold warep-break-words"
          dir="rtl"
          lang="ar"
        >
          {c.title}
        </p>

        {/* Social + Auth on same line (all screen sizes) */}
        {TopBar}
      </header>

      <CarouselSlider />
      <div className="mt-4">
        <ContentSection />
      </div>
    </div>
  );
}
