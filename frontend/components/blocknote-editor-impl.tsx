"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

export default function BlockNoteEditorImpl({
  value,
  onChange,
}: {
  value?: any;
  onChange?: (doc: any) => void;
}) {
  const editor = useCreateBlockNote({
    initialContent: value,
    onEditorContentChange: (editor) => {
      onChange?.(editor.document);
    },
  });

  return <BlockNoteView editor={editor} />;
}
