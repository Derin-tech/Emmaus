"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Image as ImageIcon, UploadCloud, 
  X, Check, Video, MapPin, MessageSquare, Phone, Eye, DollarSign 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Textbooks", "Electronics", "Gaming", "Accessories", "Tickets"];
const TICKET_TYPES = ["Movie Ticket", "Bus Ticket", "Train Ticket"];
const CONDITIONS = ["Brand New", "Like New", "Excellent", "Good", "Fair"];

export default function SellWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [media, setMedia] = useState<{url: string, type: 'image'|'video'}[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    brand: "",
    condition: "",
    description: "",
    originalPrice: "",
    sellingPrice: "",
    
    // Dynamic fields (Electronics)
    warranty: "",
    batteryHealth: "",
    accessoriesIncluded: "",
    
    // Dynamic fields (Books)
    edition: "",
    author: "",
    semester: "",
    
    // Ticket specific fields
    ticketType: "",
    travelDate: "",
    travelTime: "",
    numTickets: "1",
    fromLocation: "",
    toLocation: "",
    seatNumber: "",
    coachClass: "",
    
    // Location
    college: "",
    hostel: "",
    meetingPoint: "",
    
    // Contact
    contactMethod: "In-app Chat",
    phone: "",
    hideContact: false,
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Dummy upload handler
    if (e.target.files && e.target.files[0]) {
      const type = e.target.files[0].type.startsWith("video/") ? "video" : "image";
      setMedia(prev => [...prev, { url: URL.createObjectURL(e.target.files![0]), type }]);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 1500);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-10 w-full max-w-xl mx-auto">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
            step === i 
              ? "bg-gray-900 text-white ring-4 ring-gray-100" 
              : step > i 
                ? "bg-emerald-500 text-white" 
                : "bg-gray-100 text-gray-400"
          }`}>
            {step > i ? <Check size={14} strokeWidth={3} /> : i}
          </div>
          {i < 6 && (
            <div className={`w-10 h-0.5 mx-2 transition-colors duration-300 ${step > i ? "bg-emerald-500" : "bg-gray-100"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">List an Item</h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">Reach thousands of students instantly</p>
        </div>

        {renderStepIndicator()}

        <motion.div 
          layout
          className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                
                {/* STEP 1: MEDIA */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Media</h2>
                      <p className="text-gray-500 text-sm">Add up to 10 images and 3 videos. The first image will be your cover.</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:bg-gray-50 transition-colors relative">
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        onChange={handleMediaUpload} 
                      />
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UploadCloud size={32} />
                      </div>
                      <p className="text-gray-900 font-semibold mb-1">Click to upload or drag & drop</p>
                      <p className="text-gray-400 text-xs">JPEG, PNG, MP4 up to 50MB</p>
                    </div>

                    {media.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        {media.map((m, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                            {m.type === 'image' ? (
                              <img src={m.url} alt="upload" className="w-full h-full object-cover" />
                            ) : (
                              <video src={m.url} className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button onClick={() => removeMedia(idx)} className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors">
                                <X size={16} />
                              </button>
                            </div>
                            {idx === 0 && (
                              <div className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                Cover
                              </div>
                            )}
                            {m.type === 'video' && (
                              <div className="absolute bottom-2 left-2 bg-black/60 text-white p-1 rounded-md">
                                <Video size={14} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: INFO */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Information</h2>
                      <p className="text-gray-500 text-sm">Tell buyers what you're selling.</p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                        <select 
                          value={formData.category} 
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none appearance-none"
                        >
                          <option value="">Select...</option>
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {formData.category === "Tickets" ? (
                        <>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ticket Type</label>
                            <select 
                              value={formData.ticketType} 
                              onChange={e => setFormData({...formData, ticketType: e.target.value})}
                              className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none appearance-none"
                            >
                              <option value="">Select...</option>
                              {TICKET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          
                          {formData.ticketType && (
                            <>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Journey / Movie Name</label>
                                <input 
                                  type="text" 
                                  value={formData.title} 
                                  onChange={e => setFormData({...formData, title: e.target.value})}
                                  className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                                  placeholder="e.g. Inception / Vande Bharat Express" 
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-5">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
                                  <input 
                                    type="date" 
                                    value={formData.travelDate} 
                                    onChange={e => setFormData({...formData, travelDate: e.target.value})}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time</label>
                                  <input 
                                    type="time" 
                                    value={formData.travelTime} 
                                    onChange={e => setFormData({...formData, travelTime: e.target.value})}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                                  />
                                </div>
                              </div>

                              {(formData.ticketType === "Bus Ticket" || formData.ticketType === "Train Ticket") && (
                                <div className="grid grid-cols-2 gap-5">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">From</label>
                                    <input 
                                      type="text" 
                                      value={formData.fromLocation} 
                                      onChange={e => setFormData({...formData, fromLocation: e.target.value})}
                                      className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">To</label>
                                    <input 
                                      type="text" 
                                      value={formData.toLocation} 
                                      onChange={e => setFormData({...formData, toLocation: e.target.value})}
                                      className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Seat Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <input 
                                      type="text" 
                                      value={formData.seatNumber} 
                                      onChange={e => setFormData({...formData, seatNumber: e.target.value})}
                                      className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                                    />
                                  </div>
                                  {formData.ticketType === "Train Ticket" && (
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Coach/Class <span className="text-gray-400 font-normal">(Optional)</span></label>
                                      <input 
                                        type="text" 
                                        value={formData.coachClass} 
                                        onChange={e => setFormData({...formData, coachClass: e.target.value})}
                                        className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Number of Tickets</label>
                                <input 
                                  type="number" 
                                  min="1"
                                  value={formData.numTickets} 
                                  onChange={e => setFormData({...formData, numTickets: e.target.value})}
                                  className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-5">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Selling Price (₹)</label>
                                  <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                    <input 
                                      type="number" 
                                      value={formData.sellingPrice} 
                                      onChange={e => setFormData({...formData, sellingPrice: e.target.value})}
                                      className="w-full rounded-xl border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none" 
                                      placeholder="0.00" 
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Original Price <span className="text-gray-400 font-normal">(Optional)</span></label>
                                  <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                    <input 
                                      type="number" 
                                      value={formData.originalPrice} 
                                      onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                                      className="w-full rounded-xl border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none" 
                                      placeholder="0.00" 
                                    />
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Notes</label>
                                <textarea 
                                  rows={3} 
                                  value={formData.description} 
                                  onChange={e => setFormData({...formData, description: e.target.value})}
                                  className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none" 
                                  placeholder="" 
                                />
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Title</label>
                            <input 
                              type="text" 
                              value={formData.title} 
                              onChange={e => setFormData({...formData, title: e.target.value})}
                              className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none" 
                              placeholder="e.g. iPhone 13 Pro Max (256GB)" 
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition</label>
                            <select 
                              value={formData.condition} 
                              onChange={e => setFormData({...formData, condition: e.target.value})}
                              className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none appearance-none"
                            >
                              <option value="">Select...</option>
                              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <textarea 
                              rows={4} 
                              value={formData.description} 
                              onChange={e => setFormData({...formData, description: e.target.value})}
                              className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none" 
                              placeholder="" 
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Selling Price (₹)</label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                <input 
                                  type="number" 
                                  value={formData.sellingPrice} 
                                  onChange={e => setFormData({...formData, sellingPrice: e.target.value})}
                                  className="w-full rounded-xl border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none" 
                                  placeholder="0.00" 
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Original Price <span className="text-gray-400 font-normal">(Optional)</span></label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                <input 
                                  type="number" 
                                  value={formData.originalPrice} 
                                  onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                                  className="w-full rounded-xl border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all outline-none" 
                                  placeholder="0.00" 
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: DETAILS */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Specific Details</h2>
                      <p className="text-gray-500 text-sm">Fill in category-specific information to help buyers.</p>
                    </div>

                    <div className="space-y-5">
                      {formData.category === "Electronics" ? (
                        <>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Warranty Status</label>
                            <input type="text" className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" placeholder="e.g. 6 months remaining" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Battery Health (%)</label>
                            <input type="number" className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" placeholder="e.g. 95" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Accessories Included</label>
                            <input type="text" className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" placeholder="e.g. Original charger, box" />
                          </div>
                        </>
                      ) : formData.category === "Textbooks" ? (
                        <>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author</label>
                            <input type="text" className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" placeholder="e.g. Kreyzig" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Edition / Year</label>
                            <input type="text" className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" placeholder="e.g. 10th Edition (2022)" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Semester / Subject</label>
                            <input type="text" className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" placeholder="e.g. Sem 3 - Engineering Math" />
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
                          <p>No specific details required for this category.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 4: LOCATION */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Location</h2>
                      <p className="text-gray-500 text-sm">Where can buyers pick this up?</p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Campus / College</label>
                        <div className="relative">
                          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            value={formData.college} 
                            onChange={e => setFormData({...formData, college: e.target.value})}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 pl-11 pr-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                            placeholder="College of Engineering Trivandrum (CET)" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hostel / Block</label>
                          <input 
                            type="text" 
                            value={formData.hostel} 
                            onChange={e => setFormData({...formData, hostel: e.target.value})}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                            placeholder="Emmaus Hostel" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meeting Point (Optional)</label>
                          <input 
                            type="text" 
                            value={formData.meetingPoint} 
                            onChange={e => setFormData({...formData, meetingPoint: e.target.value})}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" 
                            placeholder="e.g. CET Main Gate" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: CONTACT */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Preferences</h2>
                      <p className="text-gray-500 text-sm">How should buyers reach out to you?</p>
                    </div>

                    <div className="space-y-4">
                      <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${formData.contactMethod === 'In-app Chat' ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input type="radio" name="contact" value="In-app Chat" checked={formData.contactMethod === 'In-app Chat'} onChange={e => setFormData({...formData, contactMethod: e.target.value})} className="hidden" />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.contactMethod === 'In-app Chat' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <MessageSquare size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">In-app Chat</h4>
                          <p className="text-sm text-gray-500">Safest option. Keep your details private.</p>
                        </div>
                        {formData.contactMethod === 'In-app Chat' && <Check size={20} className="ml-auto text-gray-900" />}
                      </label>

                      <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${formData.contactMethod === 'WhatsApp' ? 'border-green-500 bg-green-50/30' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input type="radio" name="contact" value="WhatsApp" checked={formData.contactMethod === 'WhatsApp'} onChange={e => setFormData({...formData, contactMethod: e.target.value})} className="hidden" />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.contactMethod === 'WhatsApp' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <Phone size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">WhatsApp / Phone</h4>
                          <p className="text-sm text-gray-500">Faster communication directly to your number.</p>
                        </div>
                        {formData.contactMethod === 'WhatsApp' && <Check size={20} className="ml-auto text-green-500" />}
                      </label>
                    </div>

                    {formData.contactMethod === 'WhatsApp' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                        <input type="text" className="w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none" placeholder="+91" />
                      </motion.div>
                    )}

                  </div>
                )}

                {/* STEP 6: REVIEW */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Publish</h2>
                      <p className="text-gray-500 text-sm">Here's how your listing will appear to others.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 max-w-sm mx-auto overflow-hidden">
                      <div className="aspect-[4/3] rounded-xl bg-gray-100 mb-4 overflow-hidden relative">
                        {media.length > 0 ? (
                           <img src={media[0].url} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                            <ImageIcon size={32} className="mb-2" />
                            <span className="text-xs font-semibold">No Image</span>
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[9px] font-bold uppercase tracking-wider text-gray-800">
                          {formData.category || "Category"}
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{formData.title || "Product Title"}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{formData.description || "Product description will appear here..."}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-lg font-bold text-gray-900">₹{formData.sellingPrice || "0"}</span>
                        {formData.originalPrice && <span className="text-xs text-gray-400 line-through mb-0.5">₹{formData.originalPrice}</span>}
                      </div>
                    </div>

                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={prevStep} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}
            
            {step < 6 ? (
              <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold shadow-sm hover:bg-gray-800 transition-all hover:shadow-md">
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-blue-700 transition-all hover:shadow-lg disabled:opacity-70">
                {isSubmitting ? "Publishing..." : "Publish Listing"}
              </button>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
