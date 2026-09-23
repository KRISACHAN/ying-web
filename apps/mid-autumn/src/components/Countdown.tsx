import { useEffect, useRef, useState } from 'react';

import type { CountdownParts } from '../hooks/useMidAutumn';

const pad = (value: number) => String(value).padStart(2, '0');

/** 秒数切换时极轻的一次落位反馈（自然、不疲劳） */
function SecondsDigit({ value }: { value: number }) {
    const [tick, setTick] = useState(false);
    const prev = useRef(value);

    useEffect(() => {
        if (prev.current !== value) {
            prev.current = value;
            setTick(true);
            const timer = window.setTimeout(() => setTick(false), 450);
            return () => window.clearTimeout(timer);
        }
    }, [value]);

    return <b className={`sec${tick ? ' tick' : ''}`}>{pad(value)}</b>;
}

/**
 * 倒计时信息组：天数突出，时 / 分 / 秒与单位正常可读，
 * 不再用长装饰线隔开，也不靠层层降低透明度制造“克制”。
 */
export function Countdown({ parts }: { parts: CountdownParts }) {
    return (
        <div className="countdown" role="timer" aria-live="off">
            <div className="countdown-days">
                <span className="days-num">{pad(parts.days)}</span>
                <span className="days-unit">天</span>
            </div>
            <div className="countdown-hms">
                <span className="time-part">
                    <b>{pad(parts.hours)}</b>
                    <i>时</i>
                </span>
                <span className="time-part">
                    <b>{pad(parts.minutes)}</b>
                    <i>分</i>
                </span>
                <span className="time-part">
                    <SecondsDigit value={parts.seconds} />
                    <i>秒</i>
                </span>
            </div>
        </div>
    );
}
