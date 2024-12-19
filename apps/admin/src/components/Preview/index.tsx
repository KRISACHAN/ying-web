// @TODO: Use a better component
import { Image } from 'antd';

interface PreviewProps {
    type?: 'image' | 'video' | 'audio';
    url?: string;
    style?: React.CSSProperties;
}

const Preview = ({ type, url, style }: PreviewProps) => {
    if (!url) return null;

    const defaultStyle = {
        maxWidth: '100%',
        marginTop: 8,
        ...style,
    };

    switch (type) {
        case 'image':
            return <Image src={url} style={defaultStyle} />;
        case 'video':
            return <video src={url} controls style={defaultStyle} />;
        case 'audio':
            return (
                <audio src={url} controls style={{ width: '100%', ...style }} />
            );
        default:
            return null;
    }
};

export default Preview;
