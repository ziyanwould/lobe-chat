import { memo } from 'react';

import { useGenerationConfigParam } from '@/store/image/slices/generationConfig/hooks';

import { useAutoDimensions } from '../hooks/useAutoDimensions';
import ImageUpload from './ImageUpload';

const ImageUrl = memo(() => {
  const { value: imageUrl, setValue, maxFileSize } = useGenerationConfigParam('imageUrl');
  const { autoSetDimensions, extractUrlAndDimensions } = useAutoDimensions();

  const handleChange = (
    data?:
      | string // Old API: just URL
      | { dimensions?: { height: number; width: number }; url: string }, // New API: URL with dimensions
  ) => {
    const { url, dimensions } = extractUrlAndDimensions(data);

    setValue(url ?? null);

    // Auto-set dimensions if available
    if (dimensions) {
      autoSetDimensions(dimensions);
    }
  };

  return <ImageUpload maxFileSize={maxFileSize} onChange={handleChange} value={imageUrl} />;
});

export default ImageUrl;
