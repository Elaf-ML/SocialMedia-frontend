import { useState } from "react";

const EditProfileModal = ({ isOpen, onClose, userProfile, onUpdate }) => {
  const [username, setUsername] = useState(userProfile?.username || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [link, setLink] = useState(userProfile?.link || "");
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0] ;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0] ;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ username, currentPassword, newPassword, bio, link, coverImg, profileImg });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 rounded" placeholder="Username"  />
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="border p-2 rounded" placeholder="Current Password"  />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border p-2 rounded" placeholder="New Password" />
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="border p-2 rounded" placeholder="Bio" />
          <input type="text" value={link} onChange={(e) => setLink(e.target.value)} className="border p-2 rounded" placeholder="Website Link" />
          <p>Choose a CoverImg:</p>
          <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded" />
          <p>Choose a ProfileImg:</p>
          <input type="file" accept="image/*" onChange={handleProfileChange} className="border p-2 rounded" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update</button>
          <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
