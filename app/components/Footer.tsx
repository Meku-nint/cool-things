"use client";
import { useState } from "react";

type SocialLink = {
  name: string;
  icon: string;
  url: string;
  color: string;
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      name: "Telegram",
      icon: "fa-brands fa-telegram",
      url: "https://t.me/royalsmart",
      color: "hover:text-blue-400"
    },
    {
      name: "Phone",
      icon: "fa-solid fa-phone",
      url: "tel:+1234567890",
      color: "hover:text-green-400"
    },
    {
      name: "Email",
      icon: "fa-solid fa-envelope",
      url: "mailto:support@royalsmart.com",
      color: "hover:text-red-400"
    },
    {
      name: "TikTok",
      icon: "fa-brands fa-tiktok",
      url: "https://tiktok.com/@royalsmart",
      color: "hover:text-pink-400"
    },
    {
      name: "LinkedIn",
      icon: "fa-brands fa-linkedin-in",
      url: "https://linkedin.com/company/royalsmart",
      color: "hover:text-blue-500"
    },
    {
      name: "Instagram",
      icon: "fa-brands fa-instagram",
      url: "https://instagram.com/royalsmart",
      color: "hover:text-purple-400"
    }
  ]);

  const [tempLinks, setTempLinks] = useState(socialLinks);

  const handleSave = () => {
    setSocialLinks(tempLinks);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempLinks(socialLinks);
    setIsEditing(false);
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...tempLinks];
    updated[index] = { ...updated[index], [field]: value };
    setTempLinks(updated);
  };

  return (
    <footer className="w-full bg-linear-to-br from-slate-900 to-slate-800 border-t border-slate-700/50 text-slate-200">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-white to-slate-200 flex items-center justify-center">
              <span className="font-bold text-slate-900 text-sm">RSC</span>
            </div>
            <h3 className="text-2xl font-light bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Royal Smart Computer
            </h3>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Connect with us through your preferred platform
          </p>
        </div>

        {/* Social Links Grid */}
        <div className="mb-8">
          {isEditing ? (
            // Edit Mode
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tempLinks.map((link, index) => (
                  <div key={index} className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/50">
                        <i className={`${link.icon} text-slate-300`} />
                      </div>
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateLink(index, 'name', e.target.value)}
                        className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-slate-500"
                        placeholder="Platform name"
                      />
                    </div>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-slate-500"
                      placeholder="https://..."
                    />
                    <input
                      type="text"
                      value={link.color}
                      onChange={(e) => updateLink(index, 'color', e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-slate-500 mt-2"
                      placeholder="hover:text-color-400"
                    />
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700/50 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Confirm Changes
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group bg-slate-800/30 rounded-2xl p-4 text-center border border-slate-700/50 transition-all duration-300 hover:bg-slate-700/50 hover:scale-105 hover:shadow-lg ${link.color}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700/50 group-hover:bg-slate-600/50 transition-all duration-300">
                      <i className={`${link.icon} text-xl text-slate-300 group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-300">
                      {link.name}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Edit Button */}
        <div className="text-center">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all duration-300 border border-slate-600"
          >
            <i className={`fa-solid ${isEditing ? 'fa-eye' : 'fa-pen'} text-xs`} />
            {isEditing ? 'Preview' : 'Edit Social Links'}
          </button>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-700/50 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <i className="fa-regular fa-copyright text-xs" />
              <span>{year} Royal Smart Computer. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <span>for the community</span>
            </div>
          </div>
        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </footer>
  );
}