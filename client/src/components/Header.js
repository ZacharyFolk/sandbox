import { useState } from 'react';
import {
  AppBar,
  Drawer,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ComputerIcon from '@mui/icons-material/Computer';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <AppBar position="sticky" sx={{ width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Button
            size="large"
            edge="start"
            sx={{ marginRight: 2 }}
            component={Link}
            to="/"
          >
            <span className="logo-name"> {`{{ folk.codes }}`}</span>
          </Button>
        </Toolbar>
      </AppBar>

      {/* <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={toggleMenu}
        sx={{ width: '80%' }}
      >
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          <ListItemButton>
            <ListItemIcon>
              <ComputerIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </List>
      </Drawer> */}
    </>
  );
};
