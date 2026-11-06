import type { ButtonItem } from "@/components/content/mainitems/types";

export const lessonFive = {
  items: <ButtonItem[]>
[
    //عشان تضيف فيديو من اليوتيوب خد الرابط من embed
    { type: "button", id: "5vid0", text: "الأهداف", icon: "intro", time: "" },
    { type: "button", id: "5act1", text: " التهيئة", icon: "activity" },              
   // { type: "modal", id: "book4", text: "    ", icon: "intro" },
    { type: "button", id: "5vid1", text: "  الحياة الثقافية والفكرية   ", icon: "video" },
    { type: "button", id: "5vid2", text: " الثقافة العربية قبل الإسلام    ", icon: "video" },
    { type: "button", id: "5vid3", text: " الادب والعلوم  ", icon: "video" },
    { type: "button", id: "5act2", text: " نشاط ", icon: "activity" },
    { type: "button", id: "5vid4", text: "   أغراض الشعر العربي   ", icon: "video" },
    { type: "button", id: "5act3", text: " نشاط ", icon: "activity" },
    { type: "button", id: "5vid5", text: " العلوم التي برع فيها العرب   ", icon: "video" },
    { type: "button", id: "5vid6", text: "  الفنون والعمارة   ", icon: "video" },
    { type: "button", id: "5act4", text: " نشاط ", icon: "activity" },
    { type: "button", id: "5act5", text: " تقويم", icon: "activity" },
],

  videoMap: 
  {
    "5vid0": "/videos/vid5/vid0.mp4",
    "5vid1": "/videos/vid5/vid1.mp4",
    "5vid2": "/videos/vid5/vid2.mp4",
    "5vid3": "/videos/vid5/vid3.mp4",
    "5vid4": "/videos/vid5/vid4.mp4",
    "5vid5": "/videos/vid5/vid5.mp4",
    "5vid6": "/videos/vid5/vid6.mp4",
    "5vid7": "/videos/vid5/vid7.mp4",
    "5vid8": "/videos/vid5/vid8.mp4",
  },

  formLinks: 
  {
    "5act1":   " https://forms.gle/GCXpxNg85fW6ZfEV6 ",
    "5act2":   " https://forms.gle/NJUKpVQbRsFNePtt6 ",
    "5act3":   " https://forms.gle/rJ1bTDuMgonjx4iT7 ",
    "5act4":   " https://forms.gle/EwjxpJDsV4GGqdQx6 ",
    "5act5":   " https://forms.gle/UyD2ZsXydXMNPVw39 ",
    "5act6":   "  ",
    "5act7":   "  ",
    "5act8":   "  ",
    "5act9":   "  ",
    "5act10":  "  ",
    "5act11":  "  ",
    "5act12":  "  ",
  },
}