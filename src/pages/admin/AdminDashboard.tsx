import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ServiceItem, 
  PackageItem, 
  TeamMember, 
  CertificationItem, 
  TestimonialItem, 
  PartnerItem,
  BranchItem,
  ContactSubmission,
  QuotationRequest,
  AdminUser
} from '../../types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  ShieldCheck, 
  RefreshCw, 
  Globe, 
  Briefcase, 
  Package, 
  Users, 
  Award, 
  MessageSquare, 
  Building2, 
  Check, 
  X, 
  AlertTriangle,
  ExternalLink,
  Search,
  UserCog,
  MapPin,
  Mail,
  FileText,
  Activity,
  PieChart as PieChartIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

type TabKey = 'services' | 'packages' | 'team' | 'certifications' | 'testimonials' | 'partners' | 'users' | 'branches' | 'contacts' | 'quotations';

export default function AdminDashboard() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>('services');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Data states
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form states for each type
  const [currentService, setCurrentService] = useState<Partial<ServiceItem>>({});
  const [currentPackage, setCurrentPackage] = useState<Partial<PackageItem>>({});
  const [currentTeam, setCurrentTeam] = useState<Partial<TeamMember>>({});
  const [currentCert, setCurrentCert] = useState<Partial<CertificationItem>>({});
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<TestimonialItem>>({});
  const [currentPartner, setCurrentPartner] = useState<Partial<PartnerItem>>({});
  const [currentUserData, setCurrentUserData] = useState<Partial<AdminUser> & { password?: string }>({});
  const [currentBranch, setCurrentBranch] = useState<Partial<BranchItem>>({});
  const [currentContact, setCurrentContact] = useState<Partial<ContactSubmission>>({});
  const [currentQuotation, setCurrentQuotation] = useState<Partial<QuotationRequest>>({});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
    // Set default active tab based on role
    if (user?.role === 'sales' && !['contacts', 'quotations', 'branches'].includes(activeTab)) {
      setActiveTab('quotations');
    }
  }, [isLoading, isAuthenticated, navigate, user, activeTab]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch all CMS data
  const fetchAllData = async () => {
    setDataLoading(true);
    try {
      const promises: Promise<any>[] = [
        fetch('/api/services').then(r => r.json()),
        fetch('/api/packages').then(r => r.json()),
        fetch('/api/team').then(r => r.json()),
        fetch('/api/certifications').then(r => r.json()),
        fetch('/api/testimonials').then(r => r.json()),
        fetch('/api/partners').then(r => r.json()),
        fetch('/api/branches').then(r => r.json()),
      ];
      if (user?.role === 'superadmin') {
        promises.push(fetch('/api/admin/users').then(r => r.json()));
      } else {
        promises.push(Promise.resolve([]));
      }
      
      promises.push(fetch('/api/admin/contacts').then(r => r.json()));
      promises.push(fetch('/api/admin/quotations').then(r => r.json()));

      const results = await Promise.all(promises);

      if (Array.isArray(results[0])) setServices(results[0]);
      if (Array.isArray(results[1])) setPackages(results[1]);
      if (Array.isArray(results[2])) setTeam(results[2]);
      if (Array.isArray(results[3])) setCertifications(results[3]);
      if (Array.isArray(results[4])) setTestimonials(results[4]);
      if (Array.isArray(results[5])) setPartners(results[5]);
      if (Array.isArray(results[6])) setBranches(results[6]);
      if (user?.role === 'superadmin' && Array.isArray(results[7])) setUsers(results[7]);
      if (Array.isArray(results[8])) setContacts(results[8]);
      if (Array.isArray(results[9])) setQuotations(results[9]);
    } catch (e) {
      showNotification('Failed to load content from server', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // Reset database to factory defaults
  const handleResetData = async () => {
    if (!window.confirm('Reset all website data to factory default samples?')) return;
    try {
      const res = await fetch('/api/admin/reset-data', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showNotification('Database successfully reset to initial defaults');
        fetchAllData();
      } else {
        showNotification(data.error || 'Failed to reset', 'error');
      }
    } catch (e) {
      showNotification('Connection error while resetting data', 'error');
    }
  };

  // ----------------------------------------------------
  // CRUD Actions
  // ----------------------------------------------------

  const openCreateModal = () => {
    setModalMode('create');
    if (activeTab === 'services') {
      setCurrentService({
        title: '',
        slug: '',
        icon: 'Ship',
        description: '',
        content: '',
        image: 'https://images.unsplash.com/photo-1544377192-339241c6d868?auto=format&fit=crop&q=80&w=1200'
      });
    } else if (activeTab === 'packages') {
      setCurrentPackage({
        service_slug: services[0]?.slug || 'yacht-catering',
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800'
      });
    } else if (activeTab === 'team') {
      setCurrentTeam({
        name: '',
        role: '',
        level: 2,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
        bio: ''
      });
    } else if (activeTab === 'certifications') {
      setCurrentCert({
        code: 'ISO 9001',
        title: '',
        body: '',
        icon: 'ShieldCheck',
        category: 'Quality Standard'
      });
    } else if (activeTab === 'testimonials') {
      setCurrentTestimonial({
        name: '',
        role: 'Master Mariner',
        company: '',
        quote: '',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        rating: 5,
        vessel_type: 'Cargo Vessel'
      });
    } else if (activeTab === 'partners') {
      setCurrentPartner({
        name: '',
        logo: '🚢'
      });
    } else if (activeTab === 'users') {
      setCurrentUserData({
        username: '',
        password: '',
        name: '',
        role: 'marketing',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
      });
    } else if (activeTab === 'branches') {
      setCurrentBranch({
        name: '',
        location: '',
        contact_number: '',
        email: ''
      });
    }
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setModalMode('edit');
    if (activeTab === 'services') setCurrentService({ ...item });
    if (activeTab === 'packages') setCurrentPackage({ ...item });
    if (activeTab === 'team') setCurrentTeam({ ...item });
    if (activeTab === 'certifications') setCurrentCert({ ...item });
    if (activeTab === 'testimonials') setCurrentTestimonial({ ...item });
    if (activeTab === 'partners') setCurrentPartner({ ...item });
    if (activeTab === 'users') setCurrentUserData({ ...item, password: '' });
    if (activeTab === 'branches') setCurrentBranch({ ...item });
    if (activeTab === 'contacts') setCurrentContact({ ...item });
    if (activeTab === 'quotations') setCurrentQuotation({ ...item });
    setModalOpen(true);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showNotification('Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let endpoint = `/api/admin/${activeTab}`;
      let method = modalMode === 'create' ? 'POST' : 'PUT';
      let payload: any = {};

      if (activeTab === 'services') {
        payload = currentService;
        if (modalMode === 'edit') endpoint += `/${currentService.id}`;
      } else if (activeTab === 'packages') {
        payload = currentPackage;
        if (modalMode === 'edit') endpoint += `/${currentPackage.id}`;
      } else if (activeTab === 'team') {
        payload = currentTeam;
        if (modalMode === 'edit') endpoint += `/${currentTeam.id}`;
      } else if (activeTab === 'certifications') {
        payload = currentCert;
        if (modalMode === 'edit') endpoint += `/${currentCert.id}`;
      } else if (activeTab === 'testimonials') {
        payload = currentTestimonial;
        if (modalMode === 'edit') endpoint += `/${currentTestimonial.id}`;
      } else if (activeTab === 'partners') {
        payload = currentPartner;
        if (modalMode === 'edit') endpoint += `/${currentPartner.id}`;
      } else if (activeTab === 'users') {
        payload = currentUserData;
        if (modalMode === 'edit') endpoint += `/${currentUserData.id}`;
      } else if (activeTab === 'branches') {
        payload = currentBranch;
        if (modalMode === 'edit') endpoint += `/${currentBranch.id}`;
      } else if (activeTab === 'contacts') {
        payload = { status: currentContact.status };
        if (modalMode === 'edit') endpoint += `/${currentContact.id}`;
      } else if (activeTab === 'quotations') {
        payload = { status: currentQuotation.status };
        if (modalMode === 'edit') endpoint += `/${currentQuotation.id}`;
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok || (result.error && !result.success)) {
        showNotification(result.error ? `Failed to save: ${result.error}. Please check the fields and try again.` : 'Unable to save changes. Make sure all required fields are filled correctly, then try again.', 'error');
        return;
      }

      showNotification(`${activeTab.slice(0, -1)} ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
      setModalOpen(false);
      fetchAllData();
    } catch (err: any) {
      showNotification('Network error while saving. Please check your connection and try again.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/${activeTab}/${id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (!res.ok || (result.error && !result.success)) {
        showNotification(result.error || 'Failed to delete item', 'error');
        return;
      }
      showNotification(`Item removed successfully`);
      setDeleteConfirmId(null);
      fetchAllData();
    } catch (err) {
      showNotification('Network error while deleting item', 'error');
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#07A5C9]">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Verifying administrator privileges...</span>
        </div>
      </div>
    );
  }

  const contactStatusData = [
    { name: 'Pending', count: contacts.filter(c => !c.status || c.status === 'Pending').length },
    { name: 'In Progress', count: contacts.filter(c => c.status === 'In Progress').length },
    { name: 'Completed', count: contacts.filter(c => c.status === 'Completed').length }
  ];
  
  const quotationStatusData = [
    { name: 'Pending', count: quotations.filter(q => !q.status || q.status === 'Pending').length },
    { name: 'In Progress', count: quotations.filter(q => q.status === 'In Progress').length },
    { name: 'Completed', count: quotations.filter(q => q.status === 'Completed').length }
  ];

  const STATUS_COLORS = ['#F59E0B', '#3B82F6', '#10B981']; // amber, blue, emerald
  const TYPE_COLORS = ['#07A5C9', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const vesselTypeCounts = quotations.reduce((acc, q) => {
    const type = q.vessel_type || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const quotationTypeData = Object.keys(vesselTypeCounts).map(key => ({
    name: key,
    count: vesselTypeCounts[key]
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-[#00081E] text-white pb-20">
      {/* Top Header Bar */}
      <div className="border-b border-white/10 bg-[#00081E]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xl font-bold flex items-center gap-2 text-white hover:text-[#07A5C9] transition-colors">
              <img src="/emr-logo-1.png" alt="East Man Resource" className="h-6 w-auto" />
              <span>East Man Resource</span>
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-sm font-semibold bg-[#07A5C9]/10 text-[#07A5C9] px-3 py-1 rounded-full border border-[#07A5C9]/20">
              Admin CMS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#07A5C9]/40" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#07A5C9] flex items-center justify-center font-bold text-xs">
                  {user.name[0]}
                </div>
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  {user.name}
                  {user.role === 'superadmin' ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">SuperAdmin</span>
                  ) : (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/30">Marketing</span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 font-mono">@{user.username}</div>
              </div>
            </div>

            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#07A5C9]" /> Live Website
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-2.5 rounded-xl border border-rose-500/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-5 pt-8">
        {/* Floating Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-20 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${
                notification.type === 'success' 
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-900/20' 
                  : 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-900/20'
              } backdrop-blur-md`}
            >
              {notification.type === 'success' ? <Check className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
              <span className="text-sm font-medium">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex flex-wrap gap-2">
            {[
              ...(user.role !== 'sales' ? [
                { key: 'services', label: 'Services', icon: Briefcase, count: services.length },
                { key: 'packages', label: 'Menu Packages', icon: Package, count: packages.length },
                { key: 'team', label: 'Executive Team', icon: Users, count: team.length },
                { key: 'certifications', label: 'Certifications', icon: Award, count: certifications.length },
                { key: 'testimonials', label: 'Testimonials', icon: MessageSquare, count: testimonials.length },
                { key: 'partners', label: 'Partners', icon: Building2, count: partners.length },
                { key: 'branches', label: 'Branches', icon: MapPin, count: branches.length }
              ] : []),
              { key: 'contacts', label: 'Contact Forms', icon: Mail, count: contacts.length },
              { key: 'quotations', label: 'Quotations', icon: FileText, count: quotations.length },
              ...(user.role === 'superadmin' ? [{ key: 'users', label: 'Admins', icon: UserCog, count: users.length }] : [])
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key as TabKey);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-[#07A5C9] text-white shadow-[0_0_20px_rgba(7,165,201,0.3)] font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-black/20 text-white' : 'bg-white/10 text-gray-400'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'superadmin' && (
              <button
                onClick={handleResetData}
                title="Reset all tables back to sample factory defaults"
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#FFB800]" /> Reset Demo Data
              </button>
            )}
            {activeTab !== 'contacts' && activeTab !== 'quotations' && activeTab !== 'users' && !(activeTab === 'branches' && user?.role === 'sales') && (
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-[#07A5C9] hover:bg-[#066F8B] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(7,165,201,0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New {activeTab === 'services' ? 'Service' : activeTab === 'packages' ? 'Package' : activeTab === 'team' ? 'Member' : activeTab === 'certifications' ? 'Cert' : activeTab === 'testimonials' ? 'Review' : activeTab === 'branches' ? 'Branch' : 'Partner'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="my-6 relative max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#07A5C9] text-sm"
          />
        </div>

        {/* Content Tab Displays */}
        {dataLoading ? (
          <div className="p-16 text-center text-gray-400 flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-[#07A5C9]" />
            <span>Fetching updated content...</span>
          </div>
        ) : (
          <div>
            {/* 1. SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((service) => (
                    <div 
                      key={service.id || service.slug}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#07A5C9]/40 transition-all group relative overflow-hidden"
                    >
                      {service.image && (
                        <div className="h-40 rounded-xl overflow-hidden mb-4 bg-black/40 relative">
                          <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-3 left-3 bg-[#00081E]/80 backdrop-blur-sm text-[#07A5C9] text-xs font-mono px-2.5 py-1 rounded-full border border-white/10">
                            /{service.slug}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#07A5C9] transition-colors">{service.title}</h3>
                        <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed mb-6">{service.description}</p>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <Link 
                          to={`/services/${service.slug}`} 
                          target="_blank"
                          className="text-xs text-[#07A5C9] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> View Page
                        </Link>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(service)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] border border-white/10 transition-colors"
                            title="Edit Service"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(service.id!)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 2. PACKAGES TAB */}
            {activeTab === 'packages' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((pkg) => (
                    <div 
                      key={pkg.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#07A5C9]/40 transition-all group"
                    >
                      {pkg.image && (
                        <div className="h-36 rounded-xl overflow-hidden mb-4 bg-black/40">
                          <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] bg-[#07A5C9]/10 text-[#07A5C9] px-2.5 py-0.5 rounded-full border border-[#07A5C9]/20 font-mono">
                            {pkg.service_slug}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#07A5C9] transition-colors">{pkg.name}</h3>
                        <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed mb-4">{pkg.description}</p>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(pkg)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] border border-white/10 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(pkg.id!)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 3. TEAM TAB */}
            {activeTab === 'team' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team
                  .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((member) => (
                    <div 
                      key={member.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#07A5C9]/40 transition-all group"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <img src={member.image} alt={member.name} className="w-16 h-16 rounded-xl object-cover border border-[#07A5C9]/30 shrink-0" />
                        <div>
                          <span className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full border border-white/10">
                            Level {member.level} (Org Hierarchy)
                          </span>
                          <h4 className="text-base font-bold text-white mt-1 group-hover:text-[#07A5C9] transition-colors">{member.name}</h4>
                          <p className="text-xs text-[#07A5C9] font-medium">{member.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3 italic">"{member.bio}"</p>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] border border-white/10 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(member.id!)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 4. CERTIFICATIONS TAB */}
            {activeTab === 'certifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications
                  .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((cert) => (
                    <div 
                      key={cert.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#07A5C9]/40 transition-all group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-[#07A5C9] bg-[#07A5C9]/10 px-2.5 py-1 rounded-full border border-[#07A5C9]/20">
                            {cert.code}
                          </span>
                          <span className="text-[11px] text-gray-400">{cert.category}</span>
                        </div>
                        <h4 className="text-base font-bold text-white mb-2 group-hover:text-[#07A5C9] transition-colors">{cert.title}</h4>
                        <p className="text-gray-400 text-xs leading-relaxed mb-4">{cert.body}</p>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cert)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] border border-white/10 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(cert.id!)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 5. TESTIMONIALS TAB */}
            {activeTab === 'testimonials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials
                  .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.quote.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((t) => (
                    <div 
                      key={t.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#07A5C9]/40 transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-amber-400 text-sm">{'★'.repeat(t.rating)}</span>
                          <span className="text-[11px] text-[#07A5C9] bg-[#07A5C9]/10 px-2 py-0.5 rounded-full border border-[#07A5C9]/20">
                            {t.vessel_type}
                          </span>
                        </div>
                        <p className="text-gray-300 text-xs italic leading-relaxed mb-6">"{t.quote}"</p>
                      </div>
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={t.image} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-[#07A5C9]/30" />
                          <div>
                            <div className="text-xs font-bold text-white">{t.name}</div>
                            <div className="text-[11px] text-gray-400">{t.role} • {t.company}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(t)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] border border-white/10 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(t.id!)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 6. PARTNERS TAB */}
            {activeTab === 'partners' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {partners
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => (
                    <div 
                      key={p.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:border-[#07A5C9]/40 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{p.logo}</span>
                        <span className="text-sm font-bold text-white group-hover:text-[#07A5C9] transition-colors">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id!)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 7. USERS TAB */}
            {activeTab === 'users' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users
                  .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((u) => (
                    <div 
                      key={u.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#07A5C9]/40 transition-all group"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-full object-cover border border-[#07A5C9]/30 shrink-0" />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-[#07A5C9] flex items-center justify-center font-bold text-xl text-white shrink-0">
                            {u.name[0]}
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-bold text-white mb-1 group-hover:text-[#07A5C9] transition-colors">{u.name}</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded border ${
                              u.role === 'superadmin' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            }`}>
                              {u.role === 'superadmin' ? 'SuperAdmin' : 'Marketing'}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs font-mono">@{u.username}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                        {u.username === 'superadmin' ? (
                          <span className="text-[10px] text-gray-500 italic px-2">System Protected</span>
                        ) : (
                          <>
                            <button
                              onClick={() => openEditModal(u)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] border border-white/10 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            {u.username !== user.username && (
                              <button
                                onClick={() => setDeleteConfirmId(u.id!)}
                                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {/* 8. BRANCHES TAB */}
            {activeTab === 'branches' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches
                  .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.location.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((b) => (
                    <div 
                      key={b.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#07A5C9]/40 transition-all group"
                    >
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-[#07A5C9]/10 text-[#07A5C9] flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-bold text-white group-hover:text-[#07A5C9] transition-colors">{b.name}</h4>
                        </div>
                        <p className="text-gray-400 text-sm mt-2">{b.location}</p>
                        <p className="text-gray-400 text-sm mt-1">{b.contact_number}</p>
                        <p className="text-gray-400 text-sm mt-1">{b.email}</p>
                      </div>
                      
                      {user?.role !== 'sales' && (
                        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(b)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] border border-white/10 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(b.id!)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* 9. CONTACTS TAB */}
            {activeTab === 'contacts' && (
              <div className="flex flex-col gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-2">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-[#07A5C9]"/> Follow-up Status Overview</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={contactStatusData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip 
                          cursor={{fill: '#ffffff05'}}
                          contentStyle={{ backgroundColor: '#00081E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                          {contactStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                {contacts
                  .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((c) => (
                    <div 
                      key={c.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#07A5C9]/40 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-base font-bold text-white">{c.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            c.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            c.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {c.status || 'Pending'}
                          </span>
                        </div>
                        <p className="text-[#07A5C9] text-sm mb-2">{c.email}</p>
                        <p className="text-gray-300 text-sm italic mb-1 font-semibold">Subject: {c.subject}</p>
                        <p className="text-gray-400 text-sm whitespace-pre-line">{c.message}</p>
                        <p className="text-gray-500 text-xs mt-3">{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</p>
                      </div>
                      
                      {user?.role !== 'marketing' && (
                        <div className="flex items-center gap-2 border-t border-white/10 pt-4 md:border-t-0 md:pt-0 shrink-0">
                          <button
                            onClick={() => openEditModal(c)}
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] border border-white/10 transition-colors text-xs font-semibold"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(c.id!)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            )}

            {/* 10. QUOTATIONS TAB */}
            {activeTab === 'quotations' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-[#07A5C9]"/> Quotation Status Overview</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={quotationStatusData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                          <Tooltip 
                            cursor={{fill: '#ffffff05'}}
                            contentStyle={{ backgroundColor: '#00081E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                          />
                          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                            {quotationStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-[#07A5C9]"/> Quotation Types (Vessel)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={quotationTypeData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="count"
                            stroke="none"
                          >
                            {quotationTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#00081E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} 
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                {quotations
                  .filter(q => q.name.toLowerCase().includes(searchQuery.toLowerCase()) || q.company.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((q) => (
                    <div 
                      key={q.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#07A5C9]/40 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-base font-bold text-white">{q.name}</h4>
                          <span className="text-sm font-medium text-gray-400">({q.company})</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            q.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            q.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                            'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {q.status || 'Pending'}
                          </span>
                        </div>
                        <p className="text-[#07A5C9] text-sm mb-3">{q.email}</p>
                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500 font-semibold block text-xs">Vessel Type</span>
                            <span className="text-gray-300">{q.vessel_type || '-'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-semibold block text-xs">Service Required</span>
                            <span className="text-gray-300">{q.service_required || '-'}</span>
                          </div>
                        </div>
                        {q.details && (
                          <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                            <p className="text-gray-400 text-sm whitespace-pre-line">{q.details}</p>
                          </div>
                        )}
                        <p className="text-gray-500 text-xs mt-3">{q.created_at ? new Date(q.created_at).toLocaleString() : ''}</p>
                      </div>
                      
                      {user?.role !== 'marketing' && (
                        <div className="flex items-center gap-2 border-t border-white/10 pt-4 md:border-t-0 md:pt-0 shrink-0">
                          <button
                            onClick={() => openEditModal(q)}
                            className="px-3 py-2 rounded-lg bg-white/5 hover:bg-[#07A5C9]/20 text-gray-300 hover:text-[#07A5C9] border border-white/10 transition-colors text-xs font-semibold"
                          >
                            Update Status
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(q.id!)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId !== null && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#00081E] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete this item?</h3>
              <p className="text-gray-400 text-xs mb-6">This action will immediately remove this content from the database and live website.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-900/30"
                >
                  Yes, Delete Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Form Modal for Create & Edit */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#00081E] border border-white/15 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl my-8 relative"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-xs uppercase font-bold text-[#07A5C9] tracking-wider">
                  {modalMode === 'create' ? 'Create New' : 'Edit Existing'}
                </span>
                <h2 className="text-2xl font-bold text-white capitalize mt-1">
                  {activeTab.slice(0, -1)} Details
                </h2>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Form fields for SERVICES */}
                {activeTab === 'services' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Service Title *</label>
                        <input
                          type="text"
                          required
                          value={currentService.title || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCurrentService({
                              ...currentService,
                              title: val,
                              slug: modalMode === 'create' && !currentService.slug ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : currentService.slug
                            });
                          }}
                          placeholder="e.g. Helicopter Deck Catering"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">URL Slug *</label>
                        <input
                          type="text"
                          required
                          value={currentService.slug || ''}
                          onChange={(e) => setCurrentService({ ...currentService, slug: e.target.value })}
                          placeholder="e.g. helicopter-deck-catering"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9] font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Icon Name</label>
                        <input
                          type="text"
                          value={currentService.icon || ''}
                          onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                          placeholder="e.g. Ship, Anchor, Utensils, Users"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Cover Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentService.image || ''}
                            onChange={(e) => setCurrentService({ ...currentService, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                          />
                          <label className="flex items-center justify-center bg-[#07A5C9]/10 hover:bg-[#07A5C9]/20 text-[#07A5C9] px-4 py-2.5 rounded-xl border border-[#07A5C9]/30 cursor-pointer transition-colors text-sm font-semibold whitespace-nowrap">
                            Upload (Max 2MB)
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (val) => setCurrentService({ ...currentService, image: val }))} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Short Card Summary *</label>
                      <textarea
                        rows={2}
                        required
                        value={currentService.description || ''}
                        onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                        placeholder="Brief 1-2 sentence overview for the main services grid"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Page Content Description</label>
                      <textarea
                        rows={4}
                        value={currentService.content || ''}
                        onChange={(e) => setCurrentService({ ...currentService, content: e.target.value })}
                        placeholder="Detailed long-form service description displayed on the standalone service detail page"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                      />
                    </div>
                  </>
                )}

                {/* Form fields for PACKAGES */}
                {activeTab === 'packages' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Parent Service *</label>
                        <select
                          value={currentPackage.service_slug || ''}
                          onChange={(e) => setCurrentPackage({ ...currentPackage, service_slug: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        >
                          {services.map((s) => (
                            <option key={s.slug} value={s.slug} className="bg-[#00081E] text-white">
                              {s.title} ({s.slug})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Package/Menu Name *</label>
                        <input
                          type="text"
                          required
                          value={currentPackage.name || ''}
                          onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
                          placeholder="e.g. Captain's Gourmet Table"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentPackage.image || ''}
                          onChange={(e) => setCurrentPackage({ ...currentPackage, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                        <label className="flex items-center justify-center bg-[#07A5C9]/10 hover:bg-[#07A5C9]/20 text-[#07A5C9] px-4 py-2.5 rounded-xl border border-[#07A5C9]/30 cursor-pointer transition-colors text-sm font-semibold whitespace-nowrap">
                          Upload (Max 2MB)
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (val) => setCurrentPackage({ ...currentPackage, image: val }))} />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Package Details *</label>
                      <textarea
                        rows={3}
                        required
                        value={currentPackage.description || ''}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, description: e.target.value })}
                        placeholder="Describe courses, nutritional balance, or catering scope"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                      />
                    </div>
                  </>
                )}

                {/* Form fields for TEAM */}
                {activeTab === 'team' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={currentTeam.name || ''}
                          onChange={(e) => setCurrentTeam({ ...currentTeam, name: e.target.value })}
                          placeholder="e.g. Capt. Liam Sterling"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Executive Role / Title *</label>
                        <input
                          type="text"
                          required
                          value={currentTeam.role || ''}
                          onChange={(e) => setCurrentTeam({ ...currentTeam, role: e.target.value })}
                          placeholder="e.g. Chief Executive Officer"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Org Level (1 = Top, 2 = Exec, 3 = VP/Head)</label>
                        <select
                          value={currentTeam.level || 2}
                          onChange={(e) => setCurrentTeam({ ...currentTeam, level: parseInt(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        >
                          <option value={1} className="bg-[#00081E]">Level 1 - Executive Head (CEO)</option>
                          <option value={2} className="bg-[#00081E]">Level 2 - C-Suite Officers (COO, CFO, CTO)</option>
                          <option value={3} className="bg-[#00081E]">Level 3 - VPs & Department Heads</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Photo URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentTeam.image || ''}
                            onChange={(e) => setCurrentTeam({ ...currentTeam, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                          />
                          <label className="flex items-center justify-center bg-[#07A5C9]/10 hover:bg-[#07A5C9]/20 text-[#07A5C9] px-4 py-2.5 rounded-xl border border-[#07A5C9]/30 cursor-pointer transition-colors text-sm font-semibold whitespace-nowrap">
                            Upload (Max 2MB)
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (val) => setCurrentTeam({ ...currentTeam, image: val }))} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Biography *</label>
                      <textarea
                        rows={3}
                        required
                        value={currentTeam.bio || ''}
                        onChange={(e) => setCurrentTeam({ ...currentTeam, bio: e.target.value })}
                        placeholder="Professional background, maritime tenure, and responsibilities"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                      />
                    </div>
                  </>
                )}

                {/* Form fields for CERTIFICATIONS */}
                {activeTab === 'certifications' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Certification Code *</label>
                        <input
                          type="text"
                          required
                          value={currentCert.code || ''}
                          onChange={(e) => setCurrentCert({ ...currentCert, code: e.target.value })}
                          placeholder="e.g. MLC 2006, ISO 22000"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Category *</label>
                        <input
                          type="text"
                          required
                          value={currentCert.category || ''}
                          onChange={(e) => setCurrentCert({ ...currentCert, category: e.target.value })}
                          placeholder="e.g. Maritime Law, Food Safety"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Standard Title *</label>
                      <input
                        type="text"
                        required
                        value={currentCert.title || ''}
                        onChange={(e) => setCurrentCert({ ...currentCert, title: e.target.value })}
                        placeholder="e.g. Food Safety Management System"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={currentCert.body || ''}
                        onChange={(e) => setCurrentCert({ ...currentCert, body: e.target.value })}
                        placeholder="Compliance description and audit scope"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                      />
                    </div>
                  </>
                )}

                {/* Form fields for TESTIMONIALS */}
                {activeTab === 'testimonials' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Client Name *</label>
                        <input
                          type="text"
                          required
                          value={currentTestimonial.name || ''}
                          onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                          placeholder="e.g. Capt. Henrik Visser"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Role / Position</label>
                        <input
                          type="text"
                          value={currentTestimonial.role || ''}
                          onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                          placeholder="e.g. Master Mariner"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Company *</label>
                        <input
                          type="text"
                          required
                          value={currentTestimonial.company || ''}
                          onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, company: e.target.value })}
                          placeholder="e.g. Nordic Bulk Carrier Line"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Vessel Type Badge</label>
                        <input
                          type="text"
                          value={currentTestimonial.vessel_type || ''}
                          onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, vessel_type: e.target.value })}
                          placeholder="e.g. Superyacht, Offshore Rig, Cargo"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Star Rating (1 - 5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={currentTestimonial.rating || 5}
                          onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, rating: parseInt(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Avatar Image URL</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentTestimonial.image || ''}
                            onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                          />
                          <label className="flex items-center justify-center bg-[#07A5C9]/10 hover:bg-[#07A5C9]/20 text-[#07A5C9] px-4 py-2.5 rounded-xl border border-[#07A5C9]/30 cursor-pointer transition-colors text-sm font-semibold whitespace-nowrap">
                            Upload (Max 2MB)
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (val) => setCurrentTestimonial({ ...currentTestimonial, image: val }))} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Client Review Quote *</label>
                      <textarea
                        rows={3}
                        required
                        value={currentTestimonial.quote || ''}
                        onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, quote: e.target.value })}
                        placeholder="Quote from the maritime operator..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                      />
                    </div>
                  </>
                )}

                {/* Form fields for PARTNERS */}
                {activeTab === 'partners' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Company Name *</label>
                        <input
                          type="text"
                          required
                          value={currentPartner.name || ''}
                          onChange={(e) => setCurrentPartner({ ...currentPartner, name: e.target.value })}
                          placeholder="e.g. Oceanic Lines"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Icon / Emoji Logo *</label>
                        <input
                          type="text"
                          required
                          value={currentPartner.logo || ''}
                          onChange={(e) => setCurrentPartner({ ...currentPartner, logo: e.target.value })}
                          placeholder="e.g. 🌊, 🚢, ⚓, 🛥️"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Form fields for USERS */}
                {activeTab === 'users' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={currentUserData.name || ''}
                          onChange={(e) => setCurrentUserData({ ...currentUserData, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">System Role *</label>
                        <select
                          value={currentUserData.role || 'marketing'}
                          onChange={(e) => setCurrentUserData({ ...currentUserData, role: e.target.value as 'superadmin' | 'marketing' | 'sales' })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        >
                          <option value="marketing" className="bg-[#00081E]">Marketing Editor (Content Only)</option>
                          <option value="sales" className="bg-[#00081E]">Sales Editor (Leads Only)</option>
                          <option value="superadmin" className="bg-[#00081E]">SuperAdmin (Full Access)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Username (Login ID) *</label>
                        <input
                          type="text"
                          required
                          value={currentUserData.username || ''}
                          onChange={(e) => setCurrentUserData({ ...currentUserData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                          placeholder="e.g. johndoe"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                          {modalMode === 'create' ? 'Password *' : 'New Password (Leave blank to keep)'}
                        </label>
                        <input
                          type="password"
                          required={modalMode === 'create'}
                          value={currentUserData.password || ''}
                          onChange={(e) => setCurrentUserData({ ...currentUserData, password: e.target.value })}
                          placeholder={modalMode === 'create' ? "Secure password" : "Leave blank to keep current"}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Avatar Image URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentUserData.avatar || ''}
                          onChange={(e) => setCurrentUserData({ ...currentUserData, avatar: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                        <label className="flex items-center justify-center bg-[#07A5C9]/10 hover:bg-[#07A5C9]/20 text-[#07A5C9] px-4 py-2.5 rounded-xl border border-[#07A5C9]/30 cursor-pointer transition-colors text-sm font-semibold whitespace-nowrap">
                          Upload (Max 2MB)
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, (val) => setCurrentUserData({ ...currentUserData, avatar: val }))} />
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* Form fields for BRANCHES */}
                {activeTab === 'branches' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Branch Name *</label>
                        <input
                          type="text"
                          required
                          value={currentBranch.name || ''}
                          onChange={(e) => setCurrentBranch({ ...currentBranch, name: e.target.value })}
                          placeholder="e.g. Kuala Lumpur Headquarters"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1.5">Contact Number</label>
                        <input
                          type="text"
                          value={currentBranch.contact_number || ''}
                          onChange={(e) => setCurrentBranch({ ...currentBranch, contact_number: e.target.value })}
                          placeholder="e.g. +60 3 1234 5678"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={currentBranch.email || ''}
                        onChange={(e) => setCurrentBranch({ ...currentBranch, email: e.target.value })}
                        placeholder="e.g. kl.hq@eastmanresource.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Location/Address *</label>
                      <textarea
                        required
                        value={currentBranch.location || ''}
                        onChange={(e) => setCurrentBranch({ ...currentBranch, location: e.target.value })}
                        placeholder="e.g. KL Sentral, 50470 Kuala Lumpur..."
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9] resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Form fields for CONTACTS (Status Update Only) */}
                {activeTab === 'contacts' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Update Status</label>
                    <select
                      value={currentContact.status || 'Pending'}
                      onChange={(e) => setCurrentContact({ ...currentContact, status: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                    >
                      <option value="Pending" className="bg-[#00081E]">Pending</option>
                      <option value="In Progress" className="bg-[#00081E]">In Progress</option>
                      <option value="Completed" className="bg-[#00081E]">Completed</option>
                    </select>
                  </div>
                )}

                {/* Form fields for QUOTATIONS (Status Update Only) */}
                {activeTab === 'quotations' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">Update Status</label>
                    <select
                      value={currentQuotation.status || 'Pending'}
                      onChange={(e) => setCurrentQuotation({ ...currentQuotation, status: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#07A5C9]"
                    >
                      <option value="Pending" className="bg-[#00081E]">Pending</option>
                      <option value="In Progress" className="bg-[#00081E]">In Progress</option>
                      <option value="Completed" className="bg-[#00081E]">Completed</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#07A5C9] hover:bg-[#066F8B] text-white text-sm font-bold shadow-[0_0_20px_rgba(7,165,201,0.3)] transition-all"
                  >
                    {modalMode === 'create' ? 'Create Record' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
