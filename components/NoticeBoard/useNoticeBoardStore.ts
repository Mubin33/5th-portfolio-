import { useReducer, useEffect, useRef, useCallback, useMemo } from "react";
import { Paper, Stroke, ActiveMode, NoticeBoardStorage } from "./types";

const STORAGE_KEY = "noticeboard:v1";
const MAX_PAPERS = 30;

// Default sample seed papers if storage is empty
const SEED_PAPERS: Paper[] = [
  {
    id: "seed-hello",
    status: "board",
    x: 0.22,
    y: 0.38,
    rotation: -3.5,
    z: 1,
    createdAt: 1700000001,
    strokes: [
      // H
      { color: "#000000", size: 4, points: [[0.22, 0.38], [0.22, 0.58]] },
      { color: "#000000", size: 4, points: [[0.31, 0.38], [0.31, 0.58]] },
      { color: "#000000", size: 4, points: [[0.22, 0.48], [0.31, 0.48]] },
      // E
      { color: "#000000", size: 4, points: [[0.36, 0.38], [0.36, 0.58]] },
      { color: "#000000", size: 4, points: [[0.36, 0.38], [0.44, 0.38]] },
      { color: "#000000", size: 4, points: [[0.36, 0.48], [0.42, 0.48]] },
      { color: "#000000", size: 4, points: [[0.36, 0.58], [0.44, 0.58]] },
      // L
      { color: "#000000", size: 4, points: [[0.48, 0.38], [0.48, 0.58]] },
      { color: "#000000", size: 4, points: [[0.48, 0.58], [0.55, 0.58]] },
      // L
      { color: "#000000", size: 4, points: [[0.58, 0.38], [0.58, 0.58]] },
      { color: "#000000", size: 4, points: [[0.58, 0.58], [0.65, 0.58]] },
      // O
      {
        color: "#000000",
        size: 4,
        points: [
          [0.72, 0.38], [0.68, 0.42], [0.67, 0.48], [0.68, 0.54],
          [0.72, 0.58], [0.77, 0.58], [0.80, 0.54], [0.81, 0.48],
          [0.80, 0.42], [0.76, 0.38], [0.72, 0.38]
        ],
      },
      // !
      { color: "#000000", size: 4, points: [[0.85, 0.38], [0.85, 0.51]] },
      { color: "#000000", size: 5, points: [[0.85, 0.56], [0.85, 0.58]] },
      // Underline squiggle
      {
        color: "#2563eb",
        size: 3,
        points: [[0.20, 0.66], [0.35, 0.64], [0.52, 0.67], [0.70, 0.65], [0.86, 0.66]],
      },
    ],
  },
  {
    id: "seed-smile",
    status: "board",
    x: 0.52,
    y: 0.46,
    rotation: 2.2,
    z: 2,
    createdAt: 1700000002,
    strokes: [
      // Face circle
      {
        color: "#2563eb",
        size: 4,
        points: [
          [0.50, 0.22], [0.36, 0.25], [0.26, 0.36], [0.24, 0.50],
          [0.26, 0.64], [0.36, 0.75], [0.50, 0.78], [0.64, 0.75],
          [0.74, 0.64], [0.76, 0.50], [0.74, 0.36], [0.64, 0.25],
          [0.50, 0.22]
        ],
      },
      // Left eye
      { color: "#2563eb", size: 5, points: [[0.40, 0.42], [0.40, 0.44]] },
      // Right eye
      { color: "#2563eb", size: 5, points: [[0.60, 0.42], [0.60, 0.44]] },
      // Smile curve
      {
        color: "#2563eb",
        size: 4,
        points: [
          [0.37, 0.56], [0.43, 0.63], [0.50, 0.65], [0.57, 0.63], [0.63, 0.56]
        ],
      },
    ],
  },
  {
    id: "seed-arrow",
    status: "board",
    x: 0.78,
    y: 0.36,
    rotation: -2.1,
    z: 3,
    createdAt: 1700000003,
    strokes: [
      // Star doodle
      {
        color: "#dc2626",
        size: 4,
        points: [
          [0.50, 0.26], [0.53, 0.36], [0.64, 0.36], [0.55, 0.43],
          [0.58, 0.53], [0.50, 0.47], [0.42, 0.53], [0.45, 0.43],
          [0.36, 0.36], [0.47, 0.36], [0.50, 0.26]
        ],
      },
      // Arrow shaft
      {
        color: "#16a34a",
        size: 4,
        points: [[0.30, 0.70], [0.48, 0.68], [0.68, 0.64]],
      },
      // Arrow head
      {
        color: "#16a34a",
        size: 4,
        points: [[0.58, 0.58], [0.68, 0.64], [0.60, 0.73]],
      },
    ],
  },
];

interface State {
  papers: Paper[];
  activeMode: ActiveMode;
  nextZ: number;
}

type Action =
  | { type: "SET_PAPERS"; papers: Paper[] }
  | { type: "OPEN_MODAL"; paperId: string; mode: "new" | "edit" }
  | { type: "CLOSE_MODAL" }
  | { type: "START_DRAG"; paperId: string; from: "modal" | "board" }
  | { type: "CANCEL_DRAG" }
  | { type: "PLACE_PAPER"; paperId: string; x: number; y: number; rotation?: number }
  | { type: "UPDATE_STROKES"; paperId: string; strokes: Stroke[] }
  | { type: "CREATE_PILE_PAPER"; paper: Paper }
  | { type: "DELETE_PAPER"; paperId: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PAPERS": {
      const maxZ = action.papers.reduce((m, p) => Math.max(m, p.z || 1), 1);
      return { ...state, papers: action.papers, nextZ: maxZ + 1 };
    }
    case "OPEN_MODAL":
      return {
        ...state,
        activeMode: { type: "modal", paperId: action.paperId, mode: action.mode },
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        activeMode: { type: "idle" },
      };
    case "START_DRAG":
      return {
        ...state,
        activeMode: { type: "dragging", paperId: action.paperId, from: action.from },
      };
    case "CANCEL_DRAG":
      return {
        ...state,
        activeMode: { type: "idle" },
      };
    case "PLACE_PAPER": {
      const newZ = state.nextZ + 1;
      const rot =
        typeof action.rotation === "number"
          ? action.rotation
          : (Math.random() * 12 - 6);

      const updated = state.papers.map((p) => {
        if (p.id !== action.paperId) return p;
        return {
          ...p,
          status: "board" as const,
          x: Math.max(0.08, Math.min(0.92, action.x)),
          y: Math.max(0.12, Math.min(0.88, action.y)),
          rotation: Math.round(rot * 10) / 10,
          z: newZ,
        };
      });

      return {
        ...state,
        papers: updated,
        activeMode: { type: "idle" },
        nextZ: newZ + 1,
      };
    }
    case "UPDATE_STROKES": {
      return {
        ...state,
        papers: state.papers.map((p) =>
          p.id === action.paperId ? { ...p, strokes: action.strokes } : p
        ),
      };
    }
    case "CREATE_PILE_PAPER": {
      return {
        ...state,
        papers: [action.paper, ...state.papers],
      };
    }
    case "DELETE_PAPER": {
      return {
        ...state,
        papers: state.papers.filter((p) => p.id !== action.paperId),
      };
    }
    default:
      return state;
  }
}

// Storage adapter interface (can easily be swapped with a server API later)
export const localNoticeBoardStorage: NoticeBoardStorage = {
  load(): Paper[] | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn("NoticeBoard: LocalStorage read failed, using fallback", e);
    }
    return null;
  },
  save(papers: Paper[]) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
    } catch (e) {
      console.warn("NoticeBoard: LocalStorage save failed", e);
    }
  },
};

export function useNoticeBoardStore(storage = localNoticeBoardStorage) {
  const [state, dispatch] = useReducer(reducer, {
    papers: SEED_PAPERS,
    activeMode: { type: "idle" },
    nextZ: 10,
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize from storage or seed
  useEffect(() => {
    const loaded = storage.load();
    if (loaded && loaded.length > 0) {
      dispatch({ type: "SET_PAPERS", papers: loaded });
    } else {
      dispatch({ type: "SET_PAPERS", papers: SEED_PAPERS });
      storage.save(SEED_PAPERS);
    }
  }, [storage]);

  // Debounced auto-save whenever papers change
  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      storage.save(state.papers);
    }, 300);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state.papers, storage]);

  const boardPapers = useMemo(
    () => state.papers.filter((p) => p.status === "board"),
    [state.papers]
  );

  const pilePapers = useMemo(
    () => state.papers.filter((p) => p.status === "pile"),
    [state.papers]
  );

  const isBoardFull = boardPapers.length >= MAX_PAPERS;

  const createNewPaper = useCallback(() => {
    const newId = `paper-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newPaper: Paper = {
      id: newId,
      strokes: [],
      x: 0.5,
      y: 0.5,
      rotation: Math.round((Math.random() * 8 - 4) * 10) / 10,
      z: state.nextZ + 1,
      status: "pile",
      createdAt: Date.now(),
    };
    dispatch({ type: "CREATE_PILE_PAPER", paper: newPaper });
    return newPaper;
  }, [state.nextZ]);

  const openModal = useCallback((paperId: string, mode: "new" | "edit") => {
    dispatch({ type: "OPEN_MODAL", paperId, mode });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: "CLOSE_MODAL" });
  }, []);

  const startDrag = useCallback((paperId: string, from: "modal" | "board") => {
    dispatch({ type: "START_DRAG", paperId, from });
  }, []);

  const cancelDrag = useCallback(() => {
    dispatch({ type: "CANCEL_DRAG" });
  }, []);

  const placePaper = useCallback(
    (paperId: string, x: number, y: number, rotation?: number) => {
      dispatch({ type: "PLACE_PAPER", paperId, x, y, rotation });
    },
    []
  );

  const pinToBoardAuto = useCallback(
    (paperId: string) => {
      // Find an unoccupied area or pick random gentle spot
      const x = 0.15 + Math.random() * 0.7;
      const y = 0.2 + Math.random() * 0.6;
      const rot = Math.random() * 10 - 5;
      dispatch({ type: "PLACE_PAPER", paperId, x, y, rotation: rot });
    },
    []
  );

  const updateStrokes = useCallback((paperId: string, strokes: Stroke[]) => {
    dispatch({ type: "UPDATE_STROKES", paperId, strokes });
  }, []);

  const getPaper = useCallback(
    (paperId: string) => state.papers.find((p) => p.id === paperId),
    [state.papers]
  );

  return {
    papers: state.papers,
    boardPapers,
    pilePapers,
    activeMode: state.activeMode,
    isBoardFull,
    maxPapers: MAX_PAPERS,
    openModal,
    closeModal,
    startDrag,
    cancelDrag,
    placePaper,
    pinToBoardAuto,
    updateStrokes,
    getPaper,
    createNewPaper,
  };
}
