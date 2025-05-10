import React from 'react';

interface ToastWithLinksProps {
  message: string;
  url: string | null;
  linkText: string;
}

/**
 * A toast component that displays a message and a link.
 * @param message - The message to display.
 * @param linkText - The text of the link.
 * @param url - The URL of the link.
 * @returns A toast component.
 */
export default function ToastWithLinks({ message, url, linkText }: ToastWithLinksProps) {
  return (
    <div className="flex flex-col">
      <p>{message}</p>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {linkText}
        </a>
      )}
    </div>
  );
}
