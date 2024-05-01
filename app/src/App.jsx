import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Context from './Context.jsx'
import { Credentials, Desktop, Profile, Sudo, Initial } from './views'
import { Upload, Download, DeleteUser, DeleteGroup } from './components'
import handleError from './utils/handleError.js'

function App() {

  return <>
    <Router>
      <Context.Provider value={{ handleError }}>
        <Routes>
          <Route path="/" element={<Initial />} />
          <Route path="/credentials/*" element={<Credentials />} />

          <Route path="/desktop" element={<Desktop />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/download" element={<Download />} />
          <Route path="/profile/*" element={<Profile />} />

          <Route path="/administrator/*" element={<Sudo />} />
          <Route path="/delete-user" element={<DeleteUser />} />
          <Route path="/delete-group" element={<DeleteGroup />} />
        </Routes>
      </Context.Provider>
    </Router>
  </>

}

export default App
