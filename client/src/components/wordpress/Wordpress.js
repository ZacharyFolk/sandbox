import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

const ImageCard = ({ thumbnail, fullSize, link }) => {
  return (
    <div className="fp-img-container">
      <a
        href={fullSize}
        className="glightbox"
        data-gallery="fp-gallery"
        data-glightbox={`description: <a href="${link}" target="_blank">View on Folk Photography</a>`}
      >
        <img src={thumbnail} alt="photography thumbnail" />
      </a>
    </div>
  );
};

const ImageFeed = () => {
  const [feed, setFeed] = useState(null);
  const [parsedFeed, setParsedFeed] = useState([]);
  const lightboxRef = useRef(null);

  const processData = (feed) => {
    if (feed) {
      console.log(feed);
      let parsedData = [];
      Object.entries(feed).forEach(([key, value]) => {
        const thumbnail = value.media_details?.sizes?.thumbnail?.source_url;
        const fullSize =
          value.media_details?.sizes?.large?.source_url ||
          value.media_details?.sizes?.full?.source_url ||
          value.source_url;
        const fpLink = value.link;
        if (thumbnail && fpLink) {
          parsedData = [...parsedData, { thumbnail, fullSize, link: fpLink }];
        }
      });
      return parsedData;
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      const res = await axios.get(
        'https://folkphotography.com/wp-json/wp/v2/media?per_page=30'
      );
      setFeed(res.data);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (feed) {
      const parsedData = processData(feed);
      setParsedFeed(parsedData);
    }
  }, [feed]);

  // Initialize GLightbox after images are rendered
  useEffect(() => {
    if (parsedFeed.length > 0) {
      // Destroy existing instance if it exists
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
      }

      // Create new GLightbox instance
      lightboxRef.current = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        closeButton: true,
        svg: {
          close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
          next: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>',
          prev: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>',
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
      }
    };
  }, [parsedFeed]);

  return (
    <div className="fp-container new-scroll">
      {parsedFeed.map((item, index) => (
        <ImageCard
          key={index}
          thumbnail={item.thumbnail}
          fullSize={item.fullSize}
          link={item.link}
        />
      ))}
    </div>
  );
};

export default ImageFeed;
