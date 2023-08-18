import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MiniDrawer from './components/sidenavbar';
import Home from './screens/home';
import FileLibrary from './screens/files';
import FileUploader from './components/file_uploader';
import Bots from './screens/bots';
import CreateBotForm from './components/create_new_bot';
import ChatsPage from './screens/chats';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import Folders from './screens/folders';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false); // Add state for the drawer
  const [selectedItem, setSelectedItem] = useState('allConversations');

  useEffect(() => {
    // Check if the user is logged in by reading from local storage
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle user login
  const handleLogin = () => {
    // Perform login logic and set isLoggedIn to true
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/';
  };

  // Function to handle user logout
  const handleLogout = () => {
    // Perform logout logic and set isLoggedIn to false
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
  };

  // Function to handle drawer open/close
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="App">
      <Router>
        {isLoggedIn ? (
          <>
            {/* Pass the drawer state and handleDrawerOpen/handleDrawerClose functions */}
            <MiniDrawer open={drawerOpen} onLogout={handleLogout} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
            <div>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/files/:folder_id" element={<FileLibrary />} />
                <Route path="/folders" element={<Folders />} />
                {/* <Route path="/upload-file" element={<FileUploader />} /> */}
                <Route path="/chatbot" element={<Bots />} />
                <Route path="/create-bot" element={<CreateBotForm />} />
                <Route path="/chats" element={<ChatsPage selectedItem={selectedItem} setSelectedItem={setSelectedItem} />} />
                <Route path="/chats/:chatID" element={<ChatsPage selectedItem={'newConversations'} setSelectedItem={setSelectedItem} />} />

              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            {/* Render Login and Signup components for different paths */}
            <Route path="/" element={<LoginScreen handleLogin={handleLogin} />} />
            <Route path="/login" element={<LoginScreen handleLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupScreen handleLogin={handleLogin} />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
