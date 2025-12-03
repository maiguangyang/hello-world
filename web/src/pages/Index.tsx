/*
 * @Author: Marlon.M
 * @Email: maiguangyang@163.com
 * @Date: 2025-12-02 19:54:44
 */
import { Link } from 'react-router-dom';

function Index() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Index Page</h1>
      <p>Welcome to the Index page!</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );
}

export default Index;
