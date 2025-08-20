import React from 'react';
import { Save, Shield, Bell, Globe, Database } from 'lucide-react';
import Sidebar from '../Sidebar';
import Header from '../Header';

const SystemSettings = () => {
  return (
    <div className="admin-container">
    <Sidebar />
    <div className="admin-content">
    <Header />
    <h1 className="text-2xl font-bold">System Settings</h1>
        <button className="btn btn-primary flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
     

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Security Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Requirements
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">Require minimum 8 characters</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">Require special characters</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                  <span className="ml-2 text-sm text-gray-600">Require numbers</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input type="number" className="input" defaultValue="30" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Notification Settings</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="ml-2 text-sm text-gray-600">Email notifications for new users</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="ml-2 text-sm text-gray-600">Email notifications for new sales</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-600" defaultChecked />
              <span className="ml-2 text-sm text-gray-600">System alerts</span>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">Regional Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Language
              </label>
              <select className="input">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select className="input">
                <option value="utc">UTC</option>
                <option value="est">Eastern Time</option>
                <option value="pst">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <Database className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold">System Maintenance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Retention Period (days)
              </label>
              <input type="number" className="input" defaultValue="90" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backup Frequency
              </label>
              <select className="input">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SystemSettings;