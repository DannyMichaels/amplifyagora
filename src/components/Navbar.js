import React from 'react';
import { Menu as Nav, Icon, Button } from 'element-react';
import { NavLink } from 'react-router-dom';
import { useStateValue } from '../context/currentUser';

const Navbar = ({ handleSignOut }) => {
  const { currentUser } = useStateValue();

  return (
    <Nav mode="horizontal" theme="dark" defaultActive="1">
      <div className="nav-container">
        {/* App title / icon */}
        <Nav.Item index="1">
          <NavLink to="/" className="nav-link">
            <span className="app-title">
              <img
                src="https://icon.now.sh/account_balance/f90"
                alt="logo"
                className="app-icon"
              />
              AmplifyAgora
            </span>
          </NavLink>
        </Nav.Item>

        {/* Navbar items */}
        <div>
          <Nav.Item index="2">
            <span className="app-user">Hello, {currentUser.username}</span>
          </Nav.Item>

          <NavLink to="/profile" className="nav-link">
            <Nav.Item index="3">
              <Icon name="setting" />
              Profile
            </Nav.Item>
          </NavLink>

          <Nav.Item index="4">
            <Button type="warning" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Nav.Item>
        </div>
      </div>
    </Nav>
  );
};

export default Navbar;
