"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

export function StudioImageField({
  imageUrl,
  onImageUrlChange,
  isUploading,
  onUploadingChange,
}: {
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
  isUploading: boolean;
  onUploadingChange: (value: boolean) => void;
}) {
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const image = event.target.files?.[0];
    if (!image) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(image.type)) {
      toast.add({
        title: "Unsupported image",
        description: "Choose a JPG, PNG, WebP, or GIF image.",
        type: "error",
      });
      event.target.value = "";
      return;
    }
    if (image.size > 4 * 1024 * 1024) {
      toast.add({
        title: "Image is too large",
        description: "Choose an image that is 4 MB or smaller.",
        type: "error",
      });
      event.target.value = "";
      return;
    }

    onUploadingChange(true);
    try {
      const uploadData = new FormData();
      uploadData.append("image", image);
      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: uploadData,
      });
      const result = (await response.json()) as {
        imageUrl?: string;
        message?: string;
      };
      if (!response.ok || !result.imageUrl) {
        throw new Error(result.message ?? "Image upload failed.");
      }

      onImageUrlChange(result.imageUrl);
      toast.add({
        title: "Image uploaded",
        description: "The image is ready to save with your studio.",
        type: "success",
      });
    } catch (error) {
      toast.add({
        title: "Image upload failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        type: "error",
      });
    } finally {
      onUploadingChange(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="studio-image-upload">Upload an image</Label>
        <Input
          id="studio-image-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleUpload}
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP, or GIF. Maximum size: 4 MB.
        </p>
        {isUploading && (
          <p role="status" className="text-sm text-muted-foreground">
            Uploading image...
          </p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="imageUrl">Or enter an image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://i.ibb.co/your-studio-photo.jpg"
          value={imageUrl}
          onChange={(event) => onImageUrlChange(event.target.value)}
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
