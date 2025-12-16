"use client";

import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

import dynamic from "next/dynamic";

export const BlockNoteEditor = dynamic(
  async () => {
    const { BlockNoteView } = await import("@blocknote/mantine");
    const { useCreateBlockNote } = await import("@blocknote/react");

    return function EditorWrapper({ editor: providedEditor, ...props }: any) {
      const editor = providedEditor ?? useCreateBlockNote();
      return <BlockNoteView editor={editor} {...props} />;
    };
  },
  { ssr: false }
);
