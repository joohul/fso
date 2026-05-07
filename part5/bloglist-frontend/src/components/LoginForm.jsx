const LoginForm = (props) => {
  const {onLogin, handleLogin} = props
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={(event) => handleLogin(event, onLogin)}>
        <div>
          username: <input type="text" name="Username" />
        </div>
        <div>
          password: <input type="password" name="Password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm