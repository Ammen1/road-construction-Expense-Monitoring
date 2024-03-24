import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { TextInput, Button, Label } from 'flowbite-react';


export default function Apply() {
  const { currentUser } = useSelector((state) => state.user);
  const { projectId } = useParams();
  const [formData, setFormData] = useState({
    projectId,
    tinNumber: '',
    userId: currentUser ? currentUser._id : '',
    name: '',
    email: '',
    phone: '',
    city: '', 
    servicesProvided: '',
    projectsCompleted: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      projectId
    }));
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!/^\d+$/.test(formData.tinNumber)) {
        setError('TIN Number must contain only numbers');
        return;
      }
      const userId = currentUser;
      const response = await axios.get(`/api/supplier/applications?userId=${userId}`);
      console.log(response.data);
      if (response.data.applied) {
        setError('You have already applied for this project');
        return;
      }
  
      const submitResponse = await axios.post('/api/supplier/apply', formData);
      setSuccessMessage(submitResponse.data.message);
      setError('');
      navigate(`/dashboard`);
      alert('Successfully created');
    } catch (error) {
      setError(error.response.data.error || 'Something went wrong');
      setSuccessMessage('');
    }
  };
  
  return (
    <div className="max-w-lg mx-auto mt-12 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Apply for Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tinNumber" value="TIN Number" />
            <TextInput type="text" id="tinNumber" name="tinNumber" value={formData.tinNumber} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="name" value="Name" />
            <TextInput type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone" value="Phone" />
            <TextInput type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="city" value="City" />
            <TextInput type="text" id="city" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="servicesProvided" value="Services Provided" />
            <TextInput type="text" id="servicesProvided" name="servicesProvided" value={formData.servicesProvided} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="projectsCompleted" value="Projects Completed" />
            <TextInput type="text" id="projectsCompleted" name="projectsCompleted" value={formData.projectsCompleted} onChange={handleChange} required />
          </div>
        </div>
        <Button gradientDuoTone="purpleToPink" outline type="submit" className="mt-4">Apply</Button>
      </form>
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      {successMessage && (
        <div className="text-green-500 mt-4 border border-green-500 p-2 rounded">
          {successMessage}
        </div>
      )}
    </div>
  );
}
