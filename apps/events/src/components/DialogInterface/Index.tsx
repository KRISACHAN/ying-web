import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    useMediaQuery,
} from '@mui/material';

interface DialogInterfaceProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: () => Promise<void>;
    loading: boolean;
    name: string;
    setName: (name: string) => void;
}

export default function DialogInterface({
    open,
    handleClose,
    handleSubmit,
    loading,
    name,
    setName,
}: DialogInterfaceProps) {
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            transitionDuration={reduceMotion ? 0 : undefined}
            aria-labelledby="draw-name-title"
        >
            <form
                onSubmit={event => {
                    event.preventDefault();
                    if (!loading) void handleSubmit();
                }}
            >
                <DialogTitle id="draw-name-title">请输入你的名字</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="姓名"
                        fullWidth
                        value={name}
                        onChange={event => setName(event.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleClose} variant="outlined">
                        取消
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? '提交中…' : '提交'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
