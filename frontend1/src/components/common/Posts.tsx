import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Post from "./Post";

interface PostsProps {
    feedType: string;
}

const Posts: React.FC<PostsProps> = ({ feedType }) => {
    const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

    const { data: posts, isLoading, isError, error, refetch, isRefetching } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            try {
                const res = await fetch("http://localhost:5000/api/posts/getPosts", {
                    credentials: 'include',
                });

                if (!res.ok) {
                    const errorData = await res.text();
                    console.log("Error: ", errorData);
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }

                const data = await res.json();
                console.log("Fetched data: ", data);
                return data;
            } catch (error) {
                console.error("Fetch error: ", error.message);
                throw new Error(error.message);
            }
        },
    });

    const { data: authUser, isLoading: authUserLoading } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await fetch("http://localhost:5000/api/users/authUser", {
                credentials: 'include',
            });
            const data = await res.json();
            return data;
        },
    });

    useEffect(() => {
        if (authUser) {
            setBlockedUsers(authUser.blockedUsers.map((user: any) => user.userId));
        }
    }, [authUser]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const filteredPosts = posts?.filter((post: any) => !blockedUsers.includes(post.author._id));

    return (
        <>
            {(isLoading || isRefetching) && (
                <div className="flex flex-col justify-center">
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            )}
            {!isLoading && !isRefetching && filteredPosts?.length === 0 && <p>No posts found</p>}
            {!isLoading && !isRefetching && filteredPosts && (
                <div>
                    {filteredPosts.map((post: any) => (
                        <Post key={post._id} post={post} onDelete={() => { /* handle delete */ }} onLike={() => { /* handle like */ }} />
                    ))}
                </div>
            )}
        </>
    );
};

export default Posts;