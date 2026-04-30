"use client";

import { useState, useEffect } from "react";
import Section from "@/components/ui/Section";
import Input from "@/components/ui/Input";
import Calendar from "@/components/ui/Calendar";
import { format } from "date-fns";

export default function BookingPage() {
  const [agreed, setAgreed] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<any>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [addonsPricing, setAddonsPricing] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const addOnsList = [
    "Inside Oven",
    "Inside Fridge",
    "Interior Cabinets",
    "Baseboards",
    "Window Cleaning (Interior)",
    "Laundry Service",
    "Deep Bathroom Scrub",
    "Pet Hair Removal",
  ];

  useEffect(() => {
    fetch("/api/availability")
      .then((res) => res.json())
      .then((data) => setAvailability(data.availability || data));
  }, []);

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        setServices(data.data.services || []);
        setAddonsPricing(data.data.addons || []);
      });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const day = availability?.[selectedDate];
    setAvailableSlots(Array.isArray(day?.slots) ? day.slots : []);
  }, [selectedDate, availability]);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function calculateTotal() {
    if (!selectedService || selectedService.customQuote) {
      return { total: null, deposit: null };
    }

    let total = selectedService.price || 0;

    selectedAddOns.forEach((addonName) => {
      const addon = addonsPricing.find((a) => a.name === addonName);
      if (addon) total += addon.price;
    });

    return { total, deposit: Math.round(total * 0.5) };
  }

  function handleFiles(files: File[]) {
    const MAX_FILES = 10;
    const MAX_SIZE = 5 * 1024 * 1024;

    let validFiles: File[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image`);
        continue;
      }

      if (file.size > MAX_SIZE) {
        alert(`${file.name} is too large (max 5MB)`);
        continue;
      }

      validFiles.push(file);
    }

    setPhotos((prev) => {
      const combined = [...prev, ...validFiles];

      if (combined.length > MAX_FILES) {
        alert(`Maximum ${MAX_FILES} photos allowed`);
        return combined.slice(0, MAX_FILES);
      }

      return combined;
    });

    // initialize progress bars
    setUploadProgress((prev) => [
      ...prev,
      ...validFiles.map(() => 0),
    ]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedService) return alert("Select a service");
    if (!selectedDate) return alert("Select a date");
    if (!selectedSlot) return alert("Select a time");

    let uploadedPhotos: string[] = [];

    if (photos.length) {
      const fd = new FormData();
      photos.forEach((f) => fd.append("files", f));

      // simulate progress
      photos.forEach((_, i) => {
        let progress = 0;

        const interval = setInterval(() => {
          progress += Math.random() * 20;

          setUploadProgress((prev) => {
            const copy = [...prev];
            copy[i] = Math.min(progress, 95);
            return copy;
          });

          if (progress >= 95) clearInterval(interval);
        }, 200);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!data.ok) {
        console.warn("⚠️ Upload failed, continuing without photos");
        alert("Photos could not be uploaded, but your request will still be submitted.");

        // stop progress animation
        setUploadProgress((prev) => prev.map(() => 0));
      } else {
        // finish progress
        setUploadProgress((prev) => prev.map(() => 100));
        uploadedPhotos = data.files;
      }

      const { total, deposit } = calculateTotal();

      await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          selectedDate,
          selectedSlot,
          addOns: selectedAddOns,
          photos: uploadedPhotos,
          serviceType: selectedService.name,
          customQuote: selectedService.customQuote,
          totalEstimate: total,
          depositAmount: deposit,
        }),
      });

      alert("Request submitted!");
    }

    const { total, deposit } = calculateTotal();

    return (
      <main className="min-h-screen bg-[#fff7f8] px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-10">

          <h1 className="text-4xl font-serif text-center">
            Request Your Cleaning
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* SERVICE */}
            <Section title="1. Select Service">
              <select
                className="w-full border px-4 py-3 rounded-lg"
                onChange={(e) => {
                  const s = services.find((x) => x.name === e.target.value);
                  setSelectedService(s);
                }}
              >
                <option>Select a service</option>
                {services.map((s, i) => (
                  <option key={i}>{s.name}</option>
                ))}
              </select>
            </Section>

            {/* CLIENT */}
            <Section title="2. Your Information">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Full Name" value={form.name} onChange={(v) => updateField("name", v)} />
                <Input label="Phone" value={form.phone} onChange={(v) => updateField("phone", v)} />
                <Input label="Email" value={form.email} onChange={(v) => updateField("email", v)} />
                <Input label="Address" value={form.address} onChange={(v) => updateField("address", v)} />
              </div>
            </Section>

            {/* DATE + TIME */}
            <div className="grid md:grid-cols-2 gap-6">
              <Section title="3. Select Date">
                <Calendar
                  availability={availability}
                  onSelect={(d) => {
                    const key = format(d, "yyyy-MM-dd");
                    setSelectedDate(key);
                  }}
                />
              </Section>

              <Section title="4. Select Time">
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((slot, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 border rounded ${selectedSlot === slot ? "bg-pink-500 text-white" : ""
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </Section>
            </div>

            {/* ADDONS + NOTES */}
            <div className="grid md:grid-cols-2 gap-6">
              <Section title="5. Add-Ons">
                <div className="grid grid-cols-2 gap-2">
                  {addOnsList.map((a, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setSelectedAddOns((prev) =>
                          prev.includes(a)
                            ? prev.filter((x) => x !== a)
                            : [...prev, a]
                        )
                      }
                      className={`p-2 border rounded ${selectedAddOns.includes(a) ? "bg-pink-500 text-white" : ""
                        }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="6. Notes">
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="w-full border p-3 rounded"
                />
              </Section>
            </div>

            {/* PHOTOS */}
            <Section title="7. Upload Photos">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const files = Array.from(e.dataTransfer.files || []);
                  handleFiles(files);
                }}
                className="border-2 border-dashed border-[#d95f91] rounded-xl p-6 text-center cursor-pointer hover:bg-[#fff1f5] transition"
                onClick={() => document.getElementById("photoInput")?.click()}
              >
                <p className="text-sm text-[#4b2e35] font-medium">
                  Drag & drop photos here or click to upload
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Max 10 photos • JPG/PNG • Max 5MB each
                </p>

                <input
                  id="photoInput"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    handleFiles(files);
                  }}
                  className="hidden"
                />
              </div>

              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {photos.map((file, index) => {
                    const preview = URL.createObjectURL(file);

                    return (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border"
                      >
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-24 object-cover"
                        />

                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
                          <div
                            className="h-full bg-[#d95f91] transition-all"
                            style={{ width: `${uploadProgress[index] || 0}%` }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setPhotos((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Section>

            {/* SUMMARY */}
            {total && (
              <Section title="Summary">
                <p>Total: ${total}</p>
                <p className="text-pink-600 font-bold">
                  Deposit: ${deposit}
                </p>
              </Section>
            )}

            {/* AGREEMENT */}
            <div className="flex gap-3 items-center text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
              />

              <span>
                I agree to the{" "}
                <a
                  href="/policies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d95f91] underline font-medium"
                >
                  policies
                </a>
              </span>
            </div>

            <button
              disabled={!agreed}
              className="w-full py-4 bg-pink-500 text-white rounded-full"
            >
              Submit Request
            </button>

          </form>
        </div>
      </main>
    );
  }