import { MouseEvent, useState } from 'react';
import {
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  listClasses,
  listItemIconClasses,
  paperClasses,
} from '@mui/material';
import Button from '@mui/material/Button';
import { supabase } from 'lib/supabase';
import { useAuth } from 'providers/AuthProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import StatusAvatar from 'components/base/StatusAvatar';

const ProfileMenu = () => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    handleClose();
    await supabase.auth.signOut();
  };

  const userInitial = user?.email?.[0].toUpperCase() || 'U';

  const userName = user?.email?.split('@')[0] || 'User';

  return (
    <>
      <Button
        color="neutral"
        variant="text"
        onClick={handleOpen}
        sx={{ height: 44, width: 44, borderRadius: '50%' }}
      >
        <StatusAvatar
          alt={userName}
          status="online"
          sx={{
            width: 40,
            height: 40,
            border: 2,

            borderColor: 'background.paper',
            bgcolor: 'primary.main',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            color: 'white',
          }}
        >
          {userInitial}
        </StatusAvatar>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          [`& .${paperClasses.root}`]: { minWidth: 280, mt: 1.5 },

          [`& .${listClasses.root}`]: { py: 0 },
        }}
      >
        <Stack sx={{ alignItems: 'center', gap: 1, px: 3, py: 2 }}>
          <StatusAvatar
            status="online"
            sx={{ width: 48, height: 48, bgcolor: 'primary.main', color: 'white' }}
          >
            {userInitial}
          </StatusAvatar>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Box sx={{ py: 1 }}>
          <MenuItem onClick={handleClose} sx={{ gap: 1 }}>
            <ListItemIcon
              sx={{ [`& .${listItemIconClasses.root}`]: { minWidth: 'unset !important' } }}
            >
              <IconifyIcon icon="material-symbols:manage-accounts-outline-rounded" />
            </ListItemIcon>
            <Typography variant="body2">Account Settings</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ gap: 1, color: 'error.main' }}>
            <ListItemIcon
              sx={{
                [`& .${listItemIconClasses.root}`]: {
                  minWidth: 'unset !important',
                  color: 'inherit',
                },
              }}
            >
              <IconifyIcon icon="material-symbols:logout-rounded" />
            </ListItemIcon>
            <Typography variant="body2">Sign Out</Typography>
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
