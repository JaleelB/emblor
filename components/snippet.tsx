"use client";

import React from "react";
import { Snippet } from ".contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import Pre from "./pre";

const components = {
  pre: Pre,
};

export function Snippet({ snippet }: { snippet: Snippet }) {
  const MDXContent = useMDXComponent(snippet.body.code);
  return <MDXContent components={components} />;
}
