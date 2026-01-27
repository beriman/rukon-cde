'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../../../lib/api-client';
import { Save, Building, Image as ImageIcon } from 'lucide-react';
import { useAuthStore } from '../../../../stores/useAuthStore'; // Ensure path is correct relative to file

export default function OrganizationSettingsPage() {
    const [org, setOrg] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [headerFile, setHeaderFile] = useState<File | null>(null);
    const [footerFile, setFooterFile] = useState<File | null>(null);
    const [previewHeader, setPreviewHeader] = useState<string | null>(null);
    const [previewFooter, setPreviewFooter] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrg = async () => {
            try {
                const res = await apiClient.get('/organizations');
                if (res.data && res.data.length > 0) {
                    const myOrg = res.data[0];
                    setOrg(myOrg);
                    // For existing images, we don't have a direct URL unless we sign it.
                    // Just showing status or checking if it works as URL (if public)
                    if (myOrg.letterheadHeader && myOrg.letterheadHeader.startsWith('http')) {
                        setPreviewHeader(myOrg.letterheadHeader);
                    }
                    if (myOrg.letterheadFooter && myOrg.letterheadFooter.startsWith('http')) {
                        setPreviewFooter(myOrg.letterheadFooter);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch org', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrg();
    }, []);

    const handleFileChange = (e: any, type: 'header' | 'footer') => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (type === 'header') {
                setHeaderFile(file);
                setPreviewHeader(url);
            } else {
                setFooterFile(file);
                setPreviewFooter(url);
            }
        }
    }

    const handleUpload = async (type: 'header' | 'footer') => {
        if (!org) return;
        const file = type === 'header' ? headerFile : footerFile;
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            await apiClient.post(`/organizations/${org.id}/letterhead?type=${type}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(`${type === 'header' ? 'Header' : 'Footer'} uploaded successfully!`);
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading organization settings...</div>;
    if (!org) return <div className="p-8 text-center text-slate-500">No Organization found.</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                <Building className="w-6 h-6 text-blue-600" /> Organization Branding
            </h1>

            <div className="glass-card bg-white/50 backdrop-blur-sm p-6 rounded-2xl mb-6 shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold mb-2 text-slate-800">Official Letterhead</h2>
                <p className="text-sm text-slate-500 mb-6">
                    Configure the header and footer images for official PDF correspondence.
                    Images will be automatically used when generating "Surat Resmi".
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Header Section */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-white">
                        <h3 className="font-medium mb-3 text-slate-700 flex items-center gap-2">
                            Header Image <span className="text-xs text-slate-400 font-normal">(Top of page)</span>
                        </h3>
                        <div className={`mb-4 bg-slate-50 h-32 rounded-lg flex items-center justify-center overflow-hidden relative border-2 border-dashed ${previewHeader ? 'border-blue-200' : 'border-slate-200'}`}>
                            {previewHeader ? (
                                <img src={previewHeader} alt="Header Preview" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <ImageIcon className="w-8 h-8 text-slate-300 mb-1" />
                                    <span className="text-slate-400 text-xs">No header set</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'header')}
                                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-xs file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                "
                            />
                            <button
                                onClick={() => handleUpload('header')}
                                disabled={!headerFile}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${headerFile ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <Save className="w-4 h-4" /> Save Header
                            </button>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-white">
                        <h3 className="font-medium mb-3 text-slate-700 flex items-center gap-2">
                            Footer Image <span className="text-xs text-slate-400 font-normal">(Bottom of page)</span>
                        </h3>
                        <div className={`mb-4 bg-slate-50 h-32 rounded-lg flex items-center justify-center overflow-hidden relative border-2 border-dashed ${previewFooter ? 'border-blue-200' : 'border-slate-200'}`}>
                            {previewFooter ? (
                                <img src={previewFooter} alt="Footer Preview" className="max-w-full max-h-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <ImageIcon className="w-8 h-8 text-slate-300 mb-1" />
                                    <span className="text-slate-400 text-xs">No footer set</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'footer')}
                                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-xs file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                "
                            />
                            <button
                                onClick={() => handleUpload('footer')}
                                disabled={!footerFile}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${footerFile ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <Save className="w-4 h-4" /> Save Footer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
