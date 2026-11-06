// MainVideoServer.tsx (Server Component)
import { auth } from "@/lib/auth";
import { getLessonBundle } from "../groups/LessonData"; // عدّل المسار حسب مشروعك
import VideoGallery from "./MainVideo";

export default async function MainVideoServer() {
  const session = await auth();
  const groupId = session?.user?.groupid;

  const content = getLessonBundle(groupId);

  return <VideoGallery groupId={groupId} content={content} />;
}
