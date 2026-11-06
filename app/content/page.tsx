import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import VideoGallery from "@/components/content/mainitems/MainVideo";
import Header from "@/components/layout/Header";
import { getLessonBundle } from "@/components/content/groups/LessonData";

type SessionUserWithGroup = { groupid?: number | string | null };

export default async function ContentPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = session.user as unknown as SessionUserWithGroup;
  const groupid = Number(user.groupid ?? 0);

  const allowedGroups = [1, 2, 3, 10];
  if (!allowedGroups.includes(groupid)) {
    return (
      <main className="min-h-dvh bg-white px-4 py-6">
        <p className="text-red-600">أنت غير مصرح لك بمشاهدة هذا المحتوى.</p>
      </main>
    );
  }

  const content = getLessonBundle(groupid);

return (
  <div className="min-h-dvh bg-white overflow-x-hidden">
    <div className="mx-auto w-full max-w-full min-w-0 px-2 sm:px-4 md:px-6 py-2">
      <Header courseTitle= "  " /> 
      <VideoGallery groupId={groupid} content={content} />
    </div>
  </div>
);
}
