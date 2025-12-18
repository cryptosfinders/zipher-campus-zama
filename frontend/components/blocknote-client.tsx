"use client";

import dynamic from "next/dynamic";

const BlockNoteEditor = dynamic(
  () => import("./blocknote-editor-impl"),
  { ssr: false }
);

export default BlockNoteEditor;
