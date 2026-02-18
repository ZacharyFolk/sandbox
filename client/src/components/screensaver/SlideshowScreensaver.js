import { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { TerminalContext } from '../../context/TerminalContext';

export default function SlideshowScreensaver() {
  const { setScreensaver, inputRef } = useContext(TerminalContext);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  // Fetch images
  useEffect(() => {
    let cancelled = false;
    const fetchImages = async () => {
      try {
        const res = await axios.get(
          'https://folkphotography.com/wp-json/wp/v2/media?per_page=30',
          { timeout: 10000 }
        );
        if (cancelled) return;
        const parsed = [];
        for (const item of res.data) {
          const url =
            item.media_details?.sizes?.large?.source_url ||
            item.media_details?.sizes?.full?.source_url ||
            item.source_url;
          if (url) parsed.push(url);
        }
        setImages(parsed);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not reach folkphotography.com');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchImages();
    return () => { cancelled = true; };
  }, []);

  // Cycle through images
  useEffect(() => {
    if (images.length < 2) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % images.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [images]);

  // Dismiss on keydown or click
  useEffect(() => {
    const dismiss = () => {
      setScreensaver(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    document.addEventListener('keydown', dismiss);
    const container = containerRef.current;
    container?.addEventListener('click', dismiss);
    return () => {
      document.removeEventListener('keydown', dismiss);
      container?.removeEventListener('click', dismiss);
    };
  }, [setScreensaver, inputRef]);

  return (
    <div ref={containerRef} className="slideshow-screensaver">
      {loading && (
        <div className="slideshow-message">Loading photos...</div>
      )}
      {error && (
        <div className="slideshow-message">
          Folk Photography — Offline<br />
          {error}
        </div>
      )}
      {!loading && !error && images.length > 0 && (
        <>
          {images.map((url, i) => (
            <div
              key={url}
              className={`slideshow-slide ${i === current ? 'slideshow-slide--active' : ''}`}
              style={{ backgroundImage: `url(${url})` }}
            />
          ))}
          <div className="slideshow-counter">
            {current + 1} / {images.length}
          </div>
        </>
      )}
      <div className="slideshow-hint">press any key or click to exit</div>
    </div>
  );
}
