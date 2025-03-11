import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const NotificationPage = () => {
    const queryClient = useQueryClient();
    const { data: authUser } = useQuery({ queryKey: ['authUser'] });

    const { data: notifications, isLoading, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await fetch(`http://localhost:5000/api/notifications/notifications`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch notifications");
            }
            return data;
        },
        enabled: !!authUser,
    });

    const deleteNotificationsMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch(`http://localhost:5000/api/notifications/DeleteNotifications`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!res.ok) {
                throw new Error("Failed to delete notifications");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const userNotifications = notifications.filter(notification => notification.to === authUser._id);

    const deleteNotifications = () => {
        deleteNotificationsMutation.mutate();
    };

    return (
        <>
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
                <div className='flex justify-between items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>Notifications</p>
                    <div className='dropdown '>
                        <div tabIndex={0} role='button' className='m-1'>
                            <IoSettingsOutline className='w-4' />
                        </div>
                        <ul
                            tabIndex={0}
                            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
                        >
                            <li>
                                <a onClick={deleteNotifications}>Delete all notifications</a>
                            </li>
                        </ul>
                    </div>
                </div>
                {isLoading && (
                    <div className='flex justify-center h-full items-center'>
                        <LoadingSpinner size='lg' />
                    </div>
                )}
                {userNotifications.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
                {userNotifications.map((notification) => (
                    <div className='border-b border-gray-700' key={notification._id}>
                        <div className='flex gap-2 p-4'>
                            {notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
                            {notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
                            {notification.type === "comment" && <FaComment className='w-7 h-7 text-white' />}

                            <Link to={`/profile/${notification.from.name}`}>
                                <div className='avatar'>
                                    <div className='w-8 rounded-full'>
                                        <img src={notification.from.profileImg || "/avatar-placeholder.png"} />
                                    </div>
                                </div>
                                <div className='flex gap-1'>
                                    <span className='font-bold'>@{notification.from.name}</span>{" "}
                                    {notification.type === "follow" && "followed you"}
                                    {notification.type === "comment" && "commented on your post"}
                                    {notification.type === "like" && "liked your post"}
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default NotificationPage;