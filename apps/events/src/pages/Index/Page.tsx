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
            sx={{
                minHeight: '100vh',
                width: '100%',
                px: { xs: 2, sm: 4 },
                py: { xs: 2, sm: 4 },
                background:
                    'linear-gradient(135deg, #EBF5FF 0%, #F0F7FF 50%, #E6F3FF 100%)',
            }}
        >
            <HeaderInterface
                name="首页"
                description="功能列表"
                color="#F87171"
            />
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
                                <route.icon className="w-9 h-9 text-red-400 fill-current" />
                            </ListItemIcon>
                            <Link to={route.path}>
                                <span className="text-2xl text-red-400">
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
