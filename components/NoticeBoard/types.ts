export interface Stroke {
  color: string;
  size: number;
  points: [number, number][]; // [x, y] normalized to [0, 1] relative to paper canvas
}

export type PaperStatus = "pile" | "board";

export interface Paper {
  id: string;
  strokes: Stroke[];
  x: number; // normalized center x (0 to 1) relative to board width
  y: number; // normalized center y (0 to 1) relative to board height
  rotation: number; // degrees (-6 to 6)
  z: number; // z-index
  status: PaperStatus;
  createdAt: number;
}

export type PenColor = "#000000" | "#2563eb" | "#dc2626" | "#16a34a";
export type PenSize = 2 | 4 | 8;

export type ActiveMode =
  | { type: "idle" }
  | { type: "modal"; paperId: string; mode: "new" | "edit" }
  | { type: "dragging"; paperId: string; from: "modal" | "board" };

export interface DragGhostData {
  paperId: string;
  from: "modal" | "board";
  strokes: Stroke[];
  initialWidth: number;
  initialHeight: number;
  targetWidth: number;
  targetHeight: number;
  startPointerX: number;
  startPointerY: number;
  grabOffsetX: number;
  grabOffsetY: number;
  initialRotation: number;
}

export interface NoticeBoardStorage {
  load(): Paper[] | null;
  save(papers: Paper[]): void;
}
