// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const StudentRegistration = () => {
//   // API Configuration
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
//   const [formData, setFormData] = useState({
//     studentName: '',
//     parentName: '',
//     houseName: '',
//     whatsappNumber: '',
//     class: '',
//     school: '',
//     gender: 'Male',
//     district: '',
//     area: '',
//     unit: ''
//   });

//   const [districts, setDistricts] = useState([]);
//   const [areas, setAreas] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [selectedDistrictId, setSelectedDistrictId] = useState('');
//   const [selectedAreaId, setSelectedAreaId] = useState('');

//   // Fetch districts on component mount
//   useEffect(() => {
//     fetchDistricts();
//   }, []);

//   const fetchDistricts = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/students/districts`);
//       if (response.data.success) {
//         setDistricts(response.data.districts);
//       }
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//     }
//   };

//   const fetchAreas = async (districtId) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/students/areas/${districtId}`);
//       if (response.data.success) {
//         setAreas(response.data.areas);
//         setUnits([]); // Reset units when district changes
//         setFormData(prev => ({ ...prev, area: '', unit: '' }));
//         setSelectedAreaId(''); // Reset selected area ID
//       } else {
//         console.error('Areas API returned error:', response.data.message);
//         setAreas([]);
//         setUnits([]);
//         setFormData(prev => ({ ...prev, area: '', unit: '' }));
//       }
//     } catch (error) {
//       console.error('Error fetching areas:', error);
//       // Check if it's a 501 error (API not implemented/configured)
//       if (error.response?.status === 501) {
//         console.warn('Areas API not configured:', error.response.data.message);
//       }
//       setAreas([]);
//       setUnits([]);
//       setFormData(prev => ({ ...prev, area: '', unit: '' }));
//     }
//   };

//   const fetchUnits = async (areaId) => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/students/units/${areaId}`);
//       if (response.data.success) {
//         setUnits(response.data.units);
//         setFormData(prev => ({ ...prev, unit: '' }));
//       } else {
//         console.error('Units API returned error:', response.data.message);
//         setUnits([]);
//         setFormData(prev => ({ ...prev, unit: '' }));
//       }
//     } catch (error) {
//       console.error('Error fetching units:', error);
//       // Check if it's a 501 error (API not implemented/configured)
//       if (error.response?.status === 501) {
//         console.warn('Units API not configured:', error.response.data.message);
//       }
//       setUnits([]);
//       setFormData(prev => ({ ...prev, unit: '' }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     // Clear specific field error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }

//     // Handle dependent dropdowns
//     if (name === 'district' && value) {
//       // Find the selected district object to get its ID
//       const selectedDistrict = districts.find(district => district.title === value);
//       if (selectedDistrict) {
//         setSelectedDistrictId(selectedDistrict.id);
//         fetchAreas(selectedDistrict.id);
//       }
//     } else if (name === 'area' && value) {
//       // Find the selected area object to get its ID
//       const selectedArea = areas.find(area => area.title === value);
//       if (selectedArea) {
//         setSelectedAreaId(selectedArea.id);
//         fetchUnits(selectedArea.id);
//       }
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
//     if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
//     if (!formData.houseName.trim()) newErrors.houseName = 'House name is required';
//     if (!formData.whatsappNumber.trim()) newErrors.whatsappNumber = 'WhatsApp number is required';
//     if (!formData.class) newErrors.class = 'Class is required';
//     if (!formData.school.trim()) newErrors.school = 'School name is required';
//     if (!formData.district) newErrors.district = 'District is required';
//     if (!formData.area) newErrors.area = 'Area is required';
//     if (!formData.unit) newErrors.unit = 'Unit is required';

//     // Validate phone number format
//     if (formData.whatsappNumber && !/^[+]?[\d\s-()]{10,15}$/.test(formData.whatsappNumber)) {
//       newErrors.whatsappNumber = 'Please enter a valid phone number';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
//     setSubmitStatus(null);

//     try {
//       const response = await axios.post(`${API_BASE_URL}/students/register`, formData);
      
//       if (response.data.success) {
//         setSubmitStatus({ type: 'success', message: 'Student registered successfully!' });
//         // Reset form
//         setFormData({
//           studentName: '',
//           parentName: '',
//           houseName: '',
//           whatsappNumber: '',
//           class: '',
//           school: '',
//           gender: 'Male',
//           district: '',
//           area: '',
//           unit: ''
//         });
//         setAreas([]);
//         setUnits([]);
//         setSelectedDistrictId('');
//         setSelectedAreaId('');
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
//       setSubmitStatus({ type: 'error', message: errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h2>
//           <p className="text-gray-600">Please fill in all required information to register your child</p>
//         </div>

//         {/* Success/Error Messages */}
//         {submitStatus && (
//           <div className={`mb-6 p-4 rounded-md ${submitStatus.type === 'success' 
//             ? 'bg-green-50 border border-green-200' 
//             : 'bg-red-50 border border-red-200'
//           }`}>
//             <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
//               {submitStatus.message}
//             </p>
//           </div>
//         )}

//         {/* Registration Form */}
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
//             {/* Student Information Section */}
//             <div className="border-b border-gray-200 pb-8">
//               <div className="flex items-center mb-6">
//                 <div className="flex-shrink-0">
//                   <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//                     <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <h3 className="ml-3 text-lg font-medium text-gray-900">Student Information</h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Student Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="studentName"
//                     value={formData.studentName}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.studentName ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter student's full name"
//                   />
//                   {errors.studentName && (
//                     <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Class <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="class"
//                     value={formData.class}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
//                       errors.class ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                   >
//                     <option value="">Select Class</option>
//                     {classes.map(cls => (
//                       <option key={cls} value={cls}>Class {cls}</option>
//                     ))}
//                   </select>
//                   {errors.class && (
//                     <p className="mt-1 text-sm text-red-600">{errors.class}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     School Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="school"
//                     value={formData.school}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.school ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter school name"
//                   />
//                   {errors.school && (
//                     <p className="mt-1 text-sm text-red-600">{errors.school}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Gender <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex space-x-4 mt-2">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="Male"
//                         checked={formData.gender === 'Male'}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Male</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="gender"
//                         value="Female"
//                         checked={formData.gender === 'Female'}
//                         onChange={handleInputChange}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Female</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Parent Information Section */}
//             <div className="border-b border-gray-200 pb-8">
//               <div className="flex items-center mb-6">
//                 <div className="flex-shrink-0">
//                   <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                     <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <h3 className="ml-3 text-lg font-medium text-gray-900">Parent Information</h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Parent Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="parentName"
//                     value={formData.parentName}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.parentName ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter parent's full name"
//                   />
//                   {errors.parentName && (
//                     <p className="mt-1 text-sm text-red-600">{errors.parentName}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     WhatsApp Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     name="whatsappNumber"
//                     value={formData.whatsappNumber}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.whatsappNumber ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter 10-digit mobile number"
//                   />
//                   {errors.whatsappNumber && (
//                     <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>
//                   )}
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     House Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="houseName"
//                     value={formData.houseName}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.houseName ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter house name/address"
//                   />
//                   {errors.houseName && (
//                     <p className="mt-1 text-sm text-red-600">{errors.houseName}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Location Information Section */}
//             <div className="pb-2">
//               <div className="flex items-center mb-6">
//                 <div className="flex-shrink-0">
//                   <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
//                     <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <h3 className="ml-3 text-lg font-medium text-gray-900">Location Information</h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     District <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="district"
//                     value={formData.district}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
//                       errors.district ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                   >
//                     <option value="">Select District</option>
//                     {districts.map(district => (
//                       <option key={district.id} value={district.title}>{district.title}</option>
//                     ))}
//                   </select>
//                   {errors.district && (
//                     <p className="mt-1 text-sm text-red-600">{errors.district}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Area <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="area"
//                     value={formData.area}
//                     onChange={handleInputChange}
//                     disabled={!formData.district}
//                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
//                       errors.area ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                   >
//                     <option value="">Select District First</option>
//                     {areas.map(area => (
//                       <option key={area.id} value={area.title}>{area.title}</option>
//                     ))}
//                   </select>
//                   {errors.area && (
//                     <p className="mt-1 text-sm text-red-600">{errors.area}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Unit <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="unit"
//                     value={formData.unit}
//                     onChange={handleInputChange}
//                     disabled={!formData.area}
//                     className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
//                       errors.unit ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                   >
//                     <option value="">Select Area First</option>
//                     {units.map(unit => (
//                       <option key={unit} value={unit}>{unit}</option>
//                     ))}
//                   </select>
//                   {errors.unit && (
//                     <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Submitting Registration...
//                   </div>
//                 ) : (
//                   'Submit Registration'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentRegistration; 



// components/StudentRegistration.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentRegistration = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

    if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
    if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
    if (!formData.houseName.trim()) newErrors.houseName = 'House name is required';
    if (!formData.whatsappNumber.trim()) newErrors.whatsappNumber = 'WhatsApp number is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.school.trim()) newErrors.school = 'School name is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.area) newErrors.area = 'Area is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';

    if (formData.whatsappNumber && !/^[+]?[\d\s-()]{10,15}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid phone number';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h2>
          <p className="text-gray-600">Please fill in all required information to register your child</p>
        </div>

        {submitStatus && (
          <div className={`mb-6 p-4 rounded-md ${submitStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {submitStatus.message}
            </p>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
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
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
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
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.whatsappNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit mobile number"
                  />
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
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm ${
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
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
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
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
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

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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