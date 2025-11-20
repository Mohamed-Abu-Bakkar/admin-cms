"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { startUpload } = useUploadThing("productImage", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onChange(res[0].url);
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      alert(`Upload failed: ${error.message}`);
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await startUpload([file]);
  };

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative w-full max-w-xs">
          <img
            src={value}
            alt="Product"
            className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled || isUploading}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
        />
        {isUploading && (
          <p className="mt-2 text-sm text-green-600">Uploading...</p>
        )}
      </div>
    </div>
  );
}
