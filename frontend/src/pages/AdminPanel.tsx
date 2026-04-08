import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Pencil, Image as ImageIcon, Users, BookOpen, Loader2, X, Upload } from 'lucide-react';
import clsx from 'clsx';
import api from '../lib/api';
import { useAuth } from '@clerk/clerk-react';

type Tab = 'journey' | 'yearbook' | 'vault';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('journey');

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-serif font-bold mb-2 text-glow">Admin Panel</h1>
        <p className="text-gray-400">Manage the Batch-26 digital archive</p>
      </motion.div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-4 mb-12 border-b border-white/5 pb-6">
        <TabButton
          active={activeTab === 'journey'}
          onClick={() => setActiveTab('journey')}
          icon={<ImageIcon size={18} />}
          label="Journey"
        />
        <TabButton
          active={activeTab === 'yearbook'}
          onClick={() => setActiveTab('yearbook')}
          icon={<BookOpen size={18} />}
          label="Yearbook"
        />
        <TabButton
          active={activeTab === 'vault'}
          onClick={() => setActiveTab('vault')}
          icon={<Users size={18} />}
          label="Vault"
        />
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass p-8 rounded-3xl"
      >
        {activeTab === 'journey' && <JourneyManager />}
        {activeTab === 'yearbook' && <YearbookManager />}
        {activeTab === 'vault' && <VaultManager />}
      </motion.div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-6 py-2 rounded-full border transition-all duration-300",
        active
          ? "bg-primary text-black border-primary font-bold shadow-lg"
          : "bg-surface text-gray-400 border-white/5 hover:border-primary/50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function JourneyManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ semester: 1, caption: '' });
  const [file, setFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const { getToken } = useAuth();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/journey');
      setItems(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ semester: item.semester, caption: item.caption });
    setFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ semester: 1, caption: '' });
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !editingItem) { alert('Please select an image'); return; }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      const data = new FormData();
      data.append('semester', formData.semester.toString());
      data.append('caption', formData.caption);
      if (file) data.append('image', file);

      if (editingItem) {
        await api.put(`/journey/${editingItem._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/journey', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      resetForm();
      fetchItems();
    } catch (error: any) { alert(error.response?.data?.message || `Failed to ${editingItem ? 'update' : 'add'} entry`); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = await getToken();
      await api.delete(`/journey/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchItems();
    } catch (error) { alert('Delete failed'); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-white">Manage Journey</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/20 rounded-xl hover:bg-primary/30 transition-all font-bold"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="md:col-span-2 flex justify-between items-center mb-2">
                <h3 className="text-primary font-bold uppercase tracking-widest text-xs">
                  {editingItem ? 'Edit Journey Entry' : 'New Journey Entry'}
                </h3>
                <button type="button" onClick={resetForm}><X size={18} className="text-gray-500 hover:text-white" /></button>
              </div>

              <div className="md:col-span-2 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl py-8 hover:border-primary/50 transition-colors bg-black/20 cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="text-primary mb-2" size={32} />
                    <p className="text-white text-sm font-medium">{file.name}</p>
                    <p className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : editingItem ? (
                  <div className="flex flex-col items-center">
                    <img src={editingItem.imageUrl} className="w-20 h-20 object-cover rounded-lg mb-2 opacity-50" />
                    <p className="text-gray-400 text-sm">Click to replace current image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="text-gray-600 mb-2" size={32} />
                    <p className="text-gray-400 text-sm">Drop image here or click to browse</p>
                  </div>
                )}
              </div>

              <input type="text" placeholder="Caption (e.g. Orientation Day)" required className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-primary/50 outline-none" value={formData.caption} onChange={e => setFormData({ ...formData, caption: e.target.value })} />

              <select className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-primary/50 outline-none" value={formData.semester} onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value) })}>
                {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={s} className="bg-background">Semester {s}</option>)}
              </select>

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-black font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : editingItem ? 'Update Memory' : 'Save Memory'}
                </button>
                {editingItem && (
                  <button type="button" onClick={resetForm} className="px-6 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {loading ? <Loader2 className="animate-spin text-primary mx-auto" /> : items.map(item => (
          <div key={item._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden">
                <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-white">Semester {item.semester}</p>
                <p className="text-xs text-gray-500">{item.caption}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Pencil size={18} /></button>
              <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && <p className="text-center text-gray-600 italic">No journey entries yet.</p>}
      </div>
    </div>
  );
}

function YearbookManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '', hobbies: '', instagram: '', linkedin: '', department: 'CSE' });
  const [file, setFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const { getToken } = useAuth();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/yearbook');
      setItems(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      bio: item.bio,
      hobbies: Array.isArray(item.hobbies) ? item.hobbies.join(', ') : item.hobbies,
      instagram: item.instagram || '',
      linkedin: item.linkedin || '',
      department: item.department || 'CSE'
    });
    setFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ name: '', bio: '', hobbies: '', instagram: '', linkedin: '', department: 'CSE' });
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !editingItem) { alert('Please select a profile image'); return; }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      const data = new FormData();
      data.append('name', formData.name);
      data.append('bio', formData.bio);
      data.append('hobbies', formData.hobbies);
      data.append('instagram', formData.instagram);
      data.append('linkedin', formData.linkedin);
      data.append('department', formData.department);
      if (file) data.append('image', file);

      if (editingItem) {
        await api.put(`/yearbook/${editingItem._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/yearbook', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      resetForm();
      fetchItems();
    } catch (error: any) { alert(error.response?.data?.message || `Failed to ${editingItem ? 'update' : 'add'} entry`); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = await getToken();
      await api.delete(`/yearbook/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchItems();
    } catch (error) { alert('Delete failed'); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-white">Student Directory</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/20 rounded-xl hover:bg-primary/30 transition-all font-bold">
          <Plus size={18} /> New Entry
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="md:col-span-2 flex justify-between items-center mb-2">
                <h3 className="text-primary font-bold uppercase tracking-widest text-xs">
                  {editingItem ? 'Edit Student Profile' : 'New Student Profile'}
                </h3>
                <button type="button" onClick={resetForm}><X size={18} className="text-gray-500 hover:text-white" /></button>
              </div>

              <div className="md:col-span-2 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl py-6 hover:border-primary/50 transition-colors bg-black/20 cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <p className="text-white text-sm font-medium">{file.name}</p>
                  </div>
                ) : editingItem ? (
                  <div className="flex flex-col items-center">
                    <img src={editingItem.imageUrl} className="w-16 h-16 rounded-full object-cover mb-2 opacity-50" />
                    <p className="text-gray-400 text-sm">Click to replace profile picture</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="text-gray-600 mb-2" size={24} />
                    <p className="text-gray-400 text-sm">Upload Profile Picture</p>
                  </div>
                )}
              </div>

              <input type="text" placeholder="Full Name" required className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-primary/50 outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input type="text" placeholder="Department (e.g. CSE)" required className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-primary/50 outline-none" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
              <input type="text" placeholder="Instagram ID (without @)" className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-primary/50 outline-none" value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} />
              <input type="text" placeholder="LinkedIn Profile URL" className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-primary/50 outline-none" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
              <input type="text" placeholder="Hobbies (comma separated)" className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm md:col-span-2 focus:border-primary/50 outline-none" value={formData.hobbies} onChange={e => setFormData({ ...formData, hobbies: e.target.value })} />
              <textarea placeholder="Student Bio" required className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm md:col-span-2 h-20 focus:border-primary/50 outline-none" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />

              <div className="md:col-span-2 flex gap-3">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-black font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center justify-center gap-2 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : editingItem ? 'Update Profile' : 'Save Profile'}
                </button>
                {editingItem && (
                  <button type="button" onClick={resetForm} className="px-6 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {loading ? <Loader2 className="animate-spin text-primary mx-auto" /> : items.map(item => (
          <div key={item._id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full overflow-hidden">
                <img src={item.imageUrl} alt="profile" className="w-full h-full object-cover" />
              </div>
              <p className="font-bold text-white">{item.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-primary transition-colors"><Pencil size={18} /></button>
              <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && <p className="text-center text-gray-600 italic">Directory is empty.</p>}
      </div>
    </div>
  );
}

function VaultManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const { getToken } = useAuth();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/media');
      setItems(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setCaption(item.caption);
    setFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setCaption('');
    setFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !editingItem) { alert('Please select an image'); return; }

    try {
      setIsSubmitting(true);
      const token = await getToken();
      const data = new FormData();
      data.append('caption', caption);
      if (file) data.append('image', file);

      if (editingItem) {
        await api.put(`/media/${editingItem._id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/media', data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      resetForm();
      fetchItems();
    } catch (error: any) { alert(error.response?.data?.message || `Failed to ${editingItem ? 'update' : 'add'} to vault`); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = await getToken();
      await api.delete(`/media/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchItems();
    } catch (error) { alert('Delete failed'); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-white">Moderate Vault</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/20 rounded-xl hover:bg-primary/30 transition-all font-bold"
        >
          <Plus size={18} /> Add Entry
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 p-6 bg-white/5 rounded-2xl border border-white/5 max-w-lg mx-auto">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-primary font-bold uppercase tracking-widest text-xs">
                  {editingItem ? 'Edit Media Entry' : 'Add to Media Vault'}
                </h3>
                <button type="button" onClick={resetForm}><X size={18} className="text-gray-500 hover:text-white" /></button>
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl py-10 hover:border-primary/50 transition-colors bg-black/20 cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <p className="text-white text-sm font-medium">{file.name}</p>
                  </div>
                ) : editingItem ? (
                  <div className="flex flex-col items-center">
                    <img src={editingItem.imageUrl} className="w-24 h-24 object-cover rounded-lg mb-2 opacity-50" />
                    <p className="text-gray-400 text-sm">Click to replace vault image</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="text-gray-600 mb-2" size={32} />
                    <p className="text-gray-400 text-sm">Upload to Vault</p>
                  </div>
                )}
              </div>

              <input type="text" placeholder="Photo Title / Caption" required className="bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-sm" value={caption} onChange={e => setCaption(e.target.value)} />

              <div className="flex gap-3">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-black font-bold py-3 rounded-xl hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : editingItem ? 'Update Vault Entry' : 'Post to Vault'}
                </button>
                {editingItem && (
                  <button type="button" onClick={resetForm} className="px-6 bg-white/5 text-white font-bold rounded-xl hover:bg-white/10 transition-all border border-white/10">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading ? <Loader2 className="animate-spin text-primary mx-auto col-span-full" /> : items.map(item => (
          <div key={item._id} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={item.imageUrl} alt="media" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => handleEdit(item)} className="p-3 bg-primary text-black rounded-full hover:bg-primary/90 transition-colors">
                <Pencil size={20} />
              </button>
              <button onClick={() => handleDelete(item._id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && <p className="col-span-full text-center text-gray-600 italic">No media shared yet.</p>}
      </div>
    </div>
  );
}
