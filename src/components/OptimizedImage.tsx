'use client';

import { useState, type ImgHTMLAttributes } from 'react';
import { isOptimizable, optimizedSrcSet, optimizedUrl } from '../lib/optimizedImage';

const DEFAULT_WIDTH = 960;
const DEFAULT_SIZES = '(max-width: 1200px) 100vw, 1200px';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  // Above-the-fold image: loaded right away and with high priority.
  // Everything else waits until it is near the screen.
  priority?: boolean;
}

// A normal <img> that asks for a resized copy of the photo, loads lazily
// and decodes off the main thread. If the resized copy cannot be served
// for any reason it falls back to the original, so a picture never
// disappears because of the optimization.
export default function OptimizedImage({
  src,
  priority = false,
  sizes = DEFAULT_SIZES,
  alt = '',
  ...rest
}: OptimizedImageProps) {
  const [failed, setFailed] = useState(false);
  const optimized = isOptimizable(src) && !failed;

  return (
    <img
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      {...rest}
      alt={alt}
      src={optimized ? optimizedUrl(src, DEFAULT_WIDTH) : src}
      srcSet={optimized ? optimizedSrcSet(src) : undefined}
      sizes={optimized ? sizes : undefined}
      onError={(event) => {
        setFailed(true);
        rest.onError?.(event);
      }}
    />
  );
}
