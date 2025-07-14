import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  // API Configuration
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    district: '',
    area: '',
    unit: '',
    areaCode: ''
  });

  // Data state
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [units, setUnits] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState({
    districts: false,
    areas: false,
    units: false
  });
  const [error, setError] = useState('');

  // Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    } else {
      // Load districts on component mount
      fetchDistricts();
    }
  }, []);

  // Verify existing token
  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('adminToken');
      fetchDistricts();
    }
  };

  // Fetch districts
  const fetchDistricts = async () => {
    setDataLoading(prev => ({ ...prev, districts: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/districts`);
      if (response.data.success) {
        setDistricts(response.data.districts);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      setError('Failed to load districts. Please refresh the page.');
    } finally {
      setDataLoading(prev => ({ ...prev, districts: false }));
    }
  };

  // Fetch areas by district
  const fetchAreas = async (districtId) => {
    if (!districtId) {
      setAreas([]);
      return;
    }

    setDataLoading(prev => ({ ...prev, areas: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/areas/${districtId}`);
      if (response.data.success) {
        setAreas(response.data.areas);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      setError('Failed to load areas for selected district.');
    } finally {
      setDataLoading(prev => ({ ...prev, areas: false }));
    }
  };

  // Fetch units by area
  const fetchUnits = async (areaId) => {
    if (!areaId) {
      setUnits([]);
      return;
    }

    setDataLoading(prev => ({ ...prev, units: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/units/${areaId}`);
      if (response.data.success) {
        setUnits(response.data.units);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
      setError('Failed to load units for selected area.');
    } finally {
      setDataLoading(prev => ({ ...prev, units: false }));
    }
  };

  // Handle dropdown changes
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields
      ...(name === 'district' && { area: '', unit: '' }),
      ...(name === 'area' && { unit: '' })
    }));

    // Clear error when user makes changes
    if (error) {
      setError('');
    }

    // Fetch dependent data
    if (name === 'district' && value) {
      setAreas([]);
      setUnits([]);
      fetchAreas(value);
    } else if (name === 'area' && value) {
      setUnits([]);
      fetchUnits(value);
    }
  };

  // Handle area code input
  const handleAreaCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4); // Only numbers, max 4 digits
    setFormData(prev => ({
      ...prev,
      areaCode: value
    }));

    if (error) {
      setError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { district, area, unit, areaCode } = formData;
    
    if (!district || !area || !unit || !areaCode) {
      setError('Please select district, area, unit and enter the area code');
      return;
    }

    if (areaCode.length !== 4) {
      setError('Area code must be exactly 4 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, formData);
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('adminToken', response.data.token);
        
        // Navigate to dashboard
        navigate('/admin/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Unit Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Select your unit and enter area code to access the dashboard
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* District Selection */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <div className="mt-1">
                <select
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={(e) => handleSelectChange('district', e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  required
                  disabled={dataLoading.districts}
                >
                  <option value="">
                    {dataLoading.districts ? 'Loading districts...' : 'Select District'}
                  </option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Area Selection */}
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Area
              </label>
              <div className="mt-1">
                <select
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={(e) => handleSelectChange('area', e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  required
                  disabled={!formData.district || dataLoading.areas}
                >
                  <option value="">
                    {!formData.district 
                      ? 'Select district first' 
                      : dataLoading.areas 
                        ? 'Loading areas...' 
                        : 'Select Area'
                    }
                  </option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Unit Selection */}
            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <div className="mt-1">
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={(e) => handleSelectChange('unit', e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  required
                  disabled={!formData.area || dataLoading.units}
                >
                  <option value="">
                    {!formData.area 
                      ? 'Select area first' 
                      : dataLoading.units 
                        ? 'Loading units...' 
                        : 'Select Unit'
                    }
                  </option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Area Code Input */}
            <div>
              <label htmlFor="areaCode" className="block text-sm font-medium text-gray-700">
                Area Code
              </label>
              <div className="mt-1">
                <input
                  id="areaCode"
                  name="areaCode"
                  type="text"
                  required
                  value={formData.areaCode}
                  onChange={handleAreaCodeChange}
                  maxLength={4}
                  pattern="[0-9]{4}"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter 4-digit area code"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the 4-digit code provided for your area
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !formData.district || !formData.area || !formData.unit || formData.areaCode.length !== 4}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg 
                      className="w-4 h-4 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" 
                      />
                    </svg>
                    Access Dashboard
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Back to Registration Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
                Back to Student Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 