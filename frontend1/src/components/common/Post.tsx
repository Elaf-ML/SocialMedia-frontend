import React from "react";
import { FaRegComment, FaHeart, FaTrash } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from 'react-toastify';

const Post = ({ post, onDelete }) => {
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const postOwner = post?.author || {}; // Provide a default empty object if post.user is undefined
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  // Check if the authUser liked the post
  const isLiked = post.likes.includes(authUser?._id);

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/deletePost/${post._id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to delete post');
        }
        return data;
      } catch (error) {
        console.error("Error deleting post:", error);
        throw new Error(error.message || 'Something went wrong!');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Post Is Deleted!");
    }
  });

  const { mutate: postComment } = useMutation({
    mutationFn: async (newComment: { content: string }) => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/Comment/${post._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(newComment),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to post comment');
        }
        return data;
      } catch (error) {
        console.error("Error posting comment:", error);
        throw new Error(error.message || 'Something went wrong!');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setComment('');
      toast.success("Comment posted!");
    },
  });

  const { mutate: likePost } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/likePost/${post._id}`, {
          method: 'POST',
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to like post');
        }
        return data;
      } catch (error) {
        console.error("Error liking post:", error);
        throw new Error(error.message || 'Something went wrong!');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Post liked!");
    },
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: async ({ postId, commentId }: { postId: string, commentId: string }) => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/DeleteComment/${postId}/${commentId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to delete comment');
        }
        return data;
      } catch (error) {
        console.error("Error deleting comment:", error);
        throw new Error(error.message || 'Something went wrong!');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success("Comment deleted!");
    },
  });

  const { mutate: editComment } = useMutation({
    mutationFn: async ({ postId, commentId, content }: { postId: string, commentId: string, content: string }) => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/UpdateComment/${postId}/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ content }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to edit comment');
        }
        return data;
      } catch (error) {
        console.error("Error editing comment:", error);
        throw new Error(error.message || 'Something went wrong!');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Comment edited!");
      
    },
  });

  const isMyPost = authUser?._id === post.author?._id;

  const handlePostComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      postComment({ content: comment });
    } else {
      toast.error("Comment cannot be empty");
    }
  };

  const handleLikePost = () => {
    likePost();
  };

  const handleDeletePost = () => {
    deletePost();
  };

  const handleDeleteComment = (commentId) => {
    deleteComment({ postId: post._id, commentId });
  };

  const handleEditComment = (commentId, newText) => {
    editComment({ postId: post._id, commentId, content: newText });
  };

 
  return (
    <div className='flex flex-col gap-2 items-start p-4 border-b border-gray-700 sm:flex-row'>
      <div className='avatar'>
        <Link to={`/profile/${postOwner.username || 'unknown'}`} className='w-8 rounded-full overflow-hidden'>

         {authUser?.username ==postOwner.username  ? <img src={authUser?.coverImg} alt={`${postOwner.username || 'Unknown'}'s profile`} /> : <img src={post.coverImg} alt={`${postOwner.username || 'Unknown'}'s profile`} />}
        
        </Link>
        
      </div>
      <div className='flex flex-col flex-1 w-full'>
        <div className='flex gap-2 items-center'>
          <Link to={`/profile/${postOwner.username || 'unknown'}`} className='font-bold'>
            {postOwner.username || 'Unknown'}
          </Link>
          <span className='text-gray-700 flex gap-1 text-sm'>
            <Link to={`/profile/${postOwner.username || 'unknown'}`}>@{postOwner.username || 'unknown'}</Link>
          </span>
      
          <span className='text-gray-700 text-sm'>{new Date(post.createdAt).toLocaleString()}</span>
         
          {isMyPost && (
            <>
            
            <FaTrash className='ml-auto cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
            {isPending && <span className="Loading loading-spinner Loading-sm"></span>}
            </>
          )}
        </div>
        <div className='mt-2 flex flex-col gap-2 w-fit'>
          <p>{post.content}</p>
          {post.img && <img src={post.img} alt="Post" className='mt-2 rounded w-96' />}
        </div>
        <div className='flex justify-between mt-3'>
          <div className='flex gap-4 items-center'>
            <div
              className='flex gap-1 items-center cursor-pointer group'
              onClick={() => setShowComments(!showComments)}
            >
              <FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
              <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                {post.comments.length}
              </span>
            </div>
            <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
              {!isLiked && (
                <FaHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
              )}
              {isLiked && <FaHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}
              <span
                className={`text-sm text-slate-500 group-hover:text-pink-500 ${isLiked ? "text-pink-500" : ""}`}
              >
                {post.likes.length}
              </span>
            </div>
          </div>
        </div>
        {showComments && (
          <div className='mt-3 w-full'>
            {post.comments.length === 0 && (
              <p className='text-sm text-slate-500'>No comments yet 🤔 Be the first one 😉</p>
            )}
            {post.comments.map((comment) => (
             console.log("the comment : "+comment._id),
              <div key={comment._id}className='flex gap-2 items-start mt-2'>
                <div className='avatar'>
                  <div className='w-8 rounded-full'>
                    <img src={comment?.coverImg || "/avatar-placeholder.png"} alt={`${comment.username}'s profile`} />
                  </div>
                </div>
                <div className='flex flex-col flex-1'>
                  <div className='flex items-center gap-1'>
                    <span className='font-bold'>{comment.user.username}</span>
                    <span className='text-gray-700 text-sm'>@{comment.username || "unknown"}</span>
                    {authUser?._id === comment.user && (
                     
                      <div className='ml-auto flex gap-2'>
                        <button
                          className='text-red-500 hover:text-red-700'
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </button>
                        <button
                          className='text-blue-500 hover:text-blue-700'
                          onClick={() => {
                            const newText = prompt("Edit your comment:", comment.content);
                            if (newText) {
                              handleEditComment(comment._id, newText);
                            }
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                  <div className='text-sm'>{comment.content}</div>
                </div>
              </div>
            ))}
            <form
              className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
              onSubmit={handlePostComment}
            >
              <textarea
                className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800'
                placeholder='Add a comment...'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                Post
              </button>
            </form>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Post;