"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

type Props = {
  onFileUpload: (file: File) => Promise<void>;
  accept?: string;
};

export function FileUpload({ onFileUpload, accept }: Props) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        await onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-base-content/20 hover:border-primary/50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/file.svg"
          alt=""
          width={48}
          height={48}
          className="opacity-50"
        />
        <p className="text-base-content/70">
          {isDragActive
            ? "Drop the file here..."
            : "Drag and drop a file here, or click to select"}
        </p>
      </div>
    </div>
  );
}
