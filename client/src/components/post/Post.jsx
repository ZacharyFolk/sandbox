import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import moment from 'moment';
export default function Post({ post }) {
  const PF = 'http://localhost:9999/images/'; // Public Folder of API server
  const [excerpt, setExcerpt] = useState('');
  const time = moment(post.createdAt).format('YYYY-MM-DD HH:mm');

  useEffect(() => {
    let excerpt = post.desc;
    if (excerpt.length > 350) {
      excerpt = excerpt.substring(0, 350) + '...';
    }
    setExcerpt(excerpt);
  }, []);

  return (
    <div className='post'>
      {post.photo && <img src={PF + post.photo} alt='' className='postImg' />}
      <div className='postInfo'>
        {/* <div className='postCats'>
          {post.categories.map((c) => (
            <span className='postCat'>{c.name}</span>
          ))}
        </div> */}

        <span className='post-heading'>
          -rw-r--r-- root {time} <b>{post.title}</b>
        </span>
      </div>
      <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(excerpt) }}></p>
      <Link to={`/post/${post._id}`} className='full-post'>
        Read the full post &gt;
      </Link>
    </div>
  );
}
