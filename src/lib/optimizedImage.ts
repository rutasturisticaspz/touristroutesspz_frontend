
export const DEVICE_WIDTHS = [640, 960, 1280, 1920] as const;
export const SMALL_WIDTHS = [320, 480] as const;
export const IMAGE_QUALITY = 75;

const OPTIMIZABLE_PATH = /^\/(uploads|img)\/.+\.(jpe?g|png|webp)(\?.*)?$/i;
const ALL_WIDTHS = [...SMALL_WIDTHS, ...DEVICE_WIDTHS];

// Only local raster images are resized. Vector graphics, animated GIFs
// and addresses on other sites are served as they are.
export function isOptimizable(src: string | null | undefined): src is string {
  return !!src && OPTIMIZABLE_PATH.test(src);
}

export function optimizedUrl(src: string, width: number): string {
  if (!isOptimizable(src)) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${IMAGE_QUALITY}`;
}

export function optimizedSrcSet(src: string): string | undefined {
  if (!isOptimizable(src)) return undefined;
  return ALL_WIDTHS.map((width) => `${optimizedUrl(src, width)} ${width}w`).join(', ');
}
