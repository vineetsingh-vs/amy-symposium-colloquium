import { Box, Alert } from "@mui/material";

const ErrorMessage = ({ message }) => {
    return (
        <Box my={2}>
            <Alert severity="error">{message}</Alert>
        </Box>
    );
};

export default ErrorMessage;
