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
import api from '../api';

interface Test {
  id: number;
  user_account: number;
  sop: number;
  min_acceptable_result: number | null;
  max_acceptable_result: number | null;
}

interface UserAccount {
  id: number;
  account_username: string;
}

interface Sop {
  id: number;
  sop_name: string;
}

/**
 * TestsPage lists tests and provides a form to create new tests.
 */
const TestsPage: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [sops, setSops] = useState<Sop[]>([]);
  const [formData, setFormData] = useState({
    user_account: '',
    sop: '',
    min_acceptable_result: '',
    max_acceptable_result: '',
  });

  useEffect(() => {
    api.get<Test[]>('tests/').then((res) => setTests(res.data));
    api.get<UserAccount[]>('users/').then((res) => setUsers(res.data));
    api.get<Sop[]>('sops/').then((res) => setSops(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      user_account: Number(formData.user_account),
      sop: Number(formData.sop),
      min_acceptable_result: formData.min_acceptable_result ? Number(formData.min_acceptable_result) : null,
      max_acceptable_result: formData.max_acceptable_result ? Number(formData.max_acceptable_result) : null,
    };
    api
      .post('tests/', payload)
      .then((res) => {
        setTests((prev) => [...prev, res.data]);
        setFormData({
          user_account: '',
          sop: '',
          min_acceptable_result: '',
          max_acceptable_result: '',
        });
      })
      .catch((err) => {
        console.error('Failed to create test:', err);
      });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Tests
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>SOP</TableCell>
              <TableCell>Min Result</TableCell>
              <TableCell>Max Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id} hover>
                <TableCell>{test.id}</TableCell>
                <TableCell>{users.find((u) => u.id === test.user_account)?.account_username}</TableCell>
                <TableCell>{sops.find((s) => s.id === test.sop)?.sop_name}</TableCell>
                <TableCell>{test.min_acceptable_result ?? '—'}</TableCell>
                <TableCell>{test.max_acceptable_result ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Add Test
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="user-select-label">User</InputLabel>
            <Select
              labelId="user-select-label"
              name="user_account"
              value={formData.user_account}
              label="User"
              onChange={handleChange}
              required
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.account_username}
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Min Acceptable Result"
              name="min_acceptable_result"
              type="number"
              value={formData.min_acceptable_result}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Max Acceptable Result"
              name="max_acceptable_result"
              type="number"
              value={formData.max_acceptable_result}
              onChange={handleChange}
            />
          </FormControl>
          <Button variant="contained" type="submit">
            Create Test
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default TestsPage;