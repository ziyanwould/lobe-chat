import { memo } from 'react';

import { useGenerationConfigParam } from '@/store/image/slices/generationConfig/hooks';

import { useAutoDimensions } from '../hooks/useAutoDimensions';
import ImageUpload from './ImageUpload';
import MultiImagesUpload from './MultiImagesUpload';

const ImageUrlsUpload = memo(() => {
  const { value, setValue, maxCount, maxFileSize } = useGenerationConfigParam('imageUrls');
  const { autoSetDimensions, extractUrlAndDimensions } = useAutoDimensions();

  // When maxCount is 1, use ImageUpload for single image upload
  if (maxCount === 1) {
    const handleSingleChange = (
      data?:
        | string // Old API: just URL
        | { dimensions?: { height: number; width: number }; url: string }, // New API: URL with dimensions
    ) => {
      const { url, dimensions } = extractUrlAndDimensions(data);

      setValue(url ? [url] : []);

      // Auto-set dimensions if available
      if (dimensions) {
        autoSetDimensions(dimensions);
      }
    };

    return (
      <ImageUpload
        maxFileSize={maxFileSize}
        onChange={handleSingleChange}
        value={value?.[0] ?? null}
      />
    );
  }

  // Otherwise use MultiImagesUpload for multiple images
  const handleChange = (
    data:
      | string[] // Old API: just URLs
      | { dimensions?: { height: number; width: number }; urls: string[] }, // New API: URLs with first image dimensions
  ) => {
    const urls = Array.isArray(data) ? data : data.urls;
    const dimensions = Array.isArray(data) ? undefined : data.dimensions;

    // Directly set the URLs to the store
    // The store will handle URL to path conversion when needed
    setValue(urls);

    // Only auto-set dimensions if no existing images and only uploading one image
    if (!value?.length && urls.length === 1 && dimensions) {
      autoSetDimensions(dimensions);
    }
  };

  return (
    <MultiImagesUpload
      maxCount={maxCount}
      maxFileSize={maxFileSize}
      onChange={handleChange}
      value={value}
    />
  );
});

export default ImageUrlsUpload;
