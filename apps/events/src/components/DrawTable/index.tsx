import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

interface DrawRow {
    id: number;
    username: string | null;
    result: string | number | null;
    createdAt: string | null;
}

export default function DrawTable({
    rows,
    resultLabel,
}: {
    rows: DrawRow[];
    resultLabel: string;
}) {
    return (
        <TableContainer
            component="section"
            role="region"
            aria-label="参与名单"
            tabIndex={0}
            className="event-paper"
            sx={{
                maxHeight: { xs: 'none', md: 'max(300px, 65vh)' },
                minWidth: 0,
            }}
        >
            <Table
                stickyHeader
                aria-label="参与名单"
                sx={{
                    tableLayout: 'fixed',
                    '& th, & td': {
                        px: { xs: 1, sm: 2 },
                        py: { xs: 1.5, sm: 2 },
                        overflowWrap: 'anywhere',
                        color: 'var(--events-ink)',
                        borderColor: 'var(--events-line)',
                        fontSize: {
                            xs: '0.875rem',
                            sm: '1.05rem',
                            lg: '1.25rem',
                        },
                    },
                    '& th': {
                        bgcolor: 'var(--events-surface)',
                        fontWeight: 700,
                    },
                }}
            >
                <colgroup>
                    <col style={{ width: '26%' }} />
                    <col style={{ width: '42%' }} />
                    <col style={{ width: '32%' }} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell scope="col">参与者</TableCell>
                        <TableCell scope="col">{resultLabel}</TableCell>
                        <TableCell scope="col">抽取时间</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3}>暂无参与者</TableCell>
                        </TableRow>
                    )}
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell>{row.username ?? '—'}</TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { lg: '1.45rem' },
                                    fontVariantNumeric: 'tabular-nums',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {row.result ?? '—'}
                            </TableCell>
                            <TableCell
                                sx={{ fontVariantNumeric: 'tabular-nums' }}
                            >
                                {row.createdAt
                                    ? new Date(row.createdAt).toLocaleString(
                                          'zh-CN',
                                      )
                                    : '—'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
