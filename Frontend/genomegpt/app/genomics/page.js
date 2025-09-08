'use client';

import React, { useState, useEffect } from 'react';
import {
    Activity, AlertCircle, User, TrendingUp, Clock, Shield,
    Upload, Brain, Heart, Droplet, Moon, CheckCircle, Play,
    Square, Download, RefreshCw, Zap, FileText, Target,
    BarChart3, Stethoscope, Dna, Microscope
} from 'lucide-react';

const UnifiedMedicalDashboard = () => {
    // AEGIS Cancer Prediction State
    const [cancerFormData, setCancerFormData] = useState({
        TP53: '',
        BRCA1: '',
        EGFR: '',
        MYC: '',
        age: '',
        bmi: '',
        smoking_history: '',
        family_history: '',
        previous_cancer_history: '',
        inflammatory_markers: ''
    });
    const [cancerPrediction, setCancerPrediction] = useState(null);
    const [cancerLoading, setCancerLoading] = useState(false);
    const [cancerError, setCancerError] = useState('');

    // BioSync State
    const [bioSyncStatus, setBioSyncStatus] = useState('disconnected');
    const [bioSyncData, setBioSyncData] = useState({});
    const [biomarkerHistory, setBiomarkerHistory] = useState([]);
    const [activeInterventions, setActiveInterventions] = useState([]);
    const [csvFile, setCsvFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [simulationRunning, setSimulationRunning] = useState(false);
    const [biomarkerData, setBiomarkerData] = useState({
        user_id: 'user_001',
        glucose: '',
        hrv: '',
        cortisol: '',
        sleep_quality: '',
        neuro_fatigue: ''
    });

    // UI State
    const [activeTab, setActiveTab] = useState('cancer');

    // API URLs
    const CANCER_API = 'https://bio-ai-platform-2.onrender.com';
    const BIOSYNC_API = 'https://biomark-be.onrender.com';

    // Check BioSync API status
    useEffect(() => {
        const checkBioSyncStatus = async () => {
            try {
                const response = await fetch(`${BIOSYNC_API}/health`);
                if (response.ok) {
                    setBioSyncStatus('connected');
                    fetchBioSyncData();
                }
            } catch (error) {
                setBioSyncStatus('disconnected');
            }
        };

        checkBioSyncStatus();
        const interval = setInterval(checkBioSyncStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchBioSyncData = async () => {
        try {
            const response = await fetch(`${BIOSYNC_API}/dashboard/data`);
            if (response.ok) {
                const data = await response.json();
                setBioSyncData(data);
                if (data.biomarker_history && Array.isArray(data.biomarker_history)) {
                    setBiomarkerHistory(prev => {
                        const combined = [...prev];
                        data.biomarker_history.forEach(apiEntry => {
                            if (!combined.find(localEntry =>
                                localEntry.timestamp === apiEntry.timestamp &&
                                localEntry.user_id === apiEntry.user_id
                            )) {
                                combined.push(apiEntry);
                            }
                        });
                        return combined.slice(-10);
                    });
                }
                if (data.active_interventions) {
                    setActiveInterventions(prev => {
                        const combined = [...prev];
                        data.active_interventions.forEach(apiIntervention => {
                            if (!combined.find(localIntervention =>
                                localIntervention.timestamp === apiIntervention.timestamp &&
                                localIntervention.biomarker === apiIntervention.biomarker
                            )) {
                                combined.unshift(apiIntervention);
                            }
                        });
                        return combined.slice(0, 20);
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching BioSync data:', error);
        }
    };

    // Cancer Prediction Functions
    const loadCancerExample = (type) => {
        const examples = {
            high_risk: {
                TP53: '2.5', BRCA1: '3.0', EGFR: '8.5', MYC: '9.0',
                age: '65', bmi: '32.0', smoking_history: '1',
                family_history: '1', previous_cancer_history: '1',
                inflammatory_markers: '8.5'
            },
            low_risk: {
                TP53: '6.0', BRCA1: '5.5', EGFR: '4.0', MYC: '4.5',
                age: '35', bmi: '22.0', smoking_history: '0',
                family_history: '0', previous_cancer_history: '0',
                inflammatory_markers: '1.0'
            }
        };
        setCancerFormData(examples[type]);
        setCancerPrediction(null);
        setCancerError('');
    };

    const validateCancerForm = () => {
        const requiredFields = Object.keys(cancerFormData);
        const emptyFields = requiredFields.filter(field => !cancerFormData[field]);

        if (emptyFields.length > 0) {
            setCancerError(`Please fill in all fields. Missing: ${emptyFields.join(', ')}`);
            return false;
        }

        const validations = {
            TP53: { min: 0, max: 15 }, BRCA1: { min: 0, max: 15 },
            EGFR: { min: 0, max: 15 }, MYC: { min: 0, max: 15 },
            age: { min: 18, max: 120 }, bmi: { min: 12, max: 50 },
            smoking_history: { min: 0, max: 1 }, family_history: { min: 0, max: 1 },
            previous_cancer_history: { min: 0, max: 1 }, inflammatory_markers: { min: 0, max: 20 }
        };

        for (const [field, range] of Object.entries(validations)) {
            const value = parseFloat(cancerFormData[field]);
            if (isNaN(value) || value < range.min || value > range.max) {
                setCancerError(`${field}: Value must be between ${range.min} and ${range.max}`);
                return false;
            }
        }
        return true;
    };

    const handleCancerSubmit = async (e) => {
        e.preventDefault();
        if (!validateCancerForm()) return;

        setCancerLoading(true);
        setCancerError('');
        setCancerPrediction(null);

        try {
            const payload = {};
            Object.keys(cancerFormData).forEach(key => {
                payload[key] = parseFloat(cancerFormData[key]);
            });

            const response = await fetch(`${CANCER_API}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setCancerPrediction(result);
        } catch (err) {
            setCancerError(`Prediction failed: ${err.message}`);
        } finally {
            setCancerLoading(false);
        }
    };

    // BioSync Functions
    const handleCsvUpload = async () => {
        if (!csvFile) return;

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            setUploadStatus('uploading');
            const response = await fetch(`${BIOSYNC_API}/upload-csv`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                setUploadStatus(`success: ${result.message}`);
                fetchBioSyncData();
            } else {
                setUploadStatus('error: Upload failed');
            }
        } catch (error) {
            setUploadStatus('error: Connection failed');
        }
    };

    const handleBiomarkerSubmit = async () => {
        try {
            const newEntry = {
                ...biomarkerData,
                timestamp: new Date().toLocaleString(),
                glucose: parseFloat(biomarkerData.glucose) || 0,
                hrv: parseFloat(biomarkerData.hrv) || 0,
                cortisol: parseFloat(biomarkerData.cortisol) || 0,
                sleep_quality: parseFloat(biomarkerData.sleep_quality) || 0,
                neuro_fatigue: parseFloat(biomarkerData.neuro_fatigue) || 0
            };

            setBiomarkerHistory(prev => [...prev, newEntry].slice(-5));

            const response = await fetch(`${BIOSYNC_API}/process-biomarkers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(biomarkerData)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.interventions) {
                    const timestampedInterventions = result.interventions.map(intervention => ({
                        ...intervention,
                        timestamp: intervention.timestamp || new Date().toLocaleString()
                    }));
                    setActiveInterventions(prev => [...timestampedInterventions, ...prev]);
                }
                fetchBioSyncData();
            }

            setBiomarkerData({
                ...biomarkerData,
                glucose: '', hrv: '', cortisol: '',
                sleep_quality: '', neuro_fatigue: ''
            });
        } catch (error) {
            console.error('Error processing biomarkers:', error);
        }
    };

    const startSimulation = async () => {
        try {
            const response = await fetch(`${BIOSYNC_API}/simulate-realtime`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ duration_minutes: 5 })
            });

            if (response.ok) {
                setSimulationRunning(true);
                const interval = setInterval(fetchBioSyncData, 2000);
                setTimeout(() => {
                    setSimulationRunning(false);
                    clearInterval(interval);
                }, 300000);
            }
        } catch (error) {
            console.error('Error starting simulation:', error);
        }
    };

    const stopSimulation = async () => {
        try {
            await fetch(`${BIOSYNC_API}/stop-simulation`, { method: 'POST' });
            setSimulationRunning(false);
        } catch (error) {
            console.error('Error stopping simulation:', error);
        }
    };

    const getRiskColor = (percentage) => {
        if (percentage < 25) return 'text-green-600 bg-green-50 border-green-200';
        if (percentage < 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        if (percentage < 75) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getBiomarkerIcon = (biomarker) => {
        switch (biomarker) {
            case 'glucose': return <Droplet size={20} />;
            case 'hrv': return <Heart size={20} />;
            case 'cortisol': return <Activity size={20} />;
            case 'sleep_quality': return <Moon size={20} />;
            case 'neuro_fatigue': return <Brain size={20} />;
            default: return <Activity size={20} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Main Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Stethoscope className="w-12 h-12 text-indigo-600 mr-4" />
                        <div className="text-left">
                            <h1 className="text-4xl font-bold text-gray-900">Medical AI Platform</h1>
                            <p className="text-xl text-gray-600">Unified Cancer Prediction & Biomarker Monitoring</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-xl p-2 shadow-lg">
                        <button
                            onClick={() => setActiveTab('cancer')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'cancer'
                                    ? 'bg-red-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Target className="w-5 h-5" />
                            AEGIS Cancer Prediction
                        </button>
                        <button
                            onClick={() => setActiveTab('biosync')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ml-2 ${activeTab === 'biosync'
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <Zap className="w-5 h-5" />
                            BioSyncDEX Monitoring
                        </button>
                    </div>
                </div>

                {/* Cancer Prediction Tab */}
                {activeTab === 'cancer' && (
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Cancer Input Form */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <div className="flex items-center mb-6">
                                    <Dna className="w-6 h-6 text-red-600 mr-3" />
                                    <h2 className="text-2xl font-semibold text-gray-900">Patient Genomic Profile</h2>
                                </div>

                                <div className="mb-6 flex gap-3">
                                    <button
                                        onClick={() => loadCancerExample('high_risk')}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                    >
                                        Load High Risk Sample
                                    </button>
                                    <button
                                        onClick={() => loadCancerExample('low_risk')}
                                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                    >
                                        Load Low Risk Sample
                                    </button>
                                </div>

                                <form onSubmit={handleCancerSubmit} className="space-y-6">
                                    {/* Genetic Biomarkers */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                            Genetic Biomarkers
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['TP53', 'BRCA1', 'EGFR', 'MYC'].map((field) => (
                                                <div key={field}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        {field} (0-15)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={cancerFormData[field]}
                                                        onChange={(e) => setCancerFormData({ ...cancerFormData, [field]: e.target.value })}
                                                        step="0.1"
                                                        min="0"
                                                        max="15"
                                                        className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Clinical Factors */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                            Clinical Factors
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Age (18-120)</label>
                                                <input
                                                    type="number"
                                                    value={cancerFormData.age}
                                                    onChange={(e) => setCancerFormData({ ...cancerFormData, age: e.target.value })}
                                                    min="18"
                                                    max="120"
                                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">BMI (12-50)</label>
                                                <input
                                                    type="number"
                                                    value={cancerFormData.bmi}
                                                    onChange={(e) => setCancerFormData({ ...cancerFormData, bmi: e.target.value })}
                                                    step="0.1"
                                                    min="12"
                                                    max="50"
                                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                            </div>
                                            {['smoking_history', 'family_history', 'previous_cancer_history'].map((field) => (
                                                <div key={field}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </label>
                                                    <select
                                                        value={cancerFormData[field]}
                                                        onChange={(e) => setCancerFormData({ ...cancerFormData, [field]: e.target.value })}
                                                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="0">No</option>
                                                        <option value="1">Yes</option>
                                                    </select>
                                                </div>
                                            ))}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Inflammatory Markers (0-20)</label>
                                                <input
                                                    type="number"
                                                    value={cancerFormData.inflammatory_markers}
                                                    onChange={(e) => setCancerFormData({ ...cancerFormData, inflammatory_markers: e.target.value })}
                                                    step="0.1"
                                                    min="0"
                                                    max="20"
                                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {cancerError && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                                            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                            <span className="text-red-700">{cancerError}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={cancerLoading}
                                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
                                    >
                                        {cancerLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                                                Analyzing Genomic Data...
                                            </>
                                        ) : (
                                            'Predict Cancer Risk'
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Cancer Results */}
                            <div className="bg-white rounded-2xl shadow-xl p-8">
                                <div className="flex items-center mb-6">
                                    <BarChart3 className="w-6 h-6 text-red-600 mr-3" />
                                    <h2 className="text-2xl font-semibold text-gray-900">Risk Assessment Results</h2>
                                </div>

                                {!cancerPrediction && !cancerLoading && (
                                    <div className="text-center py-12">
                                        <Microscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Enter genomic profile data to see risk assessment</p>
                                    </div>
                                )}

                                {cancerLoading && (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Analyzing genomic markers...</p>
                                    </div>
                                )}

                                {cancerPrediction && (
                                    <div className="space-y-6">
                                        <div className={`p-6 rounded-xl border-2 ${getRiskColor(cancerPrediction.cancer_risk_percentage)}`}>
                                            <div className="flex items-center mb-3">
                                                <Shield className="w-6 h-6" />
                                                <h3 className="text-xl font-semibold ml-3">{cancerPrediction.risk_category}</h3>
                                            </div>
                                            <div className="text-3xl font-bold mb-2">
                                                {cancerPrediction.cancer_risk_percentage}%
                                            </div>
                                            <p className="font-medium">Cancer Risk Probability</p>
                                        </div>

                                        <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
                                            <div className="flex items-center mb-3">
                                                <Clock className="w-6 h-6 text-blue-600" />
                                                <h3 className="text-xl font-semibold text-blue-900 ml-3">Survival Prediction</h3>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-2xl font-bold text-blue-900">{cancerPrediction.survival_years}</div>
                                                    <p className="text-blue-700">Years</p>
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold text-blue-900">{cancerPrediction.survival_months}</div>
                                                    <p className="text-blue-700">Months</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 border-2 border-gray-200 p-6 rounded-xl">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Model Confidence</h3>
                                            <div className="flex items-center">
                                                <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                                                    <div
                                                        className="bg-red-600 h-3 rounded-full transition-all duration-500"
                                                        style={{ width: `${cancerPrediction.confidence_score * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {Math.round(cancerPrediction.confidence_score * 100)}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                                            <div className="flex items-start">
                                                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm text-yellow-800">
                                                    <p className="font-medium mb-1">Medical Disclaimer</p>
                                                    <p>This prediction is for research purposes only and should not replace professional medical advice.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* BioSync Tab */}
                {activeTab === 'biosync' && (
                    <div className="max-w-7xl mx-auto">
                        {/* Status Header */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Zap className="w-8 h-8 text-blue-600 mr-3" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">BioSyncDEX™ Monitoring System</h2>
                                        <p className="text-gray-600">Real-time biomarker analysis and intervention system</p>
                                    </div>
                                </div>
                                <div className={`flex items-center px-4 py-2 rounded-lg ${bioSyncStatus === 'connected'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    <div className={`w-3 h-3 rounded-full mr-2 ${bioSyncStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                    {bioSyncStatus === 'connected' ? 'SYSTEM ONLINE' : 'DISCONNECTED'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Input Section */}
                            <div className="lg:col-span-1">
                                {/* CSV Upload */}
                                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Upload className="w-5 h-5 mr-2" />
                                        Training Data Upload
                                    </h3>
                                    <div className="space-y-4">
                                        <input
                                            type="file"
                                            accept=".csv"
                                            onChange={(e) => setCsvFile(e.target.files[0])}
                                            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
                                        />
                                        <button
                                            onClick={handleCsvUpload}
                                            disabled={!csvFile || bioSyncStatus !== 'connected'}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            Upload & Train Models
                                        </button>
                                        {uploadStatus && (
                                            <div className={`p-3 rounded-lg text-sm ${uploadStatus.includes('success')
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {uploadStatus}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Manual Input */}
                                <div className="bg-white rounded-2xl shadow-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Activity className="w-5 h-5 mr-2" />
                                        Live Biomarker Input
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'glucose', label: 'Glucose', unit: 'mg/dL', icon: Droplet },
                                            { key: 'hrv', label: 'Heart Rate Variability', unit: 'ms', icon: Heart },
                                            { key: 'cortisol', label: 'Cortisol', unit: 'μg/dL', icon: Activity },
                                            { key: 'sleep_quality', label: 'Sleep Quality', unit: '0-100', icon: Moon },
                                            { key: 'neuro_fatigue', label: 'Neuro Fatigue', unit: '0-100', icon: Brain }
                                        ].map((field) => {
                                            const IconComponent = field.icon;
                                            return (
                                                <div key={field.key}>
                                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                                        <IconComponent size={16} className="mr-2" />
                                                        {field.label} ({field.unit})
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={biomarkerData[field.key]}
                                                        onChange={(e) => setBiomarkerData({ ...biomarkerData, [field.key]: e.target.value })}
                                                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="Enter value"
                                                    />
                                                </div>
                                            );
                                        })}
                                        <button
                                            onClick={handleBiomarkerSubmit}
                                            disabled={bioSyncStatus !== 'connected'}
                                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                                        >
                                            <Activity className="w-5 h-5 inline mr-2" />
                                            Analyze Biomarkers
                                        </button>
                                    </div>
                                </div>

                                {/* Simulation Controls */}
                                <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Play className="w-5 h-5 mr-2" />
                                        Real-time Simulation
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={startSimulation}
                                            disabled={simulationRunning || bioSyncStatus !== 'connected'}
                                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                                        >
                                            <Play className="w-4 h-4 inline mr-1" />
                                            Start
                                        </button>
                                        <button
                                            onClick={stopSimulation}
                                            disabled={!simulationRunning}
                                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
                                        >
                                            <Square className="w-4 h-4 inline mr-1" />
                                            Stop
                                        </button>
                                        <button
                                            onClick={fetchBioSyncData}
                                            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {simulationRunning && (
                                        <div className="mt-3 flex items-center justify-center text-sm text-blue-600">
                                            <div className="animate-pulse w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                                            SIMULATION ACTIVE
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dashboard Section */}
                            <div className="lg:col-span-1">
                                {/* Status Cards */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-blue-100">Total Processed</p>
                                                <p className="text-2xl font-bold">{bioSyncData?.total_processed || 0}</p>
                                            </div>
                                            <Activity className="w-8 h-8 text-blue-200" />
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-purple-100">ML Models</p>
                                                <p className="text-2xl font-bold">{bioSyncData?.models_available?.length || 0}</p>
                                            </div>
                                            <Brain className="w-8 h-8 text-purple-200" />
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Biomarkers */}
                                <div className="bg-white rounded-2xl shadow-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2" />
                                        Recent Biomarker Data
                                    </h3>
                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {biomarkerHistory.length > 0 ? biomarkerHistory.slice(-5).map((data, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                                                            {data.user_id?.slice(-2) || 'U'}
                                                        </div>
                                                        <span className="ml-2 text-sm font-medium text-gray-900">{data.user_id}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{data.timestamp}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { key: 'glucose', icon: Droplet, color: 'text-red-600' },
                                                        { key: 'hrv', icon: Heart, color: 'text-pink-600' },
                                                        { key: 'cortisol', icon: Activity, color: 'text-yellow-600' },
                                                        { key: 'sleep_quality', icon: Moon, color: 'text-blue-600' },
                                                        { key: 'neuro_fatigue', icon: Brain, color: 'text-purple-600' }
                                                    ].map((biomarker) => {
                                                        const IconComponent = biomarker.icon;
                                                        return (
                                                            <div key={biomarker.key} className="flex items-center text-xs">
                                                                <IconComponent size={14} className={`mr-1 ${biomarker.color}`} />
                                                                <span className="text-gray-600">{biomarker.key.replace('_', ' ')}:</span>
                                                                <span className="ml-1 font-medium">{data[biomarker.key] ? Number(data[biomarker.key]).toFixed(1) : 'N/A'}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                <p>No biomarker data available</p>
                                                <p className="text-sm">Upload CSV or enter manual data</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Interventions Section */}
                            <div className="lg:col-span-1">
                                {/* Active Interventions */}
                                <div className="bg-white rounded-2xl shadow-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Shield className="w-5 h-5 mr-2" />
                                        Active Interventions
                                        {activeInterventions.length > 0 && (
                                            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                                                {activeInterventions.length}
                                            </span>
                                        )}
                                    </h3>
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {activeInterventions.length > 0 ? activeInterventions.slice(0, 10).map((intervention, index) => (
                                            <div key={index} className={`border-l-4 pl-4 py-3 rounded-r-lg ${intervention.priority === 'high' ? 'border-red-500 bg-red-50' :
                                                    intervention.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                                                        'border-blue-500 bg-blue-50'
                                                }`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        {getBiomarkerIcon(intervention.biomarker)}
                                                        <span className="ml-2 font-medium text-gray-900 capitalize">
                                                            {intervention.biomarker?.replace('_', ' ') || 'Unknown'}
                                                        </span>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${intervention.priority === 'high' ? 'bg-red-200 text-red-800' :
                                                            intervention.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                                                'bg-blue-200 text-blue-800'
                                                        }`}>
                                                        {intervention.priority || 'medium'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-700 mb-2">
                                                    {intervention.intervention || 'No intervention specified'}
                                                </p>
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <span>Value: {intervention.value || 'N/A'}</span>
                                                    <span>{intervention.timestamp || 'No timestamp'}</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-8">
                                                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                                                <p className="text-green-700 font-medium">All Systems Optimal</p>
                                                <p className="text-sm text-green-600">All biomarkers within normal ranges</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* System Status */}
                                <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Shield className="w-5 h-5 mr-2" />
                                        System Status
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Engine Status</span>
                                            <span className={`px-2 py-1 rounded text-sm font-medium ${bioSyncData?.engine_status === 'running'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {bioSyncData?.engine_status || 'idle'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Active Alerts</span>
                                            <span className="text-red-600 font-medium">{activeInterventions.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Trained Models</span>
                                            <span className="text-blue-600 font-medium">{bioSyncData?.models_available?.length || 0}</span>
                                        </div>
                                        {bioSyncData?.models_available && bioSyncData.models_available.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-600 mb-2">Available Models:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {bioSyncData.models_available.map((model, index) => (
                                                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                            {model}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t border-gray-200">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">Last Update</span>
                                                <span className="text-gray-800">{bioSyncData?.current_time || 'Never'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Export Controls */}
                                <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Download className="w-5 h-5 mr-2" />
                                        Export Data
                                    </h3>
                                    <div className="space-y-2">
                                        <a
                                            href={`${BIOSYNC_API}/export-results`}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Export Results
                                        </a>
                                        <a
                                            href={`${BIOSYNC_API}/download-sample-csv`}
                                            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium flex items-center justify-center"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            Sample CSV
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500 border-t border-gray-200 pt-8">
                    <p className="mb-2">
                        <strong>Medical AI Platform</strong> - Integrated Cancer Prediction & Biomarker Monitoring
                    </p>
                    <p className="text-sm">
                        AEGIS API: {CANCER_API} | BioSyncDEX API: {BIOSYNC_API}
                    </p>
                    <p className="text-xs mt-2">
                        For research and educational purposes only. Not for clinical diagnosis or treatment.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UnifiedMedicalDashboard;