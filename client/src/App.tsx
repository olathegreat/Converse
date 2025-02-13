import './App.css'
import { Route,  Routes } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import ProfilePage from './pages/ProfilePage'
import ChatPage from './pages/ChatPage'

function App() {
  

  return (
    <Routes>
      
      <Route path="/"  element={<WelcomePage/>}/>
      <Route path="/profile" element={<ProfilePage/>}/>
      <Route path="/chat" element={<ChatPage/>}/>

    


    </Routes>
  )
}

export default App
