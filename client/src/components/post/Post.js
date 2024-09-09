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
      <div className="post-container">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-time">{time}</p>

        <p
          className="post-excerpt"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(excerpt) }}
        />

        <Link to={`/post/${post._id}`} className="read-more">
          Read the full post &gt;
        </Link>
      </div>
    )
  );
}
