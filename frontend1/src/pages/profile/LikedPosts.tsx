import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Post from '../../components/common/Post';
import Cookies from 'js-cookie';

interface PostType {
  _id: string;
  likes: string[];
  // ...other post properties
}

const LikedPosts = ({ feedType }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  const fetchPosts = async () => {
    const token = Cookies.get('token');
    let url = '';

    if (feedType === 'likes') {
      url = 'http://localhost:5000/api/posts/likedPosts';
    } else if (feedType === 'authUserPosts') {
      url = 'http://localhost:5000/api/posts/myPosts';
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [feedType]);

  const handleLikePost = async (postId: string) => {
    const token = Cookies.get('token');
    try {
      const response = await fetch(`http://localhost:5000/api/posts/likePost/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to like/unlike post');
      }

      const data = await response.json();
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? { ...post, likes: data.post.likes } : post
        )
      );
      queryClient.invalidateQueries({ queryKey: ['likedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['authUserPosts'] });
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map(post => (
          <Post key={post._id} post={post} onLike={() => handleLikePost(post._id)} />
        ))
      )}
    </div>
  );
};

export default LikedPosts;