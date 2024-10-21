import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/shared/Login';
import Client from './components/pages/Client';
function App() {
  return (
      <div>
        <Routes>
          {/* Define your routes here */}
          <Route path='/' element={<Login />} />
          <Route path='/client/*' element={<Client />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
  );
}

export default App;