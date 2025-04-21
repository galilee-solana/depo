
/**
 * A toast component that displays a message and a link.
 * @param message - The message to display.
 * @param linkText - The text of the link.
 * @param url - The URL of the link.
 * @returns A toast component.
 */
function ToastWithLinks({ message, linkText, url }: { message: string, linkText: string, url: string }) {
  return (
    <div>
      {message}
      <br />
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
        {linkText}
      </a>
    </div>
  );
}

export default ToastWithLinks;
