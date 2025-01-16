import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    type Theme,
} from '@mui/material';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface DialogInterfaceProps {
    open: boolean;
    handleClose: () => void;
    handleSubmit: () => Promise<void>;
    loading: boolean;
    theme: Theme;
    name: string;
    setName: (name: string) => void;
}

export const DialogInterface: React.FC<DialogInterfaceProps> = ({
    open,
    handleClose,
    handleSubmit,
    loading,
    theme,
    name,
    setName,
}) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    width: '100%',
                    maxWidth: 400,
                },
            }}
        >
            <DialogTitle
                sx={{
                    pb: 1,
                    textAlign: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: '#6366F1',
                }}
            >
                请输入你的名字
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="请输入您的名字"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={e => setName(e.target.value)}
                    variant="outlined"
                    sx={{
                        mt: 1,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#6366F1',
                            },
                            '&:hover fieldset': {
                                borderColor: '#818CF8',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#6366F1',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#6366F1',
                            '&.Mui-focused': {
                                color: '#6366F1',
                            },
                        },
                        '& .MuiOutlinedInput-input': {
                            color: '#6366F1',
                        },
                    }}
                />
            </DialogContent>
            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    size="large"
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        borderColor: '#6366F1',
                        color: '#6366F1',
                        '&:hover': {
                            borderColor: '#818CF8',
                            backgroundColor: 'rgba(99, 102, 241, 0.04)',
                        },
                    }}
                >
                    取消
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={
                        loading && <Loader2 className="w-4 h-4 animate-spin" />
                    }
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        background: '#6366F1',
                        '&:hover': {
                            background: '#818CF8',
                        },
                    }}
                >
                    提交
                </Button>
            </DialogActions>
        </Dialog>
    );
};
