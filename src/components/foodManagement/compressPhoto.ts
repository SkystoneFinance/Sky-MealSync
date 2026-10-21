// Shrink a phone photo before upload: longest side 1600px, JPEG ~80%.
// A 4–8 MB camera photo becomes roughly 200–400 KB.

const MAX_SIDE = 1600;
const QUALITY = 0.8;

export async function compressPhoto(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      "This photo format isn't supported. Take the photo again, or choose a JPEG or PNG."
    );
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Couldn't process the photo on this device.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY)
  );

  if (!blob) {
    throw new Error("Couldn't process the photo on this device.");
  }

  return blob;
}
