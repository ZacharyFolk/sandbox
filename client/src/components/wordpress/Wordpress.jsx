import { useState, useEffect } from 'react';
import axios from 'axios';
const ImageCard = ({ thumbnail, link }) => {
  return (
    <div className='fp-img-container'>
      <a href={link}>
        <img src={thumbnail} alt='thumbnail' />
      </a>
    </div>
  );
};
const ImageFeed = () => {
  const [feed, setFeed] = useState(null);
  const [parsedFeed, setParsedFeed] = useState([]);
  const processData = (feed) => {
    if (feed) {
      console.log(feed);
      let parsedData = [];
      Object.entries(feed).forEach(([key, value]) => {
        const thumbnail = value.media_details?.sizes?.thumbnail?.source_url;
        const fpLink = value.link;
        if (thumbnail && fpLink) {
          parsedData = [...parsedData, { thumbnail, link: fpLink }];
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
  return (
    <div className='fp-images new-scroll'>
      {parsedFeed.map((item, index) => (
        <ImageCard key={index} thumbnail={item.thumbnail} link={item.link} />
      ))}
    </div>
  );
};

export default ImageFeed;
