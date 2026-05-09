import { Alert } from '@mui/material'

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }
  return <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>
}

export default ErrorNotification