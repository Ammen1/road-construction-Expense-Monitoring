import React, { useState } from 'react';
import axios from 'axios';
import { Button, Label, TextInput } from 'flowbite-react'; // Assuming these are your custom components or from a UI library

const ReportGenerator = () => {
  // State to store form data
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetDetails, setBudgetDetails] = useState('');
  const [requiredMaterials, setRequiredMaterials] = useState('');
  const [machineryRequirements, setMachineryRequirements] = useState('');
  const [laborRequirements, setLaborRequirements] = useState('');
  const [timeline, setTimeline] = useState('');
  const [sitePreparation, setSitePreparation] = useState('');
  const [environmentalConsiderations, setEnvironmentalConsiderations] = useState('');
  const [safetyPlan, setSafetyPlan] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Make a POST request to generate the report
      const response = await axios.post('/api/project/generate', {
        startDate,
        endDate,
        budget,
        budgetDetails,
        requiredMaterials,
        machineryRequirements,
        laborRequirements,
        timeline,
        sitePreparation,
        environmentalConsiderations,
        safetyPlan
      });
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
    <div className="container mx-auto py-8">
      <h2 className="text-2xl mb-4 font-bold">Generate Project Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <Label htmlFor="budget">Budget:</Label>
          <TextInput
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="budgetDetails">Budget Details:</Label>
          <TextInput
            id="budgetDetails"
            value={budgetDetails}
            onChange={(e) => setBudgetDetails(e.target.value)}
            required
            multiline
          />
        </div>
        <div>
          <Label htmlFor="requiredMaterials">Required Materials:</Label>
          <TextInput
            id="requiredMaterials"
            value={requiredMaterials}
            onChange={(e) => setRequiredMaterials(e.target.value)}
            required
            multiline
          />
        </div>
        <div>
          <Label htmlFor="machineryRequirements">Machinery Requirements:</Label>
          <TextInput
            id="machineryRequirements"
            value={machineryRequirements}
            onChange={(e) => setMachineryRequirements(e.target.value)}
            required
            multiline
          />
        </div>
        <div>
          <Label htmlFor="laborRequirements">Labor Requirements:</Label>
          <TextInput
            id="laborRequirements"
            value={laborRequirements}
            onChange={(e) => setLaborRequirements(e.target.value)}
            required
            multiline
          />
        </div>
        <div>
          <Label htmlFor="timeline">Timeline:</Label>
          <TextInput
            id="timeline"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            required
            multiline
          />
        </div>
        <div>
          <Label htmlFor="sitePreparation">Site Preparation:</Label>
          <TextInput
            id="sitePreparation"
            value={sitePreparation}
            onChange={(e) => setSitePreparation(e.target.value)}
            required
            multiline
          />
        </div>
        <div>
          <Label htmlFor="environmentalConsiderations">Environmental Considerations:</Label>
          <TextInput
            id="environmentalConsiderations"
            value={environmentalConsiderations}
            onChange={(e) => setEnvironmentalConsiderations(e.target.value)}
            required
            multiline
          />
        </div>
        <div>
          <Label htmlFor="safetyPlan">Safety Plan:</Label>
          <TextInput
            id="safetyPlan"
            value={safetyPlan}
            onChange={(e) => setSafetyPlan(e.target.value)}
            required
            multiline
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
