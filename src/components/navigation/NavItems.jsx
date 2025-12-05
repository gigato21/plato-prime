import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSelector } from 'react-redux';

const NavItems = ({ isActive, navItems }) => {
  const userRole = useSelector(state => state.auth.role);

  const filteredNavItems = navItems.filter(item => 
    item.allowedRoles && item.allowedRoles.includes(userRole)
  );

  return (
    <>
      {filteredNavItems.map((item) => (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>
            <Link 
              to={item.path} 
              className={`flex flex-col items-center justify-center h-16 md:h-auto md:py-4 p-2 text-foreground hover:bg-accent transition-all duration-200  md:w-auto ${isActive(item.path)} ${
                isActive(item.path) ? 'md:border-r-2 border-b-2 md:border-b-0' : ''
              }`}
            >
              <item.icon className="h-5 w-5 md:h-7 md:w-7 mx-auto" />
              <span className="text-[10px] mt-1 md:hidden">{item.label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="hidden md:block">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </>
  );
};

export default NavItems;