import React, { useState, useRef } from 'react';

function CertificateGenerator() {
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [school, setSchool] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please upload an image file (JPEG, PNG)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }

      setError('');
      setPhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCertificate = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!place.trim()) {
      setError('Please enter your place');
      return;
    }

    if (!school.trim()) {
      setError('Please enter your school/institution');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('place', place);
      formData.append('school', school);
      if (photo) {
        formData.append('photo', photo);
      }
      // IMPORTANT: Use port 4000 for the API endpoint
      const API_URL = 'http://localhost:4000/api';
      const response = await fetch(`${API_URL}/certificates/generate-certificate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to generate certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.replace(/ /g, '_')}_certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // Show success message and automatically reset form
      setSuccess('Certificate generated successfully! Download started. You can generate another certificate below.');
      
      // Reset form after a short delay to allow user to see the success message
      setTimeout(() => {
        setName('');
        setPlace('');
        setSchool('');
        setPhoto(null);
        setPreview(null);
      }, 2000); // 2 second delay before resetting form

    } catch (err) {
      setError(`Error generating certificate: ${err.message}`);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
          Malarvadi Little Scholar Certificate
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Place <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your place (e.g., Kottayam)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School/Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your school/institution name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Photo <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 text-sm"
                  type="button"
                >
                  {photo ? 'Change Photo' : 'Choose Photo'}
                </button>
              </div>
              {preview && (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-500">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Upload a clear passport-size photo (max 2MB)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mb-4 animate-pulse">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
              <p className="text-sm mt-1">Your form will reset automatically in a moment.</p>
            </div>
          )}

          <button
            onClick={handleGenerateCertificate}
            disabled={isGenerating || !name.trim() || !place.trim() || !school.trim() || !photo}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${isGenerating || !name.trim() || !place.trim() || !school.trim() || !photo
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
              }`}
            type="button"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Certificate'
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Your certificate will be generated with the Malarvadi Little Scholar 2025 template
          </p>
        </div>
      </div>
    </div>
  );
}

export default CertificateGenerator;