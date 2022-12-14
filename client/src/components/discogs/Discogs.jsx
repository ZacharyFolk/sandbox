import { useEffect, useState } from 'react';
import axios from 'axios';
const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });

function Discogs() {
  const [discoresults, setDisco] = useState([]);

  const localdisco = sessionStorage.getItem('disco');

  useEffect(() => {
    const fetchCollection = async () => {
      if (!localdisco) {
        console.log('ok trying this disco request');
        const req = await axiosInstance.get('disco_api/users/zedbenev/0');
        const result = await req.data;
        console.log('REQUEST MADE TO DISCOGS API');
        sessionStorage.setItem('disco', JSON.stringify(result));
        return setDisco(result);
      }
      setDisco(JSON.parse(localdisco));
    };

    fetchCollection();
  }, []);

  //console.log(discoresults);
  return (
    <>
      <div className='container'>
        <Disco discoresults={discoresults} />
      </div>
    </>
  );
}

function Disco({ discoresults }) {
  // const page = discoresults.pagination;
  const records = discoresults.releases;

  // console.log(records);
  if (records) {
    return (
      <div className='disc'>
        {records.map((r, i) => (
          <Disc key={i} discinfo={r.basic_information} />
        ))}
      </div>
    );
  }
}

function Disc({ discinfo }) {
  let title = discinfo.title;
  let imgsrc = discinfo.cover_image;
  // let artist = discinfo.artists[0].name;

  // console.log(discinfo);

  return (
    <div className='record-container'>
      <div className='record-cover'>
        <img src={imgsrc} alt={title} />
      </div>
      {/* <span className='caption'>
        {artist} - {title}
      </span> */}
    </div>
  );
}
export default Discogs;
