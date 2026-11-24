import type {
    NumberDataImportOptions,
    NumberDataIssue,
    NumberDataPreview,
    ParticipationNumberData,
} from '@/types/luckyNumber';
import { KEYS } from '@/utils/constants';

import axiosInstance from './axios';
import { localCache } from './storage';

const activityPath = (key: string) =>
    `/lucky-number/${encodeURIComponent(key)}`;
const participationPath = (key: string, id: number) =>
    `${activityPath(key)}/participations/${id}/number-data`;

const requestOptions = { suppressErrorMessage: true };

export function getEventAccess() {
    const token = localCache.get(KEYS.ACCESS_TOKEN);
    try {
        const payload = String(token).split('.')[1];
        const { scopes } = JSON.parse(
            atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
        );
        return {
            canWatch:
                Array.isArray(scopes) &&
                (scopes.includes('all_accesses') ||
                    scopes.includes('watch_event')),
            canEdit:
                Array.isArray(scopes) &&
                (scopes.includes('all_accesses') ||
                    scopes.includes('edit_event')),
        };
    } catch {
        return { canWatch: false, canEdit: false };
    }
}

export function numberDataError(error: unknown) {
    return (
        error as {
            response?: {
                status?: number;
                data?: {
                    message?: string;
                    errors?: NumberDataIssue[];
                    sheets?: string[];
                    headers?: string[];
                };
            };
        }
    )?.response;
}

function importForm(file: File, options: NumberDataImportOptions) {
    const form = new FormData();
    form.append('file', file);
    form.append('mode', options.mode);
    if (options.sheet !== undefined) form.append('sheet', options.sheet);
    if (options.number_column !== undefined)
        form.append('number_column', options.number_column);
    return form;
}

export async function previewNumberData(
    key: string,
    file: File,
    options: NumberDataImportOptions,
) {
    const { data } = await axiosInstance.post<NumberDataPreview>(
        `${activityPath(key)}/number-data/import/preview`,
        importForm(file, options),
        { ...requestOptions, timeout: 60000 },
    );
    return data;
}

export async function commitNumberData(
    key: string,
    file: File,
    options: NumberDataImportOptions,
) {
    const { data } = await axiosInstance.post<{ written: number }>(
        `${activityPath(key)}/number-data/import/commit`,
        importForm(file, options),
        { ...requestOptions, timeout: 60000 },
    );
    return data;
}

export async function getParticipationNumberData(key: string, id: number) {
    const { data } = await axiosInstance.get<ParticipationNumberData>(
        participationPath(key, id),
        requestOptions,
    );
    return data;
}

export async function saveParticipationNumberData(
    key: string,
    id: number,
    version: number,
    values: Record<string, string>,
) {
    return axiosInstance.put(
        participationPath(key, id),
        { version, values },
        requestOptions,
    );
}

export async function getParticipationCsv(key: string) {
    const { data } = await axiosInstance.get<Blob>(
        `${activityPath(key)}/participations/export`,
        { ...requestOptions, responseType: 'blob', timeout: 120000 },
    );
    return data;
}
