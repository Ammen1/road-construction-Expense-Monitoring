// ReportGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Label, TextInput } from 'flowbite-react'; // Assuming these are your custom components or from a UI library

const ReportGenerator = () => {
  // State to store form data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make a POST request to generate the report
      const response = await axios.post('/api/project/generate', { startDate, endDate });
      console.log('Report generated successfully:', response.data);
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Generate Project Report</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="startDate">Start Date:</Label>
          <TextInput
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date:</Label>
          <TextInput
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Report'}
        </Button>
      </form>
    </div>
  );
};

export default ReportGenerator;
