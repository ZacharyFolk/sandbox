import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { Context } from '../../context/Context';

export default function Post({ post }) {
  const PF = 'http://localhost:9999/images/'; // Public Folder of API server
  const [excerpt, setExcerpt] = useState('');
  const time = moment(post.createdAt).format('YYYY-MM-DD HH:mm');
  const { user } = useContext(Context);

  useEffect(() => {
    let excerpt = post.desc;
    if (excerpt.length > 350) {
      excerpt = excerpt.substring(0, 350) + '...';
    }
    setExcerpt(excerpt);
  }, []);

  return (
    (!post.draft || (post.draft && user)) && (
      <div className="post">
        {post.photo && <img src={PF + post.photo} alt="" className="postImg" />}
        {console.log('what', post.draft)}{' '}
        <div className="postInfo">
          {/* <div className='postCats'>
        {post.categories.map((c) => (
          <span className='postCat'>{c.name}</span>
        ))}
      </div> */}

          <span className="post-heading">
            <b>{post.title}</b> -rw-r--r-- root {time}
          </span>
        </div>
        <p
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(excerpt) }}
        ></p>
        <div className="post-link">
          <Link to={`/post/${post._id}`} className="full-post">
            Read the full post &gt;
          </Link>
        </div>
      </div>
    )
  );
}
