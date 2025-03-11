import React from 'react';

const BlockedAccountsModal = ({ isOpen, onClose, blockedAccounts, handleBlockUnblock, setBlockedAccounts }) => {
    if (!isOpen) return null;

    const handleUnblock = async (userId) => {
        await handleBlockUnblock(userId);
        // Remove the unblocked user from the list
        const updatedBlockedAccounts = blockedAccounts.filter(user => user.userId !== userId);
        setBlockedAccounts(updatedBlockedAccounts);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
                <h2 className="text-lg font-bold mb-4">Blocked Accounts</h2>
                <ul>
                    {blockedAccounts.map((user) => (
                        <li key={user.userId} className="flex items-center gap-2 mb-2">
                            <img 
                                src={user.coverImg || "/avatar-placeholder.png"} 
                                alt={user.username} 
                                className="w-8 h-8 rounded-full" 
                            />
                            <span>{user.username}</span>
                            <button
                                className="btn btn-sm btn-outline ml-2"
                                onClick={() => handleUnblock(user.userId)}
                            >
                                Unblock
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="btn btn-primary mt-4" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default BlockedAccountsModal;