import Link from "next/link";
import { auth } from "@/lib/auth";
import ClientDialogWrapper from "@/components/layout/ClientDialogWrapper";
import { Button } from "@/components/ui/button";
import { FaHome, FaUserShield } from "react-icons/fa";

type HeaderProps = {
  courseTitle: string;
};

export default async function Header({ courseTitle }: HeaderProps) {
  const session = await auth();

  return (
    <header className="w-full bg-muted shadow px-3 sm:px-4 rounded-xl mb-3 sm:mb-4">
      <div className="flex flex-wrap items-center justify-between gap-1">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-9 w-12  hover:bg-white">
              <FaHome className="text-5xl text-red-800" />
            </Button>
          </Link>

          <div className="min-w-0">
            <div className="text-base sm:text-xl font-semibold text-gray-800 truncate">
              {courseTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ClientDialogWrapper />

          {session?.user?.name && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-sm text-gray-600">
                مرحباً، {session.user.name}
              </span>

              {session?.user?.groupid === 10 && (
                <Link href="/admin">
               <Button  className="bg-transparent  hover:bg-white flex items-center gap-1 text-xl" > <FaUserShield className="text-3xl text-red-900" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
