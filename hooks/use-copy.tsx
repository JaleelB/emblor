import { useState, useCallback } from 'react';

function useClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      // Navigator Clipboard API method'
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
      } catch (err) {
        console.error(err);
        setIsCopied(false);
      }
    } else {
      // Clipboard API not available, use fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful: boolean = document.execCommand('copy');
        setIsCopied(successful);
      } catch (err) {
        console.error(err);
        setIsCopied(false);
      }
      document.body.removeChild(textArea);
    }
  }, []);

  return { isCopied, copyToClipboard };
}

export default useClipboard;
