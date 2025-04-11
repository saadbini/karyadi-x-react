import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { UserProfileAPI } from "../utils/api";
import { HiMiniUserCircle, HiOutlineUserCircle, HiArrowRightStartOnRectangle } from "react-icons/hi2";
import TriggerButton from './TriggerButton'
import Dropdown, { DropdownItem } from './DropdownMenu'

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");  

  // Define pages that need a dark navbar
  const darkNavPages = [
    "/events",
    /^\/events\/\d+$/,
    /^\/events\/agenda\/\d+$/,
    /^\/events\/speakers\/\d+$/,
    /^\/events\/attendees\/\d+$/,
    /^\/events\/organizers\/\d+$/,
    /^\/events\/sponsors\/\d+$/,
  ];

  // Check if the current route matches any dark-themed page
  const isDarkNav = darkNavPages.some((pattern) =>
    typeof pattern === "string"
      ? location.pathname === pattern
      : pattern.test(location.pathname)
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && user.id) {
        try {
          const response = await UserProfileAPI.getProfileByUserId(user.id);
          setDisplayName(response.data.display_name || user.name);
          setEmail(response.data.User.email || user.email);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // fallback to default user values if profile not found
          setDisplayName(user.name); 
          setEmail(user.email);
        }
      }
    };
  
    fetchUserProfile();
  }, [user]);
  

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav
      className={`shadow-md sticky top-0 z-50 transition-all duration-300 ${
        isDarkNav ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
              <Logo />
            </Link>
            <div className="hidden md:flex md:ml-10 space-x-6">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Jobs", path: "/coming-soon" },
                { name: "Events", path: "/events" },
                { name: "TENUN Survey", path: "/forms" }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition duration-200 text-sm font-medium ${
                    isDarkNav ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Dropdown trigger={
                                    <TriggerButton>
                                      <HiMiniUserCircle className="text-2xl" />
                                      {displayName}
                                    </TriggerButton>
                                  }>
                  <DropdownItem>  
                    <div className='py-2'>                      
                      <p className='font-medium'>{displayName}</p>
                      <p className='text-sm font-medium text-gray-500'>{email}</p>
                    </div>
                  </DropdownItem>
                  <DropdownItem>
                    <HiOutlineUserCircle className="text-2xl" />
                    <Link to={user.userType === 'admin' || user.userType === 'company' ? `/profile/user/${user.id}` : '/profile'}>
                    Profile
                    </Link>
                  </DropdownItem>            
                  <DropdownItem>
                    <HiArrowRightStartOnRectangle className="text-2xl" />
                    <button
                      onClick={handleLogout}
                      >
                      Log Out
                    </button>
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium flex items-center ${
                    isDarkNav ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#d44e2c] hover:bg-[#b33a1c] text-white px-3 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`transition duration-200 ${
                isDarkNav ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"
              }`}
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={isOpen}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={`md:hidden py-2 space-y-2 ${isDarkNav ? "bg-black" : "bg-white"}`}>
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Jobs", path: "/coming-soon" },
            { name: "Events", path: "/events" },
            { name: "TENUN Survey", path: "/forms" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 transition duration-200 ${
                isDarkNav
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-black hover:bg-gray-200"
              }`}
            >
              {item.name}
            </Link>
          ))}
          {user ? (
            <>
              <Link
              to={user.userType === 'admin' || user.userType === 'company' ? `/profile/user/${user.id}` : '/profile'}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 transition duration-200 ${
                isDarkNav
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-black hover:bg-gray-200"
              }`}
            >
              Profile
            </Link>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 transition duration-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 transition duration-200 ${
                  isDarkNav
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-black hover:bg-gray-200"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 transition duration-200 ${
                  isDarkNav
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-black hover:bg-blue-200"
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </Transition>
    </nav>
  );
}
