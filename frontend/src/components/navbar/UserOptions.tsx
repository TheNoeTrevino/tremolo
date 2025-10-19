import { Tooltip, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const UserOptions = () => {
	const settings = [
		{ name: "Profile", path: "/profile" },
		{ name: "Account", path: "/account" },
		{ name: "Dashboard", path: "/dashboard" },
	];

	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	return (
		<>
			<Tooltip title="Open settings">
				<IconButton onClick={handleOpenUserMenu} sx={{ mr: -5 }}></IconButton>
			</Tooltip>
			<Menu
				sx={{ mt: "45px" }}
				id="menu-appbar"
				anchorEl={anchorElUser}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={Boolean(anchorElUser)}
				onClose={handleCloseUserMenu}
			>
				{settings.map((setting) => (
					<MenuItem
						key={setting.name}
						component={Link}
						to={setting.path}
						onClick={handleCloseUserMenu}
					>
						<Typography sx={{ textAlign: "center" }}>{setting.name}</Typography>
					</MenuItem>
				))}
				<MenuItem key="Log Out">
					<Typography sx={{ textAlign: "center" }}>Log Out</Typography>
				</MenuItem>
			</Menu>
		</>
	);
};

export default UserOptions;
