import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'flowbite-react';

const ProjectPDF = () => {
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get('/api/project/report', {
          responseType: 'arraybuffer',
        });
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', 'project_report.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-10 mb-10 items-center justify-center">
      <h2 className="text-3xl self-center">Project PDF</h2>
      <p className="text-center my-4">This project report contains information provided by the manager.</p>
      <Button gradientDuoTone="purpleToPink" outline onClick={handleDownload} >
        Download PDF
      </Button>
    </div>
  );
};

export default ProjectPDF;
