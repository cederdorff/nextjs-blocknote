"use client";

import dynamic from "next/dynamic";

// BlockNote only works in the browser, so skip server-side rendering
const Editor = dynamic(() => import("./Editor"), { ssr: false });

export default Editor;
