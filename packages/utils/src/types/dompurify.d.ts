declare module 'dompurify' {
  export interface SanitizeConfig {
    [key: string]: any;
  }

  export interface DOMPurifyInstance {
    sanitize(source: string, config?: SanitizeConfig): string;
  }

  const DOMPurify: DOMPurifyInstance;
  export default DOMPurify;
}
