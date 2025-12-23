"use client";

import dynamic from "next/dynamic";
import type { BlockNoteEditor } from "@blocknote/core";

export type BlockNoteClientProps = {
  editor: BlockNoteEditor;
  editable?: boolean;
  theme?: "light" | "dark";
  onChange?: () => void;
  className?: string;
};

const BlockNoteClient = dynamic<BlockNoteClientProps>(
  () => import("./blocknote-editor-impl"),
  { ssr: false }
);

export default BlockNoteClient;
