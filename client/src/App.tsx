import './App.css'
import { Route,  Routes } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import ProfilePage from './pages/ProfilePage'

function App() {
  

  return (
    <Routes>
      <Route path="/"  element={<WelcomePage/>}/>
      <Route path="/profile" element={<ProfilePage/>}/>

    


    </Routes>
  )
}

export default App
