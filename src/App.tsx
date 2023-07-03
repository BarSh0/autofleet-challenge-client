import axios from 'axios';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import './App.css';
import Content from './layouts/Content';
import Header from './layouts/Header';
import Sidebar from './layouts/Sidebar';
import { VehiclesProvider } from './context/vehiclesContext';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <VehiclesProvider>
        <div className="app">
          <Header />
          <Sidebar />
          <Content />
        </div>
      </VehiclesProvider>
    </QueryClientProvider>
  );
};

export default App;
