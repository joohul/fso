import { Button, TextField } from "@mui/material";

const LoginForm = (props) => {
  const { onLogin, handleLogin } = props;

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={(event) => handleLogin(event, onLogin)}>
        <div style={{ marginBottom: 12 }}>
          <TextField label="username" name="Username" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <TextField label="password" name="Password" type="password" />
        </div>
        <Button type="submit" variant="contained">
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
