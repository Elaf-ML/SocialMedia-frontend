import { useRef, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";
import LikedPosts from "./LikedPosts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import BlockedAccountsModal from "./BlockedAccountsModal";
import { useQuery, useQueryClient } from "@tanstack/react-query"; 
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient(); 
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("authUserPosts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const [blockedAccounts, setBlockedAccounts] = useState([]);
  const [isBlockedAccountsModalOpen, setIsBlockedAccountsModalOpen] = useState(false);

  const { data: authUser, isLoading: authUserLoading } = useQuery({ queryKey: ['authUser'] });
  const { data: userProfile, isLoading: userProfileLoading } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/api/users/profile/${username}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user profile");
      }
      return data;
    },
  });

  useEffect(() => {
    if (authUser && userProfile) {
      setIsFollowing(userProfile.followers.includes(authUser._id));
      setIsBlocked(authUser.blockedUsers.some((user) => user.userId === userProfile._id));
    }
  }, [authUser, userProfile]);

  const isMyProfile = authUser?.username === username;

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async ({ username, currentPassword, newPassword, bio, link, coverImg , profileImg }) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, currentPassword, newPassword, bio, link, coverImg , profileImg }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Update failed');
      }
  
      await queryClient.invalidateQueries(['userProfile', username]);
      setCoverImg(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleOpenModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/follow/${userProfile._id}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Follow failed');
      }

      setIsFollowing(true);
      await queryClient.invalidateQueries(['userProfile', username]);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/follow/${userProfile._id}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Unfollow failed');
      }

      setIsFollowing(false);
      await queryClient.invalidateQueries(['userProfile', username]);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleShowBlockedAccounts = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/users/blocked', {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        setBlockedAccounts(data);
        setIsBlockedAccountsModalOpen(true);
    } catch (error) {
        console.error('Error fetching blocked accounts:', error);
    }
  };

  const handleBlockUnblock = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/users/block/${userId}`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Block/Unblock failed');
        }

        setIsBlocked(!isBlocked);
    } catch (error) {
        console.error('Error blocking/unblocking user:', error);
    }
  };

  if (authUserLoading || userProfileLoading) {
    return <ProfileHeaderSkeleton />;
  }

  if (!userProfile) {
    return <p className='text-center text-lg mt-4'>User not found</p>;
  }

  return (
    <>
      <div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
        <div className='flex flex-col'>
          <div className='flex gap-10 px-4 py-2 items-center'>
            <Link to='/'>
              <FaArrowLeft className='w-4 h-4' />
            </Link>
            <div className='flex flex-col'>
              <p className='font-bold text-lg'>{userProfile?.username}</p>
              <span className='text-sm text-slate-500'>{userProfile?.posts?.length} posts</span>
            </div>
          </div>
          <div className='relative group/cover'>
          <img
            src={profileImg || userProfile?.profileImg || "/cover.png"}
            className='h-52 w-full object-cover cursor-pointer'
            alt='cover image'
            onClick={() => coverImgRef.current.click()}
          />
            {isMyProfile && (
              <div
                className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                onClick={() => coverImgRef.current.click()}
              >
                <MdEdit className='w-5 h-5 text-white' />
              </div>
            )}

            <input
              type='file'
              hidden
              accept="image/*"
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, "coverImg")}
            />
          <input
            type='file'
            hidden
            accept="image/*"
            ref={profileImgRef}
            onChange={(e) => handleImgChange(e, "profileImg")}
          />
            <div className='avatar absolute -bottom-16 left-4'>
              <div className='w-32 rounded-full relative group/avatar'>
                <img src={coverImg || userProfile?.coverImg || "/avatar-placeholder.png"} />
                <div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                  {isMyProfile && (
                    <MdEdit
                      className='w-4 h-4 text-white'
                      onClick={() => profileImgRef.current.click()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-end px-4 mt-5'>
            {isMyProfile && (
              <button
                className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
                onClick={() => setIsModalOpen(true)}
              >
                Edit Profile
              </button>
            )}
            {!isMyProfile && (
              <>
                <button
                  className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'} rounded-full btn-sm`}
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                <button
                  className='btn btn-secondary rounded-full btn-sm text-white ml-2'
                  onClick={() => handleBlockUnblock(userProfile._id)}
                >
                  {isBlocked ? 'Unblock' : 'Block'}
                </button>
              </>
            )}

            {isMyProfile && (
                <button
                    className='btn btn-secondary rounded-full btn-sm text-white ml-2'
                    onClick={handleShowBlockedAccounts}
                >
                    Blocked Accounts
                </button>
            )}
          </div>
        
          {/* Rest of the JSX remains unchanged */}
          <div className='flex flex-col gap-4 mt-14 px-4'>
            <div className='flex flex-col'>
              <span className='font-bold text-lg'>{userProfile?.username}</span>
              <span className='text-sm text-slate-500'>@{userProfile?.username}</span>
              <span className='text-sm my-1'>{userProfile?.bio.length === 0 && <>There Is No Bio Yet</>}</span>
              <span className='text-sm my-1'>{userProfile?.bio.length > 0 && <>{userProfile?.bio}</>}</span>
            </div>

            <div className='flex gap-2 flex-wrap'>
              {userProfile?.link && (
                <div className='flex gap-1 items-center '>
                  <>
                    <FaLink className='w-3 h-3 text-slate-500' />
                    <a
                      href={userProfile?.link}
                      target='_blank'
                      rel='noreferrer'
                      className='text-sm text-blue-500 hover:underline'
                    >
                      {userProfile?.link}
                    </a>
                  </>
                </div>
              )}
              <div className='flex gap-2 items-center'>
                <IoCalendarOutline className='w-4 h-4 text-slate-500' />
                <span className='text-sm text-slate-500'>Joined {new Date(userProfile?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className='flex gap-2'>
              <div className='flex gap-1 items-center' onClick={() => handleOpenModal("Following", userProfile?.following)}>
                <span className='font-bold text-xs'>{userProfile?.following.length}</span>
                <span className='text-slate-500 text-xs'>Following</span>
              </div>
              <div className='flex gap-1 items-center' onClick={() => handleOpenModal("Followers", userProfile?.followers)}>
                <span className='font-bold text-xs'>{userProfile?.followers.length}</span>
                <span className='text-slate-500 text-xs'>Followers</span>
              </div>
            </div>
          </div>
          <div className='flex w-full border-b border-gray-700 mt-4'>
            <div
              className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer'
              onClick={() => setFeedType("authUserPosts")}
            >
              Posts
              {feedType === "authUserPosts" && (
                <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
              )}
            </div>
            <div
              className='flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer'
              onClick={() => setFeedType("likes")}
            >
              Likes
              {feedType === "likes" && (
                <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
              )}
            </div>
          </div>
        </div>

        {feedType === "authUserPosts" && (
          <>
            <LikedPosts feedType="authUserPosts" />
          </>
        )}
        {feedType === "likes" && (
          <>
            <LikedPosts feedType="likes" />
          </>
        )}
      </div>

      {isModalOpen && (
        <EditProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userProfile={userProfile}
          onUpdate={handleUpdateProfile}
        />
      )}

      <BlockedAccountsModal
        isOpen={isBlockedAccountsModalOpen}
        onClose={() => setIsBlockedAccountsModalOpen(false)}
        blockedAccounts={blockedAccounts}
        handleBlockUnblock={handleBlockUnblock}
        setBlockedAccounts={setBlockedAccounts}
      />
    </>
  );
};

export default ProfilePage;