import { Routes, Route } from 'react-router-dom';
import './App.css'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import AadhaarVerification from './pages/AadhaarVerification';
import ElectionCategory from './pages/ElectionCategory';
import ElectionTypeList from './pages/ElectionTypeList';
import ElectionDetailVote from './pages/ElectionDetailVote';
import ElectionListAdmin from './pages/admin/ElectionListAdmin';
import CreateElection from './pages/admin/CreateElection';
import ManageElection from './pages/admin/ManageElection';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aadhaar" element={<AadhaarVerification />} />
        <Route path="/election-category" element={<ElectionCategory />} />
        <Route path="/election/:type" element={<ElectionTypeList />} />
        <Route path="/election/:type/:electionId/vote" element={<ElectionDetailVote />} />
        <Route path="/admin/elections" element={<ElectionListAdmin />} />
        <Route path="/admin/election/create" element={<CreateElection />} />
        <Route path="/admin/election/:electionId" element={<ManageElection />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App
