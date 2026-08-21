"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithPlaceholderProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
  expectedPath?: string;
}

export function ImageWithPlaceholder({
  src,
  alt,
  fallbackText = "Photo",
  expectedPath,
  ...props
}: ImageWithPlaceholderProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  if (hasError) {
    const displayPath = expectedPath || (typeof src === "string" ? src : "Image");
    const isDev = process.env.NODE_ENV === "development";

    return (
      <div 
        className="w-full h-full min-h-[100px] bg-blue-600 dark:bg-blue-900/60 flex flex-col items-center justify-center text-white p-4 text-center rounded-[inherit] overflow-hidden select-none border border-blue-500/20"
        style={props.fill ? { position: "absolute", inset: 0 } : undefined}
      >
        {isDev ? (
          <div className="space-y-1.5 z-10 flex flex-col items-center justify-center">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-blue-500/60 dark:bg-blue-500/40 px-2 py-0.5 rounded-full border border-blue-400/30 text-blue-100 animate-pulse">
              Photo needed
            </span>
            <p className="text-[10px] font-mono break-all opacity-90 max-w-full px-2" title={displayPath}>
              {displayPath}
            </p>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-indigo-850 flex items-center justify-center">
            <span className="text-xs font-semibold tracking-wider text-blue-200/50 uppercase select-none">
              {fallbackText}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
