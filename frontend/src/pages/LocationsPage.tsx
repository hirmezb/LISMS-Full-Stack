import React, { useEffect, useState, FormEvent } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  Button,
} from '@mui/material';
import api from '../api';

interface Location {
  id: number;
  location_type: string | null;
  room_number: number;
}

/**
 * LocationsPage lists all existing locations and provides a form to
 * add new ones.  Locations correspond to physical rooms or areas in
 * the laboratory and are simple entities with a type (optional) and
 * room number.  This page demonstrates how to use React state and
 * forms to create records via the REST API.
 */
const LocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    location_type: '',
    room_number: '',
  });

  // Fetch existing locations on mount
  useEffect(() => {
    api.get<Location[]>('locations/').then((res) => setLocations(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      location_type: formData.location_type || null,
      room_number: Number(formData.room_number),
    };
    api
      .post('locations/', payload)
      .then((res) => {
        setLocations((prev) => [...prev, res.data]);
        setFormData({ location_type: '', room_number: '' });
      })
      .catch((err) => {
        console.error('Failed to create location:', err);
      });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Locations
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Room Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((loc) => (
              <TableRow key={loc.id} hover>
                <TableCell>{loc.id}</TableCell>
                <TableCell>{loc.location_type || '—'}</TableCell>
                <TableCell>{loc.room_number}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Add Location
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Location Type"
              name="location_type"
              value={formData.location_type}
              onChange={handleChange}
              helperText="Optional (e.g. Lab, Office)"
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Room Number"
              name="room_number"
              type="number"
              value={formData.room_number}
              onChange={handleChange}
              required
            />
          </FormControl>
          <Button variant="contained" type="submit">
            Create Location
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default LocationsPage;