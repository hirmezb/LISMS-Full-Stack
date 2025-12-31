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
  Button,
} from '@mui/material';
import SampleList from '../components/SampleList';
import api from '../api';

interface Location {
  id: number;
  location_type: string | null;
  room_number: number;
}

interface Warehouse {
  id: number;
  warehouse_facility: string;
}

interface Sop {
  id: number;
  sop_name: string;
}

/**
 * SamplesPage renders the list of samples and provides a simple form
 * to create new samples.  It fetches locations, warehouses and SOPs
 * to populate the select inputs.  Only core fields are captured here;
 * specialised fields for in‑process, stability or finished product
 * samples can be added to the API later.
 */
const SamplesPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [sops, setSops] = useState<Sop[]>([]);
  const [formData, setFormData] = useState({
    product_name: '',
    product_stage: '',
    quantity: '',
    sample_type: 'I',
    storage_conditions: '',
    location: '',
    warehouse: '',
    sop: '',
  });

  // Load select options on component mount
  useEffect(() => {
    api.get<Location[]>('locations/').then((res) => setLocations(res.data));
    api.get<Warehouse[]>('warehouses/').then((res) => setWarehouses(res.data));
    api.get<Sop[]>('sops/').then((res) => setSops(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Convert numeric/string values where appropriate
    const payload = {
      product_name: formData.product_name,
      product_stage: formData.product_stage,
      quantity: Number(formData.quantity),
      sample_type: formData.sample_type,
      storage_conditions: formData.storage_conditions,
      location: Number(formData.location),
      warehouse: Number(formData.warehouse),
      sop: Number(formData.sop),
    };
    api
      .post('samples/', payload)
      .then(() => {
        // On success, reset form and reload samples via SampleList useEffect
        setFormData({
          product_name: '',
          product_stage: '',
          quantity: '',
          sample_type: 'I',
          storage_conditions: '',
          location: '',
          warehouse: '',
          sop: '',
        });
      })
      .catch((err) => {
        console.error('Failed to create sample:', err);
      });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Samples
      </Typography>
      {/* Sample list */}
      <SampleList />
      <Typography variant="h5" sx={{ mt: 4 }}>
        Add Sample
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Product Name"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Product Stage"
              name="product_stage"
              value={formData.product_stage}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="sample-type-label">Sample Type</InputLabel>
            <Select
              labelId="sample-type-label"
              name="sample_type"
              value={formData.sample_type}
              label="Sample Type"
              onChange={handleChange}
              required
            >
              <MenuItem value="I">InProcess</MenuItem>
              <MenuItem value="S">Stability</MenuItem>
              <MenuItem value="F">Finished</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Storage Conditions"
              name="storage_conditions"
              value={formData.storage_conditions}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
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
            <InputLabel id="warehouse-label">Warehouse</InputLabel>
            <Select
              labelId="warehouse-label"
              name="warehouse"
              value={formData.warehouse}
              label="Warehouse"
              onChange={handleChange}
              required
            >
              {warehouses.map((wh) => (
                <MenuItem key={wh.id} value={wh.id}>
                  {wh.warehouse_facility}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="sop-label">SOP</InputLabel>
            <Select
              labelId="sop-label"
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
            Create Sample
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default SamplesPage;