import DOMPurify from 'dompurify';

/**
 * Sanitizes SVG content to prevent XSS attacks while preserving safe SVG elements and attributes
 * @param content - The SVG content to sanitize
 * @returns Sanitized SVG content safe for rendering
 */
export const sanitizeSVGContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    FORBID_ATTR: [
      'onblur',
      'onchange',
      'onclick',
      'onerror',
      'onfocus',
      'onkeydown',
      'onkeypress',
      'onkeyup',
      'onload',
      'onmousedown',
      'onmouseout',
      'onmouseover',
      'onmouseup',
      'onreset',
      'onselect',
      'onsubmit',
      'onunload',
    ],
    FORBID_TAGS: ['embed', 'link', 'object', 'script', 'style'],
    KEEP_CONTENT: false,
    USE_PROFILES: { svg: true, svgFilters: true },
  });
};
