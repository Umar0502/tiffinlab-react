import { useEffect } from 'react';

// Sets the tab title for a page and restores the default on unmount (effect with cleanup).
export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | TiffinLab`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
