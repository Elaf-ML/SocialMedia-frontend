import Reddit from "../svgs/Reddit";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
    const queryClient = useQueryClient();

    const { mutate: logout, isPending, isError, error } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/logout", {
                    method: "POST",
                    credentials: 'include', // Include credentials (cookies)
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message);
                }

                return data;
            } catch (error) {
                throw new Error(error.response ? error.response.data : error.message);
            }
        },
        onSuccess: () => {
            toast.success("Logout successful");
            queryClient.invalidateQueries(['authUser']);
            console.log("Logout successfully");
        },
        onError: (error) => {
            toast.error('Error logging out. Please try again.');
            console.error(error);
        },
    });


 const {data : authUser} = useQuery({ queryKey: ['authUser'] });



    return (
        <div className='md:flex-[2_2_0] w-18 max-w-52'>
            <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
                <ul className='flex flex-col gap-3 mt-4'>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/'
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <MdHomeFilled className='w-8 h-8' />
                            <span className='text-lg hidden md:block'>Home</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to={`/profile/${authUser?.username}`}
                            className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <FaUser className='w-6 h-6' />
                            <span className='text-lg hidden md:block'>Profile</span>
                        </Link>
                    </li>
                </ul>
                {authUser && (
                    <Link
                        to={`/profile/${authUser.username}`}
                        className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
                    >
                        <div className='avatar hidden md:inline-flex'>
                            <div className='w-8 rounded-full'>
                                <img src={authUser?.coverImg || "/avatar-placeholder.png"} />
                            </div>
                        </div>
                        <div className='flex justify-between flex-1'>
                            <div className='hidden md:block'>
                                <p className='text-white font-bold text-sm w-20 truncate'>{authUser?.username}</p>
                                <p className='text-slate-500 text-sm'>@{authUser?.username}</p>
                            </div>
                            <BiLogOut className='w-5 h-5 cursor-pointer' onClick={(e) => {
                                e.preventDefault();
                                logout();
                            }} />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Sidebar;