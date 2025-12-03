import { Link } from 'react-router-dom';

function Login() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Login Page</h1>
      <p>This is the Login page</p>
      <Link to="/">Go to Index</Link>
    </div>
  );
}

export default Login;
