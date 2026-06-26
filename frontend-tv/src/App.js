import { HashRouter, Routes, Route } from "react-router-dom";
import PairingPage from "./pages/PairingPage";
import DisplayPage from "./pages/DisplayPage";
import "./styles/tv.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PairingPage />} />
        <Route path="/display" element={<DisplayPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;



