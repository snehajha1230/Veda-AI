export function canAttachSourceFile(mimeType?: string): boolean {
  return (
    mimeType === "application/pdf" ||
    mimeType === "image/jpeg" ||
    mimeType === "image/png"
  );
}
