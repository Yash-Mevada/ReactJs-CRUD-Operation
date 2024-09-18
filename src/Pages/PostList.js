import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostList = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://gorest.co.in/public/v2/posts', {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` }
      })
      .then((response) => {
        const userPosts = response.data.filter((post) => post.user_id === Number(userId));
        setPosts(userPosts);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {posts.length === 0 ? (
        <p>Post not found</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
