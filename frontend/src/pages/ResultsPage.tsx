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

interface Sample {
  id: number;
  product_name: string;
}

interface Test {
  id: number;
  min_acceptable_result: number | null;
  max_acceptable_result: number | null;
}

interface Result {
  id: number;
  sample: number;
  test: number;
  testing_analyst: string;
  reviewing_analyst: string;
  test_result: number;
  deadline: string;
  pass_or_fail: boolean;
}

/**
 * ResultsPage displays sample test links (results) and provides a form
 * to add new results.  To improve user experience it fetches lists
 * of samples and tests so users can select from dropdowns.  When a
 * result is submitted the pass_or_fail field is computed on the
 * client based on the selected test's acceptable result range.
 */
const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [formData, setFormData] = useState({
    sample: '',
    test: '',
    testing_analyst: '',
    reviewing_analyst: '',
    test_result: '',
    deadline: '',
  });

  // Load existing results, samples and tests on mount
  useEffect(() => {
    api.get<Result[]>('sample-test-links/').then((res) => setResults(res.data));
    api.get<Sample[]>('samples/').then((res) => setSamples(res.data));
    api.get<Test[]>('tests/').then((res) => setTests(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({ ...prev, [name!]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Find the selected test to compute pass/fail
    const selectedTest = tests.find((t) => t.id === Number(formData.test));
    const resultValue = Number(formData.test_result);
    let pass = true;
    if (selectedTest) {
      if (
        selectedTest.min_acceptable_result !== null &&
        resultValue < selectedTest.min_acceptable_result
      ) {
        pass = false;
      }
      if (
        selectedTest.max_acceptable_result !== null &&
        resultValue > selectedTest.max_acceptable_result
      ) {
        pass = false;
      }
    }
    const payload = {
      sample: Number(formData.sample),
      test: Number(formData.test),
      testing_analyst: formData.testing_analyst,
      reviewing_analyst: formData.reviewing_analyst,
      test_result: resultValue,
      deadline: formData.deadline,
      pass_or_fail: pass,
    };
    api
      .post('sample-test-links/', payload)
      .then((res) => {
        setResults((prev) => [...prev, res.data]);
        setFormData({
          sample: '',
          test: '',
          testing_analyst: '',
          reviewing_analyst: '',
          test_result: '',
          deadline: '',
        });
      })
      .catch((err) => {
        console.error('Failed to create result:', err);
      });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Sample Test Results
      </Typography>
      {/* Results list */}
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sample</TableCell>
              <TableCell>Test</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Pass?</TableCell>
              <TableCell>Deadline</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.id}</TableCell>
                <TableCell>
                  {samples.find((s) => s.id === r.sample)?.product_name || r.sample}
                </TableCell>
                <TableCell>{r.test}</TableCell>
                <TableCell>{r.test_result}</TableCell>
                <TableCell>{r.pass_or_fail ? 'Yes' : 'No'}</TableCell>
                <TableCell>{new Date(r.deadline).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h5" sx={{ mt: 2 }}>
        Add Test Result
      </Typography>
      <Paper sx={{ p: 2, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="sample-select-label">Sample</InputLabel>
            <Select
              labelId="sample-select-label"
              name="sample"
              value={formData.sample}
              label="Sample"
              onChange={handleChange}
              required
            >
              {samples.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.product_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="test-select-label">Test</InputLabel>
            <Select
              labelId="test-select-label"
              name="test"
              value={formData.test}
              label="Test"
              onChange={handleChange}
              required
            >
              {tests.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  Test #{t.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Testing Analyst"
              name="testing_analyst"
              value={formData.testing_analyst}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Reviewing Analyst"
              name="reviewing_analyst"
              value={formData.reviewing_analyst}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Test Result"
              name="test_result"
              type="number"
              value={formData.test_result}
              onChange={handleChange}
              required
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              label="Deadline"
              name="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </FormControl>
          <Button variant="contained" type="submit">
            Create Result
          </Button>
        </form>
      </Paper>
    </>
  );
};

export default ResultsPage;