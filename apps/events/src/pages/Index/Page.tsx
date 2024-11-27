import React from 'react';
import { Link } from 'react-router-dom';

import HeaderInterface from '@/components/Header/Index';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
} from '@mui/material';
import { Heart } from 'lucide-react';

const routes = [{ path: '/promise', label: '抽取经文', icon: Heart }];

const IndexPage: React.FC = () => {
    return (
        <Box
            className=" bg-app-primary"
            sx={{
                minHeight: '100vh',
                width: '100%',
                p: { xs: 2, sm: 4 },
            }}
        >
            <HeaderInterface name="首页" description="功能列表" />
            <List>
                {routes.map((route, index) => (
                    <ListItem
                        sx={{
                            padding: 0,
                            margin: 0,
                        }}
                        key={index}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <route.icon className="w-9 h-9 text-white fill-current" />
                            </ListItemIcon>
                            <Link to={route.path}>
                                <span className="text-2xl text-white">
                                    {route.label}
                                </span>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default IndexPage;
