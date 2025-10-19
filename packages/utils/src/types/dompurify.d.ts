declare module 'dompurify' {
  interface DOMPurifyConfig {
    ALLOWED_ATTR?: string[];
    ALLOWED_TAGS?: string[];
    FORBID_ATTR?: string[];
    FORBID_TAGS?: string[];
    KEEP_CONTENT?: boolean;
    RETURN_DOM?: boolean;
    RETURN_DOM_FRAGMENT?: boolean;
    RETURN_DOM_IMPORT?: boolean;
    SANITIZE_DOM?: boolean;
    USE_PROFILES?: {
      svg?: boolean;
      svgFilters?: boolean;
    };
  }

  interface DOMPurify {
    addHook: (hook: string, callback: (...args: any[]) => any) => void;
    removeHook: (hook: string, callback: (...args: any[]) => any) => void;
    sanitize: (str: string, config?: DOMPurifyConfig) => string;
  }

  const DOMPurify: DOMPurify;
  export default DOMPurify;
}
