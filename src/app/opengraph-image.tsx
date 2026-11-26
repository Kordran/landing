import { createShareImage, shareImageSize } from "@/lib/share-image";
import { headline } from "@/lib/site";

export const alt = headline;
export const size = shareImageSize;
export const contentType = "image/png";

export default function Image() {
  return createShareImage(headline);
}
