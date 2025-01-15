import { message } from 'antd';
import { useCallback, useState } from 'react';

import axiosInstance from '@/services/axios';
import { ALLOWED_RESOURCE_TYPES } from '@/utils/constants';
import { fileToBase64 } from '@/utils/helpers';

export interface OssUploadResponse {
    url: string;
    name: string;
    size: number;
    resource_type: string;
}

export const useOss = () => {
    const [loading, setLoading] = useState(false);

    const uploadFile = useCallback(async (file: File) => {
        setLoading(true);
        try {
            if (!Object.keys(ALLOWED_RESOURCE_TYPES).includes(file.type)) {
                message.error('不支持的文件类型，仅支持图片、视频和音频文件');
                return Promise.reject();
            }

            const base64 = await fileToBase64(file);
            const resource = base64.split(',')[1];

            const response = await axiosInstance.post<
                {},
                {
                    data: OssUploadResponse;
                }
            >(
                '/oss/upload',
                {
                    name: `img/${file.name}`,
                    resource,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            return {
                ...response,
                data: {
                    ...response.data,
                    resource_type:
                        ALLOWED_RESOURCE_TYPES[
                            file.type as keyof typeof ALLOWED_RESOURCE_TYPES
                        ],
                },
            };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        uploadFile,
        loading,
    };
};
