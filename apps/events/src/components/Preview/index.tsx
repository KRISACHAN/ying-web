// @TODO: Use a better component
import Box from '@mui/joy/Box';

const Preview = ({
    resource_type,
    resource_url,
}: {
    resource_type?: string;
    resource_url?: string;
}) => {
    if (!resource_url) return null;

    switch (resource_type) {
        case 'image':
            return (
                <Box sx={{ mt: 2 }}>
                    <img
                        src={resource_url}
                        alt="经文配图"
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                    />
                </Box>
            );
        case 'video':
            return (
                <Box sx={{ mt: 2 }}>
                    <video
                        src={resource_url}
                        controls
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                </Box>
            );
        case 'audio':
            return (
                <Box sx={{ mt: 2 }}>
                    <audio
                        src={resource_url}
                        controls
                        style={{ width: '100%' }}
                    />
                </Box>
            );
        default:
            return null;
    }
};

export default Preview;
