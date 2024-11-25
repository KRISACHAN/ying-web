import { List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { Heart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const routes = [{ path: '/promise', label: '抽取经文', icon: Heart }];

const IndexPage: React.FC = () => {
    return (
        <div className="bg-[#EBF5FF]">
            <h1 className="text-2xl p-4">功能列表</h1>
            <List>
                {routes.map((route, index) => (
                    <ListItem key={index}>
                        <ListItemButton>
                            <ListItemIcon>
                                <route.icon className="w-9 h-9 text-red-400 fill-current" />
                            </ListItemIcon>
                            <Link to={route.path}>
                                <span className="text-2xl">{route.label}</span>
                            </Link>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default IndexPage;