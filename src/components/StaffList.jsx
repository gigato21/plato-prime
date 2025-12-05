import React from 'react';
import UserCard from './staff/UserCard';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const StaffList = ({ 
  staffList,
  onEditStaff,
  onDeleteStaff,
  onToggleStatus
}) => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr justify-items-center w-full"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {staffList.map((staff) => (
        <motion.div key={staff._id} variants={item}>
          <UserCard 
            user={staff} 
            onToggleStatus={onToggleStatus} 
            onEdit={onEditStaff}
            onDelete={() => onDeleteStaff(staff)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaffList;