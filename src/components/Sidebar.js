import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import Modal from "../components/Modal";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import "./Sidebar.css";
import DashboardIcon from "../assets/dashboard_icon.svg";
import SignoutIcon from "../assets/signout_icon.svg";
import AddIcon from "../assets/add_icon.svg";
import loadingGif from "../assets/Loader.svg";
import MenuIcon from "../assets/burger.svg"; // Add the menu icon
import OnlineUsers from "./OnlineUsers";
import UserIcon from '../assets/users.png'

export default function Sidebar() {
  const { user } = useAuthContext();
  const [width, setWidth] = useState(window.innerWidth);
  const mobileBreakpoint = 720;
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility
  const { logout, isPending } = useLogout();
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {isPending && (
        <div className="full-page-loading-modal">
          <img src={loadingGif} alt="Loading" className="loading-gif" />
        </div>
      )}
      {width <= mobileBreakpoint && (
        <div className="menu-icon" onClick={toggleSidebar}>
          <img src={MenuIcon} alt="Menu Icon" className="menuu" />
        </div>
      )}
      <div className={`sidebar ${width <= mobileBreakpoint && !sidebarOpen ? 'closed' : 'open'}`}>
        <div className="sidebar-content">
          <div className="user">
            <Avatar src={user.photoURL} />
            <p>Welcome, {user.displayName}</p>
          </div>
          <nav className="links">
            <ul>
              <li>
                <NavLink to="/">
                  <div className="link">
                    <img src={DashboardIcon} alt="dashboard icon" />
                    <span>Home</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink to="/create">
                  <div className="link">
                    <img src={AddIcon} alt="add icon" />
                    <span>Create Project</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink to="/users">
                  <div className="link">
                    <img src={UserIcon} alt="user icon" />
                    <span>Users</span>
                  </div>
                </NavLink>
              </li>
              {user && (
                <li>
                  {!isPending && (
                    <div className="signout" onClick={logout}>
                      <img src={SignoutIcon} alt="signout icon" />
                      <span>Sign Out</span>
                    </div>
                  )}
                  {isPending && (
                    <div className="signout" disabled>
                      <img src={SignoutIcon} alt="signout icon" />
                      <div>Sign out</div>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </nav>
        </div>
        {isOpen && <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
      </div>
      {sidebarOpen && width <= mobileBreakpoint && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
}
