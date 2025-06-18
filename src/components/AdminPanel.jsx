import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, RefreshCw, Users, Settings, BarChart3 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminPanel = () => {
    const [participants, setParticipants] = useState([]);
    const [participantSettings, setParticipantSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null); // Keep error for initial load
    const [stats, setStats] = useState(null);

    // Mock API base URL - replace with your actual API
    const API_BASE_URL = 'https://card-backend-three.vercel.app/api';

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch all participants
            const participantsResponse = await fetch(`${API_BASE_URL}/participants`);
            const participantsData = await participantsResponse.json();
            
            // Fetch participant settings
            const settingsResponse = await fetch(`${API_BASE_URL}/admin/participant-settings`);
            const settingsData = await settingsResponse.json();
            
            setParticipants(participantsData);
            setParticipantSettings(settingsData);
            
            // Fetch stats
            const statsResponse = await fetch(`${API_BASE_URL}/stats`);
            const statsData = await statsResponse.json();
            setStats(statsData);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load participant data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleParticipant = (participantId) => {
        setParticipantSettings(prev => ({
            ...prev,
            [participantId]: !prev[participantId]
        }));
    };

    const saveSettings = async () => {
        setSaving(true);
        const toastId = toast.loading('Saving settings...');

        try {
            const response = await fetch(`${API_BASE_URL}/admin/participant-settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(participantSettings),
            });

            if (!response.ok) {
                throw new Error('Failed to save settings');
            }

            toast.success('Settings saved successfully!', { id: toastId });

        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings. Please try again.', { id: toastId });
        } finally {
            setSaving(false);
        }
    };

    const toggleAll = (enable) => {
        const newSettings = {};
        participants.forEach(participant => {
            newSettings[participant.id] = enable;
        });
        setParticipantSettings(newSettings);
        toast.success(`All participants ${enable ? 'enabled' : 'disabled'}. Remember to save your changes.`);
    };

    useEffect(() => {
        fetchParticipants();
    }, []);

    const enabledCount = Object.values(participantSettings).filter(Boolean).length;
    const totalCount = participants.length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-lg mb-4">
                        <Settings className="text-white" size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin Panel
                    </h1>
                    <p className="text-gray-600">
                        Manage participant visibility for CARD 2025 voting
                    </p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Participants</p>
                                    <p className="text-2xl font-semibold text-gray-900">{totalCount}</p>
                                </div>
                                <Users className="text-gray-400" size={24} />
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Enabled</p>
                                    <p className="text-2xl font-semibold text-emerald-600">{enabledCount}</p>
                                </div>
                                <Eye className="text-emerald-500" size={24} />
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Disabled</p>
                                    <p className="text-2xl font-semibold text-red-600">{totalCount - enabledCount}</p>
                                </div>
                                <EyeOff className="text-red-500" size={24} />
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Votes</p>
                                    <p className="text-2xl font-semibold text-blue-600">{stats.totalVotes}</p>
                                </div>
                                <BarChart3 className="text-blue-500" size={24} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center">
                    <button
                        onClick={() => toggleAll(true)}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                        <Eye size={16} />
                        <span>Enable All</span>
                    </button>
                    
                    <button
                        onClick={() => toggleAll(false)}
                        className="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                        <EyeOff size={16} />
                        <span>Disable All</span>
                    </button>
                    
                    <button
                        onClick={fetchParticipants}
                        disabled={loading}
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        <span>Refresh</span>
                    </button>
                </div>

                {/* NOTE: Status Messages have been removed and replaced by toasts */}

                {/* Participants List */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Participant Management</h2>
                            <p className="text-gray-600">Toggle participant visibility for voting</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-4">
                                {participants.map((participant) => {
                                    const isEnabled = participantSettings[participant.id] || false;
                                    const participantVotes = stats?.participantVoteCount?.find(p => p._id === participant.id)?.count || 0;
                                    
                                    return (
                                        <div
                                            key={participant.id}
                                            className={`p-4 rounded-lg border transition-colors duration-200 ${
                                                isEnabled 
                                                    ? 'border-emerald-200 bg-emerald-50' 
                                                    : 'border-gray-200 bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={participant.avatar}
                                                        alt={participant.name}
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                                    />
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{participant.name}</h3>
                                                        <p className="text-sm text-gray-600">{participant.role}</p>
                                                        <p className="text-xs text-gray-500">ID: {participant.id}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-6">
                                                    <div className="text-center">
                                                        <p className="text-xs text-gray-600 mb-1">Votes</p>
                                                        <p className="text-lg font-semibold text-gray-900">{participantVotes}</p>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => toggleParticipant(participant.id)}
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                            isEnabled 
                                                                ? 'bg-emerald-600 focus:ring-emerald-500' 
                                                                : 'bg-gray-300 focus:ring-gray-500'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                        />
                                                    </button>
                                                    
                                                    <div className="flex items-center space-x-2 min-w-[80px]">
                                                        {isEnabled ? (
                                                            <>
                                                                <Eye className="text-emerald-600" size={18} />
                                                                <span className="text-sm font-medium text-emerald-600">Visible</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="text-gray-400" size={18} />
                                                                <span className="text-sm font-medium text-gray-400">Hidden</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Save Button */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={saveSettings}
                            disabled={saving}
                            className={`bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2 mx-auto ${
                                saving ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save Settings</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;