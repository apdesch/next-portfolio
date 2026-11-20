"use server";

import { asc, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { notFound } from "next/navigation";
import getDb from "@/db/client";
import galleryPhotos from "@/db/tables/gallery-photos";
import findNeighbor, { type MoveDirection } from "@/lib/find-neighbor";
import isValidId from "@/lib/is-valid-id";
import requireAdminSession from "@/lib/require-admin-session";

// Moves a photo within its own gallery: it swaps positions with its neighbor in the same
// category, so the galleries' order on the home page doesn't change. Both updates run as
// one batch, which Neon applies as a single transaction.
const moveGalleryPhoto = async (
  photoId: number,
  direction: MoveDirection,
): Promise<void> => {
  await requireAdminSession();
  if (!isValidId(photoId) || !["up", "down"].includes(direction)) notFound();

  const database = getDb();
  const [photo] = await database
    .select({
      id: galleryPhotos.id,
      position: galleryPhotos.position,
      category: galleryPhotos.category,
    })
    .from(galleryPhotos)
    .where(eq(galleryPhotos.id, photoId));
  if (!photo) return;

  const galleryPhotosInOrder = await database
    .select({ id: galleryPhotos.id, position: galleryPhotos.position })
    .from(galleryPhotos)
    .where(eq(galleryPhotos.category, photo.category))
    .orderBy(asc(galleryPhotos.position));
  const neighbor = findNeighbor(galleryPhotosInOrder, photoId, direction);
  if (!neighbor) return;

  await database.batch([
    database
      .update(galleryPhotos)
      .set({ position: neighbor.position })
      .where(eq(galleryPhotos.id, photo.id)),
    database
      .update(galleryPhotos)
      .set({ position: photo.position })
      .where(eq(galleryPhotos.id, neighbor.id)),
  ]);
  updateTag("gallery-photos");
};

export default moveGalleryPhoto;
