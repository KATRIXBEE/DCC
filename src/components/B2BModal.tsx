'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { GlitchButton } from './GlitchButton';

interface B2BModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  restaurantName: string;
  contactPerson: string;
  phone: string;
  email: string;
  volume: string;
  location: string;
  notes?: string;
  _hp_company?: string; // honeypot
}

export const B2BModal: React.FC<B2BModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  if (!isOpen) return null;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to submit booking request.');
      }

      setIsSuccess(true);
      reset();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please reach us on WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="b2b-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl bg-white border-4 border-black p-6 md:p-8 shadow-[10px_10px_0px_0px_#FFDE00] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 bg-black text-white p-2 border-2 border-black hover:bg-[#FF3333] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b-4 border-black pb-4 mb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-[#8A9A5B] font-bold uppercase mb-1">
            <span>● PROTOCOL B2B-01</span>
            <span>//</span>
            <span>PUNE COMMERCIAL KITCHENS</span>
          </div>
          <h2 id="b2b-modal-title" className="font-heading text-2xl md:text-4xl uppercase tracking-tighter text-black">
            FREE 10-MINUTE KITCHEN SWAP
          </h2>
          <p className="font-mono text-xs md:text-sm text-neutral-700 mt-1">
            We visit your commercial kitchen, audit your detergent spend, run a live 10-dish blind test, and leave a 5L bio-enzymatic sample. Zero obligation.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 font-mono">
            <CheckCircle2 className="w-16 h-16 text-[#8A9A5B] mx-auto mb-4" />
            <h3 className="font-heading text-2xl uppercase tracking-tight mb-2">
              SWAP REQUEST CONFIRMED
            </h3>
            <p className="text-sm text-neutral-700 mb-6 max-w-md mx-auto">
              Our Pune engineering team has logged your dispatch ticket. We will call you within 2 business hours to schedule the 10-minute on-site swap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918421488557?text=Hey%20DCC%20Team,%20I%20just%20submitted%20a%20B2B%20Kitchen%20Swap%20request."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#FFDE00] text-black border-4 border-black px-6 py-3 font-bold uppercase hover:bg-black hover:text-[#FFDE00] transition-colors"
              >
                <span>PING US ON WHATSAPP</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="bg-black text-white border-4 border-black px-6 py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors"
              >
                CLOSE WINDOW
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-mono text-xs md:text-sm">
            {/* Honeypot field (hidden from real users) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="_hp_company">Company Website</label>
              <input
                id="_hp_company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('_hp_company')}
              />
            </div>

            {errorMessage && (
              <div className="bg-[#FF3333] text-white p-3 border-2 border-black font-bold">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1 uppercase">
                  Restaurant / Kitchen Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cafe Deccan / Blue Tokai FC Road"
                  className="w-full border-2 border-black p-3 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFDE00]"
                  {...register('restaurantName', { required: 'Restaurant name is required' })}
                />
                {errors.restaurantName && (
                  <p className="text-[#FF3333] text-xs mt-1 font-bold">
                    {errors.restaurantName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1 uppercase">
                  Contact Person *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kartik / Kitchen Manager"
                  className="w-full border-2 border-black p-3 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFDE00]"
                  {...register('contactPerson', { required: 'Contact name is required' })}
                />
                {errors.contactPerson && (
                  <p className="text-[#FF3333] text-xs mt-1 font-bold">
                    {errors.contactPerson.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1 uppercase">
                  Phone (WhatsApp Active) *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full border-2 border-black p-3 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFDE00]"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+ ]{10,15}$/,
                      message: 'Enter a valid 10-digit phone number',
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-[#FF3333] text-xs mt-1 font-bold">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1 uppercase">
                  Official Email *
                </label>
                <input
                  type="email"
                  placeholder="manager@restaurant.com"
                  className="w-full border-2 border-black p-3 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFDE00]"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-[#FF3333] text-xs mt-1 font-bold">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1 uppercase">
                  Kitchen Location / Area *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Koregaon Park / Baner / FC Road"
                  className="w-full border-2 border-black p-3 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFDE00]"
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && (
                  <p className="text-[#FF3333] text-xs mt-1 font-bold">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1 uppercase">
                  Average Dishes Washed / Day *
                </label>
                <select
                  className="w-full border-2 border-black p-3 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFDE00]"
                  {...register('volume', { required: 'Please select estimated volume' })}
                >
                  <option value="">Select daily volume...</option>
                  <option value="100 - 300 dishes/day (Small Cafe)">
                    100 - 300 dishes/day (Small Cafe)
                  </option>
                  <option value="300 - 800 dishes/day (Casual Dining)">
                    300 - 800 dishes/day (Casual Dining)
                  </option>
                  <option value="800 - 2000 dishes/day (High-Volume Bar/Kitchen)">
                    800 - 2000 dishes/day (High-Volume Bar/Kitchen)
                  </option>
                  <option value="2000+ dishes/day (Banquet / Cloud Kitchen)">
                    2000+ dishes/day (Banquet / Cloud Kitchen)
                  </option>
                </select>
                {errors.volume && (
                  <p className="text-[#FF3333] text-xs mt-1 font-bold">
                    {errors.volume.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1 uppercase">
                Notes / Special Kitchen Constraints (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Dishwasher machine brand, hard water issues, or current chemical pain points..."
                className="w-full border-2 border-black p-3 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFDE00]"
                {...register('notes')}
              />
            </div>

            <div className="pt-2">
              <GlitchButton
                type="submit"
                variant="yellow"
                size="md"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? 'DISPATCHING TO LAB...' : 'SCHEDULE FREE 10-MIN KITCHEN SWAP →'}
              </GlitchButton>
            </div>

            <p className="text-[10px] text-neutral-500 text-center uppercase tracking-wider">
              Dispatches directly to katrixbee@gmail.com // Strictly No Spam // Free 5L Demo Sample included
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
