// LessonData.ts
import type { ButtonItem } from "@/components/content/mainitems/types";
import { lessonOne }     from "./lessonOne";
import { lessonTwo }     from "./lessonTwo";
import { lessonThree }   from "./lessonThree";
import { lessonFour }    from "./lessonFour";
import { lessonFive }    from "./lessonFive";
import { lessonSix }     from "./lessonSix";
import { lessonSeven }   from "./lessonSeven";
import { lessonEight }   from "./lessonEight";
import {
  getCurriculumMeta,
  type SidebarExtraItem,
  type SidebarExtraAction,
  type CurriculumMeta,
} from "./PrePost";
import type { ModalSpec, ModalKey } from "./PrePost"; 

export type VideoMap = Record<string, string>;
export type FormLinksMap = Record<string, string>;

// ✅ الشكل النهائي الذي سيستهلكه الـ UI
export type SidebarContent = {
  units: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      items: ButtonItem[];
    }>;
  }>;

  beforeLearningItems: SidebarExtraItem[];
  afterLearningItems: SidebarExtraItem[];
  modals: ModalSpec[];

  videoMap: VideoMap;
  formLinks: FormLinksMap;
};

// ✅ لإعادة استخدام الأنواع في ملفات أخرى بدون استيراد PrePost مباشرة
export type { SidebarExtraItem, SidebarExtraAction };

// =========================
// ربط lesson keys بالـ modules (بدون عناوين)
// =========================
type LessonModule = {
  items: ButtonItem[];
  videoMap: VideoMap;
  formLinks: FormLinksMap;
};

const LESSONS_REGISTRY: Record<string, LessonModule> = {
  
  lesson_one:   {items: lessonOne.items,videoMap: lessonOne.videoMap,formLinks: lessonOne.formLinks,},
  lesson_two:    { items: lessonTwo.items, videoMap: lessonTwo.videoMap, formLinks: lessonTwo.formLinks },
  lesson_three:  { items: lessonThree.items, videoMap: lessonThree.videoMap, formLinks: lessonThree.formLinks },
  lesson_four:   { items: lessonFour.items, videoMap: lessonFour.videoMap, formLinks: lessonFour.formLinks },
  lesson_five:   { items: lessonFive.items, videoMap: lessonFive.videoMap, formLinks: lessonFive.formLinks },
  lesson_six:    { items: lessonSix.items, videoMap: lessonSix.videoMap, formLinks: lessonSix.formLinks },
  lesson_seven:  { items: lessonSeven.items, videoMap: lessonSeven.videoMap, formLinks: lessonSeven.formLinks },
  lesson_eight:  { items: lessonEight.items, videoMap: lessonEight.videoMap, formLinks: lessonEight.formLinks },
};

// =========================
// تجميع الـ maps حسب ما تم اختياره في المنهج (CurriculumMeta)
// =========================
function mergeMaps(lessonIds: string[]) {
  const videoMap: VideoMap = {};
  const formLinks: FormLinksMap = {};

  for (const id of lessonIds) {
    const mod = LESSONS_REGISTRY[id];
    if (!mod) continue;
    Object.assign(videoMap, mod.videoMap);
    Object.assign(formLinks, mod.formLinks);
  }

  return { videoMap, formLinks };
}

// ✅ الدالة الوحيدة التي سيستعملها السيرفر لاختيار محتوى الجروب
export function getLessonBundle(
  groupId: string | number | undefined
): SidebarContent {
  const meta: CurriculumMeta = getCurriculumMeta(groupId);

  // كل lesson ids المطلوبة في هذا الجروب
  const lessonIds = meta.units.flatMap((u) => u.lessons.map((l) => l.id));
  const { videoMap, formLinks } = mergeMaps(lessonIds);

  return {
    units: meta.units.map((u) => ({
      id: u.id,
      title: u.title,
      lessons: u.lessons.map((l) => {
        const mod = LESSONS_REGISTRY[l.id];
        return {
          id: l.id,
          title: l.title,
          items: mod?.items ?? [],
        };
      }),
    })),

    beforeLearningItems: meta.beforeLearningItems,
    afterLearningItems: meta.afterLearningItems,

    videoMap,
    formLinks,
    modals: meta.modals,
  };
}
