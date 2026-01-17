import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { router } from '@inertiajs/react';

// OrganizationForm Component
const OrganizationForm = ({ organization = null, onSubmit, onCancel, isEditing = false }) => {
    const [formData, setFormData] = useState({
        organization_name: organization?.organization_name || '',
        registration_number: organization?.registration_number || '',
        mission_statement: organization?.mission_statement || '',
        website: organization?.website || '',
        contact_person: organization?.contact_person || '',
        contact_phone: organization?.contact_phone || '',
        contact_address: organization?.contact_address || '',
        organization_type: organization?.organization_type || '',
        focus_areas: organization?.focus_areas || [],
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const organizationTypes = [
        'charity', 'ngo', 'foundation', 'trust', 'other'
    ];

    const focusAreasOptions = [
        'Education', 'Healthcare', 'Poverty Alleviation', 'Environment', 
        'Human Rights', 'Disaster Relief', 'Animal Welfare', 'Arts & Culture',
        'Community Development', 'Women Empowerment', 'Child Welfare', 'Elderly Care'
    ];

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        
        // Basic validation
        const newErrors = {};
        if (!formData.organization_name.trim()) newErrors.organization_name = ['Organization name is required'];
        if (!formData.registration_number.trim()) newErrors.registration_number = ['Registration number is required'];
        if (!formData.mission_statement.trim()) newErrors.mission_statement = ['Mission statement is required'];
        if (!formData.contact_person.trim()) newErrors.contact_person = ['Contact person is required'];
        if (!formData.contact_phone.trim()) newErrors.contact_phone = ['Contact phone is required'];
        if (!formData.contact_address.trim()) newErrors.contact_address = ['Contact address is required'];
        if (!formData.organization_type) newErrors.organization_type = ['Organization type is required'];
        if (formData.focus_areas.length === 0) newErrors.focus_areas = ['At least one focus area is required'];

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        const formDataToSubmit = { ...formData };

        onSubmit(formDataToSubmit).catch(error => {
            setErrors(error.response?.data?.errors || { general: ['An error occurred. Please try again.'] });
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    const handleFocusAreaChange = (area) => {
        setFormData(prev => {
            if (prev.focus_areas.includes(area)) {
                return {
                    ...prev,
                    focus_areas: prev.focus_areas.filter(a => a !== area)
                };
            } else {
                return {
                    ...prev,
                    focus_areas: [...prev.focus_areas, area]
                };
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {isEditing ? 'Update Organization Details' : 'Register Organization'}
                </h2>
                <button
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errors.general[0]}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Organization Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name *
                    </label>
                    <input
                        type="text"
                        value={formData.organization_name}
                        onChange={(e) => setFormData({...formData, organization_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter organization name"
                    />
                    {errors.organization_name && <p className="mt-1 text-sm text-red-600">{errors.organization_name[0]}</p>}
                </div>

                {/* Registration Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number *
                    </label>
                    <input
                        type="text"
                        value={formData.registration_number}
                        onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter registration number"
                    />
                    {errors.registration_number && <p className="mt-1 text-sm text-red-600">{errors.registration_number[0]}</p>}
                </div>

                {/* Mission Statement */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mission Statement *
                    </label>
                    <textarea
                        value={formData.mission_statement}
                        onChange={(e) => setFormData({...formData, mission_statement: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your organization's mission"
                    />
                    {errors.mission_statement && <p className="mt-1 text-sm text-red-600">{errors.mission_statement[0]}</p>}
                </div>

                {/* Website */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                    </label>
                    <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                    />
                    {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website[0]}</p>}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Person *
                        </label>
                        <input
                            type="text"
                            value={formData.contact_person}
                            onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Full name of contact person"
                        />
                        {errors.contact_person && <p className="mt-1 text-sm text-red-600">{errors.contact_person[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Phone *
                        </label>
                        <input
                            type="tel"
                            value={formData.contact_phone}
                            onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Phone number"
                        />
                        {errors.contact_phone && <p className="mt-1 text-sm text-red-600">{errors.contact_phone[0]}</p>}
                    </div>
                </div>

                {/* Contact Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Address *
                    </label>
                    <textarea
                        value={formData.contact_address}
                        onChange={(e) => setFormData({...formData, contact_address: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Full physical address"
                    />
                    {errors.contact_address && <p className="mt-1 text-sm text-red-600">{errors.contact_address[0]}</p>}
                </div>

                {/* Organization Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Type *
                    </label>
                    <select
                        value={formData.organization_type}
                        onChange={(e) => setFormData({...formData, organization_type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select organization type</option>
                        {organizationTypes.map(type => (
                            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                    </select>
                    {errors.organization_type && <p className="mt-1 text-sm text-red-600">{errors.organization_type[0]}</p>}
                </div>

                {/* Focus Areas */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Focus Areas *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {focusAreasOptions.map(area => (
                            <div key={area} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`focus_${area}`}
                                    checked={formData.focus_areas.includes(area)}
                                    onChange={() => handleFocusAreaChange(area)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`focus_${area}`} className="ml-2 block text-sm text-gray-700">
                                    {area}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.focus_areas && <p className="mt-1 text-sm text-red-600">{errors.focus_areas[0]}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Saving...' : (isEditing ? 'Update Organization' : 'Register Organization')}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Main Organization Dashboard Component
export default function OrganizationDashboard({ auth, stats, recentNotifications, hasOrganization }) {
    const [showOrganizationForm, setShowOrganizationForm] = useState(false);
    const [editingOrganization, setEditingOrganization] = useState(null);

    useEffect(() => {
        // If user has an organization, set it for editing
        if (hasOrganization && auth.organization) {
            setEditingOrganization(auth.organization);
        }
    }, [hasOrganization, auth.organization]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const handleAddDonationRequest = () => {
        // Check if organization is registered first
        if (!hasOrganization) {
            alert('Please register your organization first before creating donation requests.');
            setShowOrganizationForm(true);
            return;
        }
        
        // Navigate to the donation request form
        router.get(route('organization.donation-requests.create'));
    };

    const handleManageOrganization = () => {
        if (hasOrganization && auth.organization) {
            setEditingOrganization(auth.organization);
            setShowOrganizationForm(true);
        } else {
            setEditingOrganization(null);
            setShowOrganizationForm(true);
        }
    };

    const handleViewDonationRequests = () => {
        // Check if organization is registered first
        if (!hasOrganization) {
            alert('Please register your organization first to view donation requests.');
            setShowOrganizationForm(true);
            return;
        }
        
        router.get(route('organization.donation-requests.index'));
    };

    const handleOrganizationSubmit = async (formData) => {
        try {
            if (editingOrganization) {
                // Update existing organization
                await router.post(route('organization.update'), formData);
            } else {
                // Register new organization
                await router.post(route('organization.store'), formData);
            }
            
            // Close form on success
            setShowOrganizationForm(false);
            setEditingOrganization(null);
            
            // Reload the page to update the organization status
            window.location.reload();
            
        } catch (error) {
            console.error('Error submitting organization:', error);
            throw error;
        }
    };

    const handleCancelOrganizationForm = () => {
        setShowOrganizationForm(false);
        setEditingOrganization(null);
    };

    const statCards = [
        {
            name: 'Total Donations',
            value: stats.total_donations,
            icon: '💰',
            color: 'bg-blue-500'
        },
        {
            name: 'Pending Requests',
            value: stats.pending_requests,
            icon: '⏳',
            color: 'bg-yellow-500'
        },
        {
            name: 'Approved Requests',
            value: stats.approved_requests,
            icon: '✅',
            color: 'bg-green-500'
        },
        {
            name: 'Total Funds Received',
            value: `LKR ${stats.total_funds_received.toLocaleString()}`,
            icon: '💵',
            color: 'bg-purple-500'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Organization Dashboard</h2>}
        >
            <Head title="Organization Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {showOrganizationForm ? (
                        // Show Organization Form
                        <OrganizationForm
                            organization={editingOrganization}
                            onSubmit={handleOrganizationSubmit}
                            onCancel={handleCancelOrganizationForm}
                            isEditing={!!editingOrganization}
                        />
                    ) : (
                        // Show Dashboard
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                {/* Welcome Message */}
                                {!hasOrganization && (
                                    <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
                                        <p className="font-medium">Welcome to the Organization Dashboard!</p>
                                        <p className="mt-1">Please register your organization to start creating donation requests and receiving donations.</p>
                                    </div>
                                )}

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {statCards.map((stat, index) => (
                                        <div key={index} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                                            <div className="p-5">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className={`w-8 h-8 ${stat.color} rounded-md flex items-center justify-center text-white text-lg`}>
                                                            {stat.icon}
                                                        </div>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                {stat.name}
                                                            </dt>
                                                            <dd className="text-lg font-medium text-gray-900">
                                                                {stat.value}
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Quick Actions */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                Quick Actions
                                            </h3>
                                            <div className="space-y-3">
                                                <button
                                                    onClick={handleManageOrganization}
                                                    className="block w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center transition-colors"
                                                >
                                                    {hasOrganization ? 'Manage Organization Details' : 'Register Organization'}
                                                </button>
                                                <button
                                                    onClick={handleAddDonationRequest}
                                                    className="block w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-center transition-colors"
                                                >
                                                    Add Donation Request
                                                </button>
                                                <button
                                                    onClick={handleViewDonationRequests}
                                                    className="block w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 text-center transition-colors"
                                                >
                                                    View Donation Requests
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Notifications */}
                                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                Recent Notifications
                                                {stats.recent_notifications > 0 && (
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        {stats.recent_notifications} new
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="space-y-3">
                                                {recentNotifications.length > 0 ? (
                                                    recentNotifications.slice(0, 3).map((notification, index) => (
                                                        <div key={index} className="text-sm">
                                                            <p className="text-gray-900 font-medium">
                                                                {notification.type === 'donation_received' 
                                                                    ? `Donation: LKR ${notification.amount.toLocaleString()}`
                                                                    : `Request ${notification.status}: ${notification.title}`
                                                                }
                                                            </p>
                                                            <p className="text-gray-500 text-xs">
                                                                {new Date(notification.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No recent notifications</p>
                                                )}
                                                <a href={route('organization.notifications')} 
                                                   className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                                                    View all notifications →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={handleLogout}
                                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}