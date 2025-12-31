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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import api from '../api';

interface Equipment {
  id: number;
  equipment_name: string;
  min_use_range: number;
  max_use_range: number;
  in_use: boolean;
  location: number;
  sop: number;
}

interface Location {
  id: number;
  location_type: string | null;
  room_number: number;
}

interface Sop {
  id: number;
  sop_name: string;
}

/**
 * EquipmentPage renders a list of equipment and provides a form to
 * create new equipment.  It fetches locations and SOPs to populate
 * the select inputs.
 */
const EquipmentPage: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [sops, setSops] = useState<Sop[]>([]);
  const [formData, setFormData] = useState({
    equipment_name: '',
    min_use_range: '',
    max_use_range: '',
    in_use: false,
    location: '',
    sop: '',
  });

  // Load existing equipment, locations and sops
  useEffect(() => {
    api.get<Equipment[]>('equipment/').then((res) => setEquipmentList(res.data));
    api.get<Location[]>('locations/').then((res) => setLocations(res.data));
    api.get<Sop[]>('sops/').then((res) => setSops(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      equipment_name: formData.equipment_name,
      min_use_range: Number(formData.min_use_range),
      max_use_range: Number(formData.max_use_range),
      in_use: formData.in_use,
      location: Number(formData.location),
      sop: Number(formData.sop),
    };
    api
      .post('equipment/', payload)
      .then((res) => {
        setEquipmentList((prev) => [...prev, res.data]);
        setFormData({
          equipment_name: '',
          min_use_range: '',
          max_use_range: '',
          in_use: false,
          location: '',
          sop: '',
        });
      })
      .catch((err) => {
        console.error('Failed to create equipment:', err);
      });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Equipment
      </Typography>
      {/* Equipment list */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Min Range</TableCell>
              <TableCell>Max Range</TableCell>
              <TableCell>In Use</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipmentList.map((eq) => (
              <TableRow key={eq.id} hover>
                <TableCell>{eq.id}</TableCell>
                <TableCell>{eq.equipment_name}</TableCell>
                <TableCell>{eq.min_use_range}</TableCell>
                <TableCell>{eq.max_use_range}</TableCell>
                <TableCell>{eq.in_use ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Add Equipment
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Equipment Name"
              name="equipment_name"
              value={formData.equipment_name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Min Use Range"
              name="min_use_range"
              type="number"
              value={formData.min_use_range}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Max Use Range"
              name="max_use_range"
              type="number"
              value={formData.max_use_range}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox name="in_use" checked={formData.in_use} onChange={handleCheckboxChange} />}
            label="In Use"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="location-select-label">Location</InputLabel>
            <Select
              labelId="location-select-label"
              name="location"
              value={formData.location}
              label="Location"
              onChange={handleChange}
              required
            >
              {locations.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {loc.location_type || 'Room'} {loc.room_number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="sop-select-label">SOP</InputLabel>
            <Select
              labelId="sop-select-label"
              name="sop"
              value={formData.sop}
              label="SOP"
              onChange={handleChange}
              required
            >
              {sops.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.sop_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" type="submit">
            Create Equipment
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default EquipmentPage;