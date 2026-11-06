// types.ts

export type ButtonItem = {
  type: "button" | "ai" | "modal";
  id: string
  text: string
  icon?: string
  time?: string
  url?: string;
}


export type VideoItem = ButtonItem & {
  src: string
  title: string
}
