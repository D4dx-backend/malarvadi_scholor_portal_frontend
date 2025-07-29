import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function CertificateGenerator() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [place, setPlace] = useState('');
  const [school, setSchool] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [className, setClassName] = useState('');
  const [district, setDistrict] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  
  // Kerala districts with Kochi City
  const keralaDistricts = [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kasaragod',
    'Kochi City',
    'Kollam',
    'Kottayam',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad'
  ];
  
  // Class options up to 7th standard
  const classOptions = [
    'LKG',
    'UKG',
    '1st Standard',
    '2nd Standard',
    '3rd Standard',
    '4th Standard',
    '5th Standard',
    '6th Standard',
    '7th Standard'
  ];

  const handleAgeChange = (e) => {
    const value = e.target.value;
    // Allow typing but validate the final value
    if (value === '' || /^\d{1,2}$/.test(value)) {
      setAge(value);
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;

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
    
    if (!age || isNaN(age) || parseInt(age) < 5 || parseInt(age) > 12) {
      setError('Please enter a valid age between 5 and 12');
      return;
    }
    
    if (!gender || !['male', 'female'].includes(gender)) {
      setError('Please select a gender');
      return;
    }
    
    if (!className.trim()) {
      setError('Please enter your class');
      return;
    }
    
    if (!district.trim()) {
      setError('Please enter your district');
      return;
    }
    
    if (!mobileNumber.trim() || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number starting with 6-9');
      return;
    }

    if (!photo) {
      setError('Please upload a photo');
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
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('className', className);
      formData.append('district', district);
      formData.append('mobileNumber', mobileNumber);
      if (photo) {
        formData.append('photo', photo);
      }
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/certificates/generate-certificate`, {
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

      setSuccess('Certificate generated successfully! Download started. You can generate another certificate below.');
      
      setTimeout(() => {
        setName('');
        setPlace('');
        setSchool('');
        setAge('');
        setGender('');
        setClassName('');
        setDistrict('');
        setMobileNumber('');
        setPhoto(null);
        setPreview(null);
      }, 2000);

    } catch (err) {
      setError(`Error generating certificate: ${err.message}`);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="mb-4">
            {/* Logo */}
            <div className="w-24 h-24 mx-auto mb-4">
              <img 
                src={logo} 
                alt="Malarvadi Little Scholar Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Malarvadi Little Scholar
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Welcome to Malarvadi Little Scholar Certificate Portal
          </p>
          <p className="text-md text-gray-500">
            Download your participation certificate
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
            title="Return to Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Place <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your place (e.g., Kottayam)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School/Institution <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your school/institution name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={handleAgeChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Age (5-12)"
                      min="5"
                      max="12"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Class</option>
                      {classOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select District</option>
                      {keralaDistricts.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={handleMobileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 10-digit number starting with 6-9</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Photo <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                    
                    {preview ? (
                      <div className="space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-green-500">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div>
                          <button
                            onClick={() => fileInputRef.current.click()}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            Click to upload
                          </button>
                          <span className="text-gray-500"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 2MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg animate-pulse">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{success}</span>
                </div>
                <p className="text-sm mt-1">Your form will reset automatically in a moment.</p>
              </div>
            )}

            {/* Generate Button */}
            <div className="mt-8">
              <button
                onClick={handleGenerateCertificate}
                disabled={isGenerating || !name.trim() || !place.trim() || !age || !gender || !className.trim() || !district.trim() || !mobileNumber.trim() || !photo}
                className={`w-full py-4 px-6 rounded-lg text-white font-medium text-lg transition-all duration-200 ${
                  isGenerating || !name.trim() || !place.trim() || !age || !gender || !className.trim() || !district.trim() || !mobileNumber.trim() || !photo
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
                }`}
                type="button"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Certificate...
                  </span>
                ) : (
                  'Generate Certificate'
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Your certificate will be generated with the Malarvadi Little Scholar 2025 template
            </p>

            {/* Return to Home Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateGenerator;