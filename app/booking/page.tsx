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

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        const data = await res.json();

        if (!data.ok) {
          console.warn("⚠️ Upload failed, continuing without photos");
          alert("Photos could not be uploaded, but your request will still be submitted.");
        } else {
          uploadedPhotos = data.files;
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
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

          <Section title="2. Your Information">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Full Name" value={form.name} onChange={(v) => updateField("name", v)} />
              <Input label="Phone" value={form.phone} onChange={(v) => updateField("phone", v)} />
              <Input label="Email" value={form.email} onChange={(v) => updateField("email", v)} />
              <Input label="Address" value={form.address} onChange={(v) => updateField("address", v)} />
            </div>
          </Section>

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
                    className={`p-2 border rounded ${selectedSlot === slot ? "bg-pink-500 text-white" : ""}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </Section>
          </div>

          {/* ✅ ADD-ONS SECTION RESTORED */}
          <Section title="5. Add-On Services">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {addOnsList.map((addon, i) => {
                const selected = selectedAddOns.includes(addon);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSelectedAddOns((prev) =>
                        selected
                          ? prev.filter((a) => a !== addon)
                          : [...prev, addon]
                      );
                    }}
                    className={`p-3 border rounded text-sm transition
                      ${selected
                        ? "bg-[#d95f91] text-white border-[#d95f91]"
                        : "bg-white hover:bg-gray-100"
                      }`}
                  >
                    {addon}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="7. Upload Photos">
            <div className="border-2 border-dashed border-[#d95f91] rounded-xl p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(Array.from(e.target.files || []))}
              />
            </div>

            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.map((file, index) => {
                  const preview = URL.createObjectURL(file);

                  return (
                    <div key={index} className="relative border">
                      <img src={preview} className="w-full h-24 object-cover" />
                    </div>
                  );
                })}
              </div>
            )}
          </Section>

          {total && (
            <Section title="Summary">
              <p>Total: ${total}</p>
              <p className="text-pink-600 font-bold">Deposit: ${deposit}</p>
            </Section>
          )}

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