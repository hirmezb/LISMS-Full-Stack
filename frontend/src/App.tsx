import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import SamplesPage from './pages/SamplesPage';
import EquipmentPage from './pages/EquipmentPage';
import TestsPage from './pages/TestsPage';
import ResultsPage from './pages/ResultsPage';
import LocationsPage from './pages/LocationsPage';

/**
 * Main application component.
 *
 * Uses React Router to provide navigation between multiple pages:
 * Samples, Locations, Equipment, Tests and Sample Test Results.  A
 * simple AppBar includes buttons that act as links to each page.  The
 * Routes component renders the appropriate page based on the URL.
 */
const App: React.FC = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LIMS Dashboard
          </Typography>
          {/* Navigation buttons.  The `component` prop turns them into links. */}
          <Button color="inherit" component={Link} to="/samples">
            Samples
          </Button>
          <Button color="inherit" component={Link} to="/locations">
            Locations
          </Button>
          <Button color="inherit" component={Link} to="/equipment">
            Equipment
          </Button>
          <Button color="inherit" component={Link} to="/tests">
            Tests
          </Button>
          <Button color="inherit" component={Link} to="/results">
            Results
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ my: 4 }}>
          <Routes>
            {/* Redirect from root to samples */}
            <Route path="/" element={<Navigate to="/samples" replace />} />
            <Route path="/samples" element={<SamplesPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
};

export default App;