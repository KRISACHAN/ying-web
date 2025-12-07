import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DoNotDisturbOutlined } from '@mui/icons-material';
import {
    Alert,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useInterval } from 'usehooks-ts';

import HeaderInterface from '@/components/Header/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import { themeColors } from '@/theme';
import type { ActivityInfo, LuckyNumber } from '@/types/luckyNumber';

const ErrorInterface: React.FC<{ message?: string }> = ({
    message = '活动不存在或已结束',
}) => {
    return <NotFoundPage name={message} description="回到首页看看其它功能？" />;
};

const headerCellStyle = {
    background: themeColors.background.primary,
    color: themeColors.text.primary,
    fontWeight: 'bold',
    borderBottom: 'none',
    '&:first-of-type': {
        borderTopLeftRadius: 12,
    },
    '&:last-of-type': {
        borderTopRightRadius: 12,
    },
};

const QRCodeInterface: React.FC<{ activityKey?: string }> = ({
    activityKey,
}) => {
    if (!activityKey) return null;

    const qrCodeUrl = `${window.location.origin}/lucky-number/${activityKey}/activity`;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    p: 2,
                    borderRadius: 3,
                    background: themeColors.background.paper,
                    boxShadow: `0 4px 16px ${themeColors.background.overlay}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: { xs: '100%', md: '400px' },
                    aspectRatio: '1 / 1',
                }}
            >
                {/* @ts-ignore - qrcode.react type compatibility issue with React 18 */}
                <QRCodeSVG
                    value={qrCodeUrl}
                    size={400}
                    level="M"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            </Box>
            <Typography
                variant="h4"
                sx={{
                    color: '#fff',
                    textAlign: 'center',
                }}
            >
                扫描二维码参与活动
            </Typography>
        </Box>
    );
};

const TableInterface: React.FC<{
    participations: LuckyNumber[];
}> = ({ participations }) => {
    if (!participations) return null;

    const isEmpty = participations.length === 0;

    const EmptyInterface: React.FC = () => (
        <TableRow>
            <TableCell colSpan={12}>
                <Typography
                    variant="body1"
                    className="flex items-center gap-2 text-primary"
                >
                    <DoNotDisturbOutlined />
                    暂无参与者
                </Typography>
            </TableCell>
        </TableRow>
    );

    const ExistingInterface: React.FC = () => (
        <>
            {participations.map((record, index) => (
                <TableRow key={index}>
                    <TableCell align="center" colSpan={4}>
                        {record.username}
                    </TableCell>
                    <TableCell align="center" colSpan={4}>
                        {record.drawn_number}
                    </TableCell>
                    <TableCell align="center" colSpan={4}>
                        {record.created_at
                            ? new Date(record.created_at).toLocaleString(
                                  'zh-CN',
                              )
                            : '-'}
                    </TableCell>
                </TableRow>
            ))}
        </>
    );

    return (
        <TableContainer
            component={Paper}
            sx={{
                maxWidth: '1024px',
                width: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: `0 4px 16px ${themeColors.background.overlay}`,
                background: themeColors.background.paper,
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                            colSpan={4}
                            sx={headerCellStyle}
                        >
                            参与者
                        </TableCell>
                        <TableCell
                            align="center"
                            colSpan={4}
                            sx={headerCellStyle}
                        >
                            号码
                        </TableCell>
                        <TableCell
                            align="center"
                            colSpan={4}
                            sx={headerCellStyle}
                        >
                            抽取时间
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isEmpty ? <EmptyInterface /> : <ExistingInterface />}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const LuckyNumberListPage: React.FC = () => {
    const { activityKey } = useParams();
    const { queryActivityInfo, queryParticipations } = useLuckyNumber();
    const [activityInfo, setActivityInfo] = useState<ActivityInfo | null>(null);
    const [participations, setParticipations] = useState<LuckyNumber[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const headerContext = useHeader();

    const fetchActivityInfo = async () => {
        try {
            const info = await queryActivityInfo(activityKey);
            setActivityInfo(info);
            headerContext.setHeaderInfo({
                title: info.name,
                description: info.description,
                keywords: info.activity_key,
            });
        } catch (err) {
            setError(err as Error);
        }
    };

    const fetchParticipations = async () => {
        if (!activityKey) return;
        try {
            const records = await queryParticipations(activityKey);
            setParticipations(records);
        } catch (err) {
            setError(err as Error);
        }
    };

    useEffect(() => {
        if (!activityKey || !!error) return;
        fetchActivityInfo();
        fetchParticipations();
    }, [activityKey]);

    useInterval(
        () => {
            fetchParticipations();
        },
        !activityKey || !!error ? null : 2000,
    );

    const errorMessage = error?.toString?.();
    const is404Error = errorMessage?.includes('404');
    const is400Error = errorMessage?.includes('400');
    const isNotStartedError = errorMessage?.includes('未开始');
    const isEndedError = errorMessage?.includes('已结束');

    if (is404Error) {
        return <ErrorInterface />;
    }

    if (is404Error) {
        return <ErrorInterface />;
    }

    if (is400Error) {
        return (
            <NotFoundPage
                name="活动未开始或已结束"
                description="回到首页看其它功能？"
            />
        );
    }

    if (isNotStartedError) {
        return <ErrorInterface message="活动未开始" />;
    }

    if (isEndedError) {
        return <ErrorInterface message="活动已结束" />;
    }

    const isEmpty = participations.length === 0;

    return (
        <Box
            className="min-h-screen w-full bg-primary"
            sx={{
                p: { xs: 2, sm: 4 },
            }}
        >
            <Box
                sx={{
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                }}
            >
                <HeaderInterface
                    description={activityInfo?.description}
                    name={activityInfo?.name}
                />
                {error ? (
                    <Alert severity="error">获取活动数据失败，请稍后再试</Alert>
                ) : isEmpty ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '50vh',
                            width: '100%',
                        }}
                    >
                        <QRCodeInterface activityKey={activityKey} />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'center', md: 'flex-start' },
                            justifyContent: 'center',
                            gap: { xs: 5, md: 5 },
                            width: '100%',
                            maxWidth: '1400px',
                        }}
                    >
                        <Box
                            sx={{
                                flexShrink: 0,
                                display: 'flex',
                                justifyContent: 'center',
                                width: { xs: '100%', md: 'auto' },
                            }}
                        >
                            <QRCodeInterface activityKey={activityKey} />
                        </Box>
                        <Box
                            sx={{
                                flex: { xs: '1 1 auto', md: '1 1 0' },
                                width: { xs: '100%', md: 'auto' },
                                maxWidth: { xs: '1024px', md: 'none' },
                            }}
                        >
                            <TableInterface participations={participations} />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default LuckyNumberListPage;
