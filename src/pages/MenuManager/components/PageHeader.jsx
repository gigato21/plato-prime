import { motion } from "framer-motion";

const PageHeader = ({ title }) => {
  return (
    <motion.h1 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-2xl font-bold text-gray-700 mb-6 "
    >
      {title}
    </motion.h1>
  );
};

export default PageHeader;