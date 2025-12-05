import React from 'react';
import { Mail, Phone, UserCircle } from 'lucide-react';

const UserCardHeader = ({ user }) => {
  return (
    <div className="flex items-start gap-4 mb-4">
      <div className="bg-cartaai-red/10 p-3 rounded-full">
        <UserCircle className="w-8 h-8 text-cartaai-red" />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-cartaai-white">{user.name}</h2>
        <div className="flex items-center gap-2 text-sm text-cartaai-white/70">
          <Mail className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-2 text-sm text-cartaai-white/70 mt-1">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCardHeader;