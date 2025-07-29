import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

const StudentRegistration = () => {
  const navigate = useNavigate();
  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    houseName: '',
    whatsappNumber: '',
    class: '',
    school: '',
    gender: 'Male',
    district: '',
    area: '',
    unit: ''
  });

  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState('');

  // Fetch districts on component mount
  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students/districts`);
      if (response.data.success) {
        setDistricts(response.data.districts);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchAreas = async (districtId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students/areas/${districtId}`);
      if (response.data.success) {
        setAreas(response.data.areas);
        setUnits([]); // Reset units when district changes
        setFormData(prev => ({ ...prev, area: '', unit: '' }));
        setSelectedAreaId(''); // Reset selected area ID
      } else {
        console.error('Areas API returned error:', response.data.message);
        setAreas([]);
        setUnits([]);
        setFormData(prev => ({ ...prev, area: '', unit: '' }));
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      if (error.response?.status === 501) {
        console.warn('Areas API not configured:', error.response.data.message);
      }
      setAreas([]);
      setUnits([]);
      setFormData(prev => ({ ...prev, area: '', unit: '' }));
    }
  };

  const fetchUnits = async (areaId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students/units/${areaId}`);
      if (response.data.success) {
        setUnits(response.data.units);
        setFormData(prev => ({ ...prev, unit: '' }));
      } else {
        console.error('Units API returned error:', response.data.message);
        setUnits([]);
        setFormData(prev => ({ ...prev, unit: '' }));
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      if (error.response?.status === 501) {
        console.warn('Units API not configured:', error.response.data.message);
      }
      setUnits([]);
      setFormData(prev => ({ ...prev, unit: '' }));
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Only allow digits and limit to 10 characters
    if (/^\d{0,10}$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        whatsappNumber: value
      }));
      
      // Clear error when user starts typing
      if (errors.whatsappNumber) {
        setErrors(prev => ({ ...prev, whatsappNumber: '' }));
      }
    }
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    // Only allow letters, spaces, and common name characters (no numbers or special symbols)
    if (/^[a-zA-Z\s\.\-']*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleHouseNameChange = (e) => {
    const value = e.target.value;
    // Allow letters, numbers, spaces, and common address characters
    if (/^[a-zA-Z\s\.\-',/()]*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        houseName: value
      }));
      
      // Clear error when user starts typing
      if (errors.houseName) {
        setErrors(prev => ({ ...prev, houseName: '' }));
      }
    }
  };

  const handleSchoolNameChange = (e) => {
    const value = e.target.value;
    // Allow letters, numbers, spaces, and common school name characters
    if (/^[a-zA-Z\s\.\-',&()]*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        school: value
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Skip mobile number handling here as it's handled separately
    if (name === 'whatsappNumber') return;
    
    // Skip name fields as they're handled separately
    if (name === 'studentName' || name === 'parentName') return;
    
    // Skip house name and school name as they're handled separately
    if (name === 'houseName' || name === 'school') return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'district' && value) {
      const selectedDistrict = districts.find(district => district.title === value);
      if (selectedDistrict) {
        setSelectedDistrictId(selectedDistrict.id);
        fetchAreas(selectedDistrict.id);
      }
    } else if (name === 'area' && value) {
      const selectedArea = areas.find(area => area.title === value);
      if (selectedArea) {
        setSelectedAreaId(selectedArea.id);
        fetchUnits(selectedArea.id);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Student Name validation
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    } else if (formData.studentName.trim().length < 2) {
      newErrors.studentName = 'Student name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s\.\-']+$/.test(formData.studentName.trim())) {
      newErrors.studentName = 'Student name can only contain letters, spaces, dots, hyphens, and apostrophes';
    }

    // Parent Name validation
    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent name is required';
    } else if (formData.parentName.trim().length < 2) {
      newErrors.parentName = 'Parent name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s\.\-']+$/.test(formData.parentName.trim())) {
      newErrors.parentName = 'Parent name can only contain letters, spaces, dots, hyphens, and apostrophes';
    }

    // House Name validation
    if (!formData.houseName.trim()) {
      newErrors.houseName = 'House name is required';
    } else if (formData.houseName.trim().length < 3) {
      newErrors.houseName = 'House name must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9\s\.\-',/()]+$/.test(formData.houseName.trim())) {
      newErrors.houseName = 'House name can only contain letters, numbers, spaces, and common address characters';
    }

    // WhatsApp Number validation
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid 10-digit mobile number starting with 6-9';
    }

    // Class validation
    if (!formData.class) {
      newErrors.class = 'Class is required';
    }

    // School Name validation (optional but if provided, validate format)
    if (formData.school.trim() && formData.school.trim().length < 2) {
      newErrors.school = 'School name must be at least 2 characters long if provided';
    } else if (formData.school.trim() && !/^[a-zA-Z0-9\s\.\-',&()]+$/.test(formData.school.trim())) {
      newErrors.school = 'School name can only contain letters, numbers, spaces, and common school name characters';
    }

    // District validation
    if (!formData.district) {
      newErrors.district = 'District is required';
    }

    // Area validation
    if (!formData.area) {
      newErrors.area = 'Area is required';
    }

    // Unit validation
    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/students/register`, formData);
      
      if (response.data.success) {
        setSubmitStatus({ type: 'success', message: 'Student registered successfully!' });
        setFormData({
          studentName: '',
          parentName: '',
          houseName: '',
          whatsappNumber: '',
          class: '',
          school: '',
          gender: 'Male',
          district: '',
          area: '',
          unit: ''
        });
        setAreas([]);
        setUnits([]);
        setSelectedDistrictId('');
        setSelectedAreaId('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setSubmitStatus({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const classes = ['1', '2', '3', '4', '5', '6', '7']; // Updated to only include classes 1-7

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Malarvadi Little Scholar
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Welcome to Malarvadi Little Scholar Registration Portal
          </p>
          <p className="text-md text-gray-500">
            Register your child for the Little Scholar program
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg ${submitStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {submitStatus.message}
            </p>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
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

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Student Information Section */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Student Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleNameChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.studentName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter student's full name"
                  />
                  {errors.studentName && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
                      errors.class ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>Class {cls}</option>
                    ))}
                  </select>
                  {errors.class && (
                    <p className="mt-1 text-sm text-red-600">{errors.class}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleSchoolNameChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.school ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter school name"
                  />
                  {errors.school && (
                    <p className="mt-1 text-sm text-red-600">{errors.school}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Female</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Information Section */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Parent Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleNameChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.parentName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter parent's full name"
                  />
                  {errors.parentName && (
                    <p className="mt-1 text-sm text-red-600">{errors.parentName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleMobileChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.whatsappNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter 10-digit number starting with 6-9</p>
                  {errors.whatsappNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    House Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="houseName"
                    value={formData.houseName}
                    onChange={handleHouseNameChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.houseName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter house name/address"
                  />
                  {errors.houseName && (
                    <p className="mt-1 text-sm text-red-600">{errors.houseName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="pb-2">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Location Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
                      errors.district ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.title}>{district.title}</option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    disabled={!formData.district}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.area ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select District First</option>
                    {areas.map(area => (
                      <option key={area.id} value={area.title}>{area.title}</option>
                    ))}
                  </select>
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    disabled={!formData.area}
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.unit ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Area First</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting Registration...
                  </div>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;