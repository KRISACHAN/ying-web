import { UNAUTHORIZED } from '@utils/http-errors';
import log from '@utils/log';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { eq } from 'lodash';
import os from 'os';
import path from 'path';

export function getIP() {
    let IPv4 = '127.0.0.1';
    if (os?.networkInterfaces()?.en0) {
        os.networkInterfaces().en0.forEach(en => {
            if (eq(en.family, 'IPv4')) {
                IPv4 = en.address;
            }
        });
    }
    return IPv4;
}

export const generateAccessToken = function (uid, scopes) {
    const secretKey = process.env.JWT_ACCESS_SECRET_KEY;
    const expiresIn = process.env.JWT_ACCESS_EXPIRED;
    const token = jwt.sign(
        {
            uid,
            scopes,
        },
        secretKey,
        {
            expiresIn: expiresIn,
        },
    );
    return token;
};

export const verifyRefreshToken = function (token) {
    const secretKey = process.env.JWT_REFRESH_SECRET_KEY;
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        log.error(error);
        if (error.name === 'TokenExpiredError') {
            throw UNAUTHORIZED('Refresh Token 已过期');
        }
        throw UNAUTHORIZED('无效的 Refresh Token');
    }
};

export const generateRefreshToken = function (uid, scopes) {
    const secretKey = process.env.JWT_REFRESH_SECRET_KEY;
    const expiresIn = process.env.JWT_REFRESH_EXPIRED;
    const token = jwt.sign(
        {
            uid,
            scopes,
        },
        secretKey,
        {
            expiresIn: expiresIn,
        },
    );
    return token;
};

export function hasFileAccess(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.R_OK);
        return true;
    } catch (error) {
        log.error(error);
        return false;
    }
}

export function mkdirPath(pathStr) {
    let projectPath = path.resolve(__dirname, '..');
    let tempDirArray = pathStr.split('\\');
    for (let i = 0; i < tempDirArray.length; i++) {
        projectPath = projectPath + '/' + tempDirArray[i];
        if (hasFileAccess(projectPath)) {
            let tempstats = fs.statSync(projectPath);
            if (!tempstats.isDirectory()) {
                fs.unlinkSync(projectPath);
                fs.mkdirSync(projectPath);
            }
        } else {
            fs.mkdirSync(projectPath);
        }
    }
    return projectPath;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export function genPaginationRequest(page_num = 1, page_size = 10) {
    return {
        limit: parseInt(page_size),
        offset: (parseInt(page_num) - 1) * parseInt(page_size),
    };
}

export function getUserIP(ctx) {
    return ctx.headers['x-forwarded-for'] || ctx.ip;
}
