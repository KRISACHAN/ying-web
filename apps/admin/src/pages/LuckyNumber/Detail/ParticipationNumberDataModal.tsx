import { useEffect, useState } from 'react';

import {
    Alert,
    Button,
    Descriptions,
    Form,
    Input,
    Modal,
    Space,
    Spin,
} from 'antd';

import {
    getParticipationNumberData,
    numberDataError,
    saveParticipationNumberData,
} from '@/services/luckyNumberData';
import type { LuckyNumber, ParticipationNumberData } from '@/types/luckyNumber';

interface Props {
    activityKey: string;
    record: LuckyNumber;
    readOnly: boolean;
    onClose: () => void;
    onSaved: () => void;
}

export default function ParticipationNumberDataModal({
    activityKey,
    record,
    readOnly,
    onClose,
    onSaved,
}: Props) {
    const [form] = Form.useForm<Record<string, string>>();
    const [data, setData] = useState<ParticipationNumberData>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState<string>();
    const [saveError, setSaveError] = useState<string>();
    const [conflict, setConflict] = useState(false);
    const [comparedDraft, setComparedDraft] =
        useState<Record<string, string>>();
    const [loadRequest, setLoadRequest] = useState<{
        draft?: Record<string, string>;
    }>({});

    useEffect(() => {
        let active = true;
        const { draft } = loadRequest;
        setLoading(true);
        setLoadError(undefined);
        getParticipationNumberData(activityKey, record.id)
            .then(latest => {
                if (!active) return;
                setData(latest);
                if (!draft) form.resetFields();
                form.setFieldsValue(draft ?? latest.values);
                setComparedDraft(draft);
                setSaveError(undefined);
                setConflict(false);
            })
            .catch(error => {
                if (!active) return;
                setLoadError(
                    numberDataError(error)?.data?.message ??
                        '读取号码资料失败，请重试。',
                );
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [activityKey, record.id, form, loadRequest]);

    const reload = () =>
        setLoadRequest({
            draft: conflict ? form.getFieldsValue(true) : undefined,
        });

    const save = async (values: Record<string, string>) => {
        if (!data || readOnly || conflict || saving) return;
        setSaving(true);
        setSaveError(undefined);
        try {
            await saveParticipationNumberData(
                activityKey,
                record.id,
                data.version,
                values,
            );
            onSaved();
        } catch (error) {
            const response = numberDataError(error);
            setSaveError(response?.data?.message ?? '保存失败，请重试。');
            setConflict(response?.status === 409);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            open
            title={readOnly ? '查看号码资料' : '编辑号码资料'}
            onCancel={onClose}
            maskClosable={false}
            closable={!saving}
            keyboard={!saving}
            footer={[
                <Button key="close" onClick={onClose} disabled={saving}>
                    {readOnly ? '关闭' : '取消'}
                </Button>,
                !readOnly && (
                    <Button
                        key="save"
                        type="primary"
                        onClick={() => form.submit()}
                        loading={saving}
                        disabled={!data || loading || conflict || !!loadError}
                    >
                        保存
                    </Button>
                ),
            ]}
        >
            <Space direction="vertical" size="middle" className="w-full">
                <Descriptions
                    size="small"
                    column={2}
                    items={[
                        {
                            key: 'number',
                            label: '号码',
                            children: data?.drawn_number ?? record.drawn_number,
                        },
                        {
                            key: 'username',
                            label: '抽取人',
                            children: data?.username ?? record.username ?? '-',
                        },
                    ]}
                />
                <Alert
                    type="info"
                    showIcon
                    message="同一活动内，抽到相同号码的记录共享这份资料。"
                />
                {loadError && (
                    <Alert
                        type="error"
                        showIcon
                        message={loadError}
                        action={
                            <Button
                                size="small"
                                disabled={loading}
                                onClick={reload}
                            >
                                重新载入
                            </Button>
                        }
                    />
                )}
                {saveError && (
                    <Alert
                        type="error"
                        showIcon
                        message={saveError}
                        action={
                            conflict &&
                            !loadError && (
                                <Button
                                    size="small"
                                    loading={loading}
                                    onClick={reload}
                                >
                                    重新载入
                                </Button>
                            )
                        }
                    />
                )}
                {comparedDraft && (
                    <Alert
                        type="warning"
                        showIcon
                        message="已载入最新资料并保留草稿，请核对差异后保存。"
                    />
                )}
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={save}
                        disabled={saving || loading}
                    >
                        {data?.columns.map(({ id, label }) => {
                            const latestValue = data.values[id];
                            const comparedValue = comparedDraft?.[id];
                            const differs =
                                comparedDraft && comparedValue !== latestValue;
                            return (
                                <Form.Item
                                    key={id}
                                    name={id}
                                    label={label}
                                    rules={[
                                        {
                                            max: 2000,
                                            message: '最多可输入 2,000 个字符',
                                        },
                                    ]}
                                    extra={
                                        differs && (
                                            <div className="whitespace-pre-wrap break-all">
                                                {latestValue
                                                    ? `最新保存值：${latestValue}`
                                                    : '最新保存值为空'}
                                            </div>
                                        )
                                    }
                                >
                                    {/[\r\n]/.test(latestValue) ||
                                    /[\r\n]/.test(comparedValue ?? '') ? (
                                        <Input.TextArea
                                            readOnly={readOnly}
                                            autoSize={{
                                                minRows: 2,
                                                maxRows: 8,
                                            }}
                                        />
                                    ) : (
                                        <Input readOnly={readOnly} />
                                    )}
                                </Form.Item>
                            );
                        })}
                        {data && !data.columns.length && (
                            <p>这份资料没有自定义字段。</p>
                        )}
                    </Form>
                </Spin>
            </Space>
        </Modal>
    );
}
