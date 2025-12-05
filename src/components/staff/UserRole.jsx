import React from 'react';
import { Shield } from 'lucide-react';

const UserRole = ({ role }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cartaai-red/10 border border-cartaai-red/20 w-fit">
        <Shield className="w-4 h-4 text-cartaai-red" />
        <span className="text-sm font-medium text-cartaai-red">
          {role?.name}
        </span>
      </div>
    </div>
  );
};

export default UserRole;