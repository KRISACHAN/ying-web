import { useState } from 'react';

import { Alert, Button, Form, Modal, Select, Space, Table, Upload } from 'antd';

import {
    commitNumberData,
    numberDataError,
    previewNumberData,
} from '@/services/luckyNumberData';
import type {
    NumberDataImportMode,
    NumberDataImportOptions,
    NumberDataIssue,
    NumberDataPreview,
} from '@/types/luckyNumber';

interface Props {
    activityKey: string;
    onClose: () => void;
    onCommitted: (written: number) => void;
}

export default function ImportNumberDataModal({
    activityKey,
    onClose,
    onCommitted,
}: Props) {
    const [file, setFile] = useState<File>();
    const [options, setOptions] = useState<NumberDataImportOptions>({
        mode: 'add',
    });
    const [sheets, setSheets] = useState<string[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [busy, setBusy] = useState<'preview' | 'commit'>();
    const [preview, setPreview] = useState<NumberDataPreview>();
    const [error, setError] = useState<string>();
    const [issues, setIssues] = useState<NumberDataIssue[]>([]);

    const clearPreview = () => {
        setPreview(undefined);
        setError(undefined);
        setIssues([]);
    };

    const chooseFile = (newFile?: File) => {
        clearPreview();
        setSheets([]);
        setHeaders([]);
        setOptions({ mode: options.mode });
        setFile(newFile);
        if (newFile && !/\.(xlsx|csv)$/i.test(newFile.name)) {
            setFile(undefined);
            setError('请选择 .xlsx 或 UTF-8 .csv 文件。');
        } else if (newFile && newFile.size > 5 * 1024 * 1024) {
            setFile(undefined);
            setError('文件不能超过 5 MiB。');
        }
    };

    const changeOptions = (next: NumberDataImportOptions) => {
        clearPreview();
        setOptions(next);
    };

    const showImportError = (requestError: unknown, fallback: string) => {
        const response = numberDataError(requestError)?.data;
        setError(response?.message ?? fallback);
        setIssues(response?.errors ?? []);
        if (response?.sheets) setSheets(response.sheets);
        if (response?.headers) setHeaders(response.headers);
    };

    const handlePreview = async () => {
        if (!file || busy) return;
        clearPreview();
        setBusy('preview');
        try {
            const result = await previewNumberData(activityKey, file, options);
            setSheets(result.sheets);
            setHeaders(result.headers ?? []);
            setOptions({
                ...options,
                sheet: result.sheets.length ? result.sheet : undefined,
                number_column: result.number_column,
            });
            setPreview(result);
        } catch (requestError) {
            showImportError(requestError, '预览失败，请重试。');
        } finally {
            setBusy(undefined);
        }
    };

    const handleCommit = async () => {
        if (!file || busy) return;
        clearPreview();
        setBusy('commit');
        try {
            const result = await commitNumberData(activityKey, file, options);
            onCommitted(result.written);
        } catch (requestError) {
            showImportError(
                requestError,
                '导入结果未能读取，请核对当前资料后重试。',
            );
        } finally {
            setBusy(undefined);
        }
    };

    const optionsFor = (list: string[]) =>
        [...new Set(list.filter(Boolean))].map(label => ({
            label,
            value: label,
        }));
    const hint =
        sheets.length > 1 && !options.sheet
            ? '请选择要导入的工作表。'
            : headers.length > 0 && !options.number_column
              ? '请选择用来关联号码池的列。'
              : undefined;

    return (
        <Modal
            open
            title="导入号码资料"
            width={850}
            onCancel={onClose}
            closable={!busy}
            keyboard={!busy}
            maskClosable={!busy}
            footer={[
                <Button key="cancel" onClick={onClose} disabled={!!busy}>
                    取消
                </Button>,
                <Button
                    key="preview"
                    onClick={handlePreview}
                    loading={busy === 'preview'}
                    disabled={
                        !file ||
                        busy === 'commit' ||
                        (sheets.length > 1 && !options.sheet)
                    }
                >
                    预览
                </Button>,
                <Button
                    key="commit"
                    type="primary"
                    onClick={handleCommit}
                    loading={busy === 'commit'}
                    disabled={!file || busy === 'preview'}
                >
                    确认导入
                </Button>,
            ]}
        >
            <Form layout="vertical" disabled={!!busy}>
                <Form.Item
                    label="表格文件"
                    extra="支持 .xlsx 和 UTF-8 .csv，最多 5 MiB。Excel 公式需先粘贴为值。日期转为 UTC 时间，布尔值转为 true 或 false。需保留前导零的券码和电话请设为文本。"
                >
                    <Upload
                        accept=".xlsx,.csv"
                        maxCount={1}
                        fileList={
                            file
                                ? [{ uid: 'number-data-file', name: file.name }]
                                : []
                        }
                        beforeUpload={selected => {
                            chooseFile(selected);
                            return false;
                        }}
                        onRemove={() => chooseFile()}
                    >
                        <Button>选择文件</Button>
                    </Upload>
                </Form.Item>
                {sheets.length > 1 && (
                    <Form.Item label="工作表">
                        <Select
                            aria-label="工作表"
                            value={options.sheet}
                            options={optionsFor(sheets)}
                            placeholder="选择工作表"
                            onChange={sheet => {
                                setHeaders([]);
                                changeOptions({ mode: options.mode, sheet });
                            }}
                        />
                    </Form.Item>
                )}
                {headers.length > 0 && (
                    <Form.Item label="号码列">
                        <Select
                            aria-label="号码列"
                            value={options.number_column}
                            options={optionsFor(headers)}
                            placeholder="选择对应号码池的列"
                            onChange={number_column =>
                                changeOptions({ ...options, number_column })
                            }
                        />
                    </Form.Item>
                )}
                <Form.Item
                    label="导入模式"
                    extra={
                        options.mode === 'update'
                            ? '文件中的资料将覆盖对应号码的已有资料。空单元格会清空对应字段。'
                            : '保留已有号码资料和后台编辑结果。'
                    }
                >
                    <Select<NumberDataImportMode>
                        value={options.mode}
                        options={[
                            { value: 'add', label: '仅新增号码' },
                            { value: 'update', label: '更新已有号码' },
                        ]}
                        onChange={mode => changeOptions({ ...options, mode })}
                    />
                </Form.Item>
            </Form>
            <Space direction="vertical" size="middle" className="w-full">
                {hint && !error && (
                    <Alert type="info" showIcon message={hint} />
                )}
                {error && (
                    <Alert
                        type="error"
                        showIcon
                        message={error}
                        description={
                            issues.length > 0 && (
                                <ul className="max-h-52 overflow-auto pl-4">
                                    {issues.map(
                                        (
                                            { sheet, row, column, reason },
                                            index,
                                        ) => (
                                            <li key={index}>
                                                {[
                                                    sheet,
                                                    row && `第 ${row} 行`,
                                                    column,
                                                    reason,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' · ')}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            )
                        }
                    />
                )}
                {preview?.counts && (
                    <Alert
                        type="success"
                        showIcon
                        message={`新增 ${preview.counts.added} 条 · 已有差异 ${preview.counts.existing} 条 · 无变化 ${preview.counts.unchanged} 条`}
                    />
                )}
                {preview?.samples && (
                    <Table
                        size="small"
                        rowKey="row"
                        pagination={false}
                        scroll={{
                            x: Math.max(
                                500,
                                200 + (preview.columns?.length ?? 0) * 150,
                            ),
                        }}
                        dataSource={preview.samples}
                        columns={[
                            { title: '行号', dataIndex: 'row', width: 85 },
                            {
                                title: '号码',
                                dataIndex: 'drawn_number',
                                width: 105,
                            },
                            ...(preview.columns ?? []).map(column => ({
                                title: column.label,
                                dataIndex: ['values', column.id],
                                width: 150,
                                ellipsis: true,
                            })),
                        ]}
                    />
                )}
            </Space>
        </Modal>
    );
}
