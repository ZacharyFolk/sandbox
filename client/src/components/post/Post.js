import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { Context } from '../../context/Context';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Paper,
  Typography,
} from '@mui/material';

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
      <Card sx={{ mb: 4 }}>
        <Paper elevation={3}>
          {/* {post.photo && (
        <CardMedia sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      /> ) */}
          {/* //  src={PF + post.photo}  */}

          {/* <div className='postCats'>
        {post.categories.map((c) => (
          <span className='postCat'>{c.name}</span>
        ))}
      </div> */}

          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {post.title}
            </Typography>
            <Divider />
            <Typography
              sx={{ mb: 1.5, mt: 1, fontSize: '80%' }}
              color="text.secondary"
            >
              {time}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="post-p"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(excerpt) }}
            />
          </CardContent>
          <CardActions>
            <Button size="small">
              <Link to={`/post/${post._id}`}>Read the full post &gt;</Link>
            </Button>
          </CardActions>
        </Paper>
      </Card>
    )
  );
}
