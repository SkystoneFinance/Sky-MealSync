import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard";
// import Home from "./commons/pages/publicSection/home";

function App() {
  return (
    <>
      <Routes>
        <Route  element={<Dashboard />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<Dashboard />} />
        <Route path="/check-meal" element={<Dashboard />} />
        <Route path="/scan" element={<Dashboard />} />
        </Route> 
      </Routes>
      </>
  )
}

export default App;
