import { useNavigate } from 'react-router-dom';

import { Card, Col, Row } from 'antd';
import { Activity } from 'lucide-react';

const Index = () => {
    const navigate = useNavigate();

    const cards = [
        {
            title: '幸运号码活动',
            icon: <Activity className="h-8 w-8 text-blue-500" />,
            onClick: () => navigate('/lucky-number'),
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">首页</h1>
            <Row gutter={[16, 16]}>
                {cards.map((card, index) => (
                    <Col key={index} xs={24} sm={12} lg={8}>
                        <Card
                            hoverable
                            onClick={card.onClick}
                            className="cursor-pointer transition-all hover:shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 m-0 p-0">
                                        {card.title}
                                    </p>
                                </div>
                                {card.icon}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Index;
