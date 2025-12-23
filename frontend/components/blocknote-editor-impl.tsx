"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import type { BlockNoteEditor } from "@blocknote/core";

type BlockNoteEditorImplProps = {
  editor: BlockNoteEditor;
  editable?: boolean;
  theme?: "light" | "dark";
  onChange?: () => void;
  className?: string;
};

export default function BlockNoteEditorImpl({
  editor,
  editable = false,
  theme = "light",
  onChange,
  className,
}: BlockNoteEditorImplProps) {
  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={theme}
      onChange={onChange}
      className={className}
    />
  );
}
