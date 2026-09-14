import { useEffect, useRef, useState } from "react";

interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
}

export default function Lightbox({ images }: LightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (openIndex === null) return;
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight") {
        setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
      } else if (event.key === "ArrowLeft") {
        setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      } else if (event.key === "Tab") {
        trapFocus(event);
      }
    }

    function trapFocus(event: KeyboardEvent) {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, images.length]);

  function close() {
    const trigger = openIndex !== null ? triggerRefs.current[openIndex] : null;
    setOpenIndex(null);
    trigger?.focus();
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              ref={(el) => {
                triggerRefs.current[index] = el;
              }}
              onClick={() => setOpenIndex(index)}
              className="block w-full"
            >
              <img
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-sm object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Project photo, expanded"
          ref={dialogRef}
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <img
            src={images[openIndex]?.src}
            alt={images[openIndex]?.alt ?? ""}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Close image viewer"
            className="absolute right-6 top-6 text-xs uppercase tracking-widest text-bone"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() =>
              setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length))
            }
            aria-label="Previous photo"
            className="absolute left-6 text-xs uppercase tracking-widest text-bone"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))}
            aria-label="Next photo"
            className="absolute right-6 mt-12 text-xs uppercase tracking-widest text-bone"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}
