import React, { useEffect, useState } from 'react';
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import api from '../api';

interface Sample {
  id: number;
  product_name: string;
  product_stage: string;
  quantity: number;
  sample_type: string;
  time_received: string;
}

const SampleList: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the list of samples from the backend API
    api
      .get<Sample[]>('samples/')
      .then((response) => {
        setSamples(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch samples:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Samples
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Received</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samples.map((sample) => (
                <TableRow key={sample.id} hover>
                  <TableCell>{sample.id}</TableCell>
                  <TableCell>{sample.product_name}</TableCell>
                  <TableCell>{sample.product_stage}</TableCell>
                  <TableCell>{sample.quantity}</TableCell>
                  <TableCell>{sample.sample_type}</TableCell>
                  <TableCell>
                    {new Date(sample.time_received).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default SampleList;