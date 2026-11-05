"use client";

import * as React from "react";
import Link from "next/link";
import { CameraIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { toast } from "@/components/ui/toast";
import type { Studio } from "@/lib/api";
import { categoryLabel } from "@/lib/categories";


//initialStudios={studios}
export function MyListingsManager({ initialStudios }: { initialStudios: Studio[] }) {
  const [studios, setStudios] = React.useState(initialStudios);
  const [studioToDelete, setStudioToDelete] = React.useState<Studio | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState("");

  const deleteStudio = async () => {
    if (!studioToDelete) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `/api/studios/${encodeURIComponent(studioToDelete._id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`The server responded with ${response.status}.`);
      }

      setStudios((current) =>
        current.filter((studio) => studio._id !== studioToDelete._id)
      );
      setStudioToDelete(null);
      toast.add({
        title: "Studio deleted",
        description: "The listing was removed successfully.",
        type: "success",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? `Unable to delete this studio: ${error.message}`
          : "Unable to delete this studio. Please try again.";
      setDeleteError(message);
      toast.add({
        title: "Studio could not be deleted",
        description: message,
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {studios.length === 0 ? (
        <Empty className="rounded-xl border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CameraIcon />
            </EmptyMedia>
            <EmptyTitle>No studio listings yet</EmptyTitle>
            <EmptyDescription>
              Add your first studio to start managing your spaces here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button nativeButton={false} render={<Link href="/add-studio" />}>
              Add New Studio
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => {
            const image = studio.imageUrl ?? studio.images?.[0];

            return (
              <article
                key={studio._id}
                className="flex flex-col overflow-hidden rounded-xl border bg-card"
              >
                <div className="aspect-video overflow-hidden bg-muted">
                  {image ? (
                    <img
                      src={image}
                      alt={studio.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                      No image yet
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {categoryLabel(studio.category)}
                    </p>
                    <h2 className="mt-1 line-clamp-1 font-semibold">
                      {studio.title}
                    </h2>
                  </div>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPinIcon className="size-3.5 shrink-0" />
                    <span className="line-clamp-1">{studio.location}</span>
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <p className="text-sm">
                      <span className="text-lg font-semibold text-primary">
                        ${studio.hourlyRate}
                      </span>
                      <span className="text-muted-foreground"> / hr</span>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        nativeButton={false}
                        render={
                          <Link
                            href={`/studios/edit/${encodeURIComponent(studio._id)}`}
                          />
                        }
                      >
                        Update
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setDeleteError("");
                          setStudioToDelete(studio);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={studioToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setStudioToDelete(null);
            setDeleteError("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this studio listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium">{studioToDelete?.title}</span>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p role="alert" className="text-sm text-destructive">
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={deleteStudio}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
