'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getAllUsers, getAllProfiles, getAllEvents, getAllConnections, verifyProfile, deactivateUser, getUserById, getProfileById, updateUserRole, rejectProfile, getPendingVerifications } from '@/lib/store';
import { User, Profile, Event, Connection, UserRole, ROLE_LABELS } from '@/lib/types';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'profiles' | 'events' | 'connections' | 'pending'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      router.push('/auth/login');
      return;
    }

    loadData();
  }, [user, router]);

  const loadData = () => {
    setUsers(getAllUsers());
    setProfiles(getAllProfiles());
    setEvents(getAllEvents());
    setConnections(getAllConnections());
  };

  const handleVerifyProfile = (profileId: string) => {
    verifyProfile(profileId);
    loadData();
  };

  const handleRejectProfile = (profileId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      rejectProfile(profileId, reason);
      loadData();
    }
  };

  const handleDeactivateUser = (userId: string) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      deactivateUser(userId);
      loadData();
    }
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    updateUserRole(userId, newRole);
    loadData();
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  const pendingProfiles = profiles.filter(p => !p.isVerified);
  const verifiedProfiles = profiles.filter(p => p.isVerified);

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-[#A3A3A3]">Manage platform members, profiles, and events</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1F1F1F] rounded-lg p-6 border border-white/5">
            <p className="text-[#A3A3A3] text-sm">Total Members</p>
            <p className="text-3xl font-bold text-white">{users.filter(u => u.role === 'member').length}</p>
          </div>
          <div className="bg-[#1F1F1F] rounded-lg p-6 border border-white/5">
            <p className="text-[#A3A3A3] text-sm">Verified Profiles</p>
            <p className="text-3xl font-bold text-white">{profiles.filter(p => p.isVerified).length}</p>
          </div>
          <div className="bg-[#1F1F1F] rounded-lg p-6 border border-white/5">
            <p className="text-[#A3A3A3] text-sm">Active Events</p>
            <p className="text-3xl font-bold text-white">{events.length}</p>
          </div>
          <div className="bg-[#1F1F1F] rounded-lg p-6 border border-white/5">
            <p className="text-[#A3A3A3] text-sm">Connections</p>
            <p className="text-3xl font-bold text-white">{connections.filter(c => c.status === 'accepted').length}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-4 px-4 whitespace-nowrap transition-colors ${
              activeTab === 'members'
                ? 'text-[#C9A962] border-b-2 border-[#C9A962]'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('profiles')}
            className={`pb-4 px-4 whitespace-nowrap transition-colors ${
              activeTab === 'profiles'
                ? 'text-[#C9A962] border-b-2 border-[#C9A962]'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Profiles
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-4 px-4 whitespace-nowrap transition-colors ${
              activeTab === 'events'
                ? 'text-[#C9A962] border-b-2 border-[#C9A962]'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`pb-4 px-4 whitespace-nowrap transition-colors ${
              activeTab === 'connections'
                ? 'text-[#C9A962] border-b-2 border-[#C9A962]'
                : 'text-[#A3A3A3] hover:text-white'
            }`}
          >
            Connections
          </button>
        </div>

        {activeTab === 'members' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-[#A3A3A3] pb-4 px-4">Email</th>
                  <th className="text-left text-[#A3A3A3] pb-4 px-4">Role</th>
                  <th className="text-left text-[#A3A3A3] pb-4 px-4">Has Profile</th>
                  <th className="text-left text-[#A3A3A3] pb-4 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5">
                    <td className="py-4 px-4 text-white">{u.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        u.role === 'admin' ? 'bg-purple-900/30 text-purple-400' :
                        u.role === 'manager' ? 'bg-blue-900/30 text-blue-400' :
                        'bg-gray-900/30 text-gray-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#A3A3A3]">
                      {u.profileId ? 'Yes' : 'No'}
                    </td>
                    <td className="py-4 px-4">
                      {u.role === 'member' && (
                        <button
                          onClick={() => handleDeactivateUser(u.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'profiles' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <div key={profile.id} className="bg-[#1F1F1F] rounded-lg overflow-hidden border border-white/5">
                <div className="flex gap-4 p-4">
                  <img
                    src={profile.photos[0]}
                    alt={profile.name}
                    className="w-20 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-medium">{profile.name}</h3>
                        <p className="text-[#A3A3A3] text-sm">{profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : '--'} • {profile.gender}</p>
                      </div>
                      {profile.isVerified ? (
                        <span className="text-[#C9A962] text-xs">Verified</span>
                      ) : (
                        <button
                          onClick={() => handleVerifyProfile(profile.id)}
                          className="text-xs text-[#C9A962] hover:underline"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                    <p className="text-[#A3A3A3] text-sm mt-2">{profile.lookingFor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-[#1F1F1F] rounded-lg p-6 border border-white/5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.type === 'charity' ? 'bg-emerald-900/30 text-emerald-400' :
                        event.type === 'dating' ? 'bg-pink-900/30 text-pink-400' :
                        'bg-blue-900/30 text-blue-400'
                      }`}>
                        {event.type}
                      </span>
                      <h3 className="text-white font-medium">{event.title}</h3>
                    </div>
                    <p className="text-[#A3A3A3] text-sm">{event.location}</p>
                    <p className="text-[#A3A3A3] text-sm">
                      {new Date(event.date).toLocaleDateString()} • {event.attendees.length}/{event.capacity} attendees
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-[#A3A3A3] pb-4 px-4">From</th>
                  <th className="text-left text-[#A3A3A3] pb-4 px-4">To</th>
                  <th className="text-left text-[#A3A3A3] pb-4 px-4">Status</th>
                  <th className="text-left text-[#A3A3A3] pb-4 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {connections.map((conn) => {
                  const fromUser = getUserById(conn.fromUserId);
                  const toUser = getUserById(conn.toUserId);
                  const fromProfile = getProfileById(conn.fromUserId);
                  const toProfile = getProfileById(conn.toUserId);
                  
                  return (
                    <tr key={conn.id} className="border-b border-white/5">
                      <td className="py-4 px-4 text-white">
                        {fromProfile?.name || fromUser?.email || 'Unknown'}
                      </td>
                      <td className="py-4 px-4 text-white">
                        {toProfile?.name || toUser?.email || 'Unknown'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          conn.status === 'accepted' ? 'bg-green-900/30 text-green-400' :
                          conn.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-red-900/30 text-red-400'
                        }`}>
                          {conn.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[#A3A3A3]">
                        {new Date(conn.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}