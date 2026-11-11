import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import FlightList from './components/FlightList';
import CreateFlight from './components/CreateFlight';
import EditFlight from './components/EditFlight';
import ClienteAvionesList from './components/ClienteAvionesList'; 
import AdminResources from './components/AdminResources'; 

function App() {
  useEffect(() => {
    document.title = "SkyTrack Airlines - Gestión Operativa";
  }, []);

  return (
    <Router>
      {/* CAMBIO: bg-gray-50 -> bg-sky-50 */}
      <div className="min-h-screen bg-sky-50"> 
        <Routes>
          <Route path="/" element={<Navigate to="/vuelos" replace />} />
          <Route path="/vuelos" element={<FlightList />} />
          <Route path="/crear-vuelo" element={<CreateFlight />} />
          <Route path="/editar-vuelo/:id" element={<EditFlight />} />
          <Route path="/clientes/vuelos" element={<ClienteAvionesList />} />
          <Route path="/recursos" element={<AdminResources />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;