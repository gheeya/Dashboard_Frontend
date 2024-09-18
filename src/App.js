import logo from './logo.svg';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/login/login';
import Stage from './pages/staging/staging';
import Home from './pages/home/home';
import ContactOps from './pages/contactOps/contactOps';
import MessageOps from './pages/messageOps/messageOps';
import TemplateOps from './pages/templateOps/templateOps';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />}></Route>
        <Route path='app' element={<Stage />}>
          <Route index element={<Home />}></Route>
          <Route path="home" element={<Home />}></Route>
          <Route path="contacts" element={<ContactOps />}></Route>
          <Route path="messaging" element={<MessageOps />}></Route>
          <Route path="templates"  element={<TemplateOps />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
