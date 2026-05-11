import { Alert } from "@mui/material";

const SuccessNotification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return (
    <Alert severity="success" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
};

export default SuccessNotification;
