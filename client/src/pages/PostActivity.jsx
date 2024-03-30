// PostActivity.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Button, Label, TextInput} from 'flowbite-react';

export default function PostActivity({ id }) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/task/create-subtask/${id}`, {
        title,
        tag,
        date
      });
      if (response.data.status === true) {
        setSuccess(true);
        setTitle('');
        setTag('');
        setDate('');
        setError(null);
        // Invoke the callback function to notify the parent component
        if (onSubTaskCreated) {
          onSubTaskCreated();
        }
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-5 bg-black shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create Subtask</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="title" className="block text-sm font-semibold mb-1">Title:</Label>
          <TextInput
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="tag" className="block text-sm font-semibold mb-1">Tag:</Label>
          <TextInput
            type="text"
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="date" className="block text-sm font-semibold mb-1">Date:</Label>
          <TextInput
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="text-center">
          <Button type="submit" gradientDuoTone="purpleToPink" outline>
            Create Subtask
          </Button>
        </div>
      </form>
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      {success && <p className="text-green-500 mt-4">Subtask created successfully!</p>}
    </div>
  );
};
