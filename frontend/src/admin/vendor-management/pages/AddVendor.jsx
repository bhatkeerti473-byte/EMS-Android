import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  Music2,
  Phone,
  Save,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

const initialForm = {
  vendorName: "",
  category: "",
  phone: "",
  email: "",
  address: "",
  contactPerson: "",
  contractStartDate: "",
  contractEndDate: "",
  status: "Active",
  contractBasis: "Per Event",
  contractPrice: 0,
  bankAccountNumber: "",
  ifscCode: "",
  upiId: "",
};

const vendorToForm = (vendor) =>
  vendor
    ? {
      vendorName: vendor.name || vendor.vendorName || "",
      category: vendor.category || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      address: vendor.address || "",
      contactPerson: vendor.contactPerson || "",
      contractStartDate: vendor.contractStartDate || "",
      contractEndDate: vendor.contractEndDate || "",
      status: vendor.status || vendor.contractStatus || "Active",
      contractBasis: vendor.contractBasis || "Per Event",
      contractPrice: vendor.contractPrice || 0,
      bankAccountNumber: vendor.bankAccountNumber || "",
      ifscCode: vendor.ifscCode || "",
      upiId: vendor.upiId || "",
    }
    : initialForm;

const vendorCategories = [
  {
    title: "Catering",
    description: "Food and catering service providers",
    icon: UtensilsCrossed,
    accent: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Decoration",
    description: "Event decoration and planning service",
    icon: Sparkles,
    accent: "bg-violet-100 text-violet-600",
  },
  {
    title: "Photography",
    description: "Photography and videography services",
    icon: Camera,
    accent: "bg-amber-100 text-amber-600",
  },
  {
    title: "Sound & Lighting",
    description: "Sound, lighting and technical support services",
    icon: Music2,
    accent: "bg-sky-100 text-sky-600",
  },
];

export default function AddVendor({
  initialVendor = null,
  existingVendors = [],
  editingVendorId = null,
  onSave,
  onCancel,
  saveLabel = "Save Vendor",
  title = "Add Vendor",
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState(vendorToForm(initialVendor));
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const today = getLocalDateString();

  useEffect(() => {
    setForm(vendorToForm(initialVendor));
    setMessage("");
    setErrors({});
  }, [initialVendor]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateVendor(form, today, existingVendors, editingVendorId);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("");
      return;
    }

    if (onSave) {
      onSave({
        ...form,
        name: form.vendorName.trim(),
        vendorName: form.vendorName.trim(),
        category: form.category.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        contactPerson: form.contactPerson.trim(),
        contractStartDate: form.contractStartDate,
        contractEndDate: form.contractEndDate,
        status: form.status,
        contractBasis: form.contractBasis,
        contractPrice: Number(form.contractPrice) || 0,
      });
    }

    setMessage("Vendor saved successfully.");

    if (onCancel || onSave) {
      if (onCancel) {
        onCancel();
        return;
      }
      navigate("/admin/vendor-management/overview");
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setMessage("");
    if (onCancel) {
      onCancel();
      return;
    }
    navigate("/admin/vendor-management/overview");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Home &gt; Vendor Management &gt; {title}
            </p>
          </div>

          <div className="text-right text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{localStorage.getItem("adminEmail") || "admin@gmail.com"}</p>
            <p>Administrator</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Add Vendor Form</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="Vendor Name"
              value={form.vendorName}
              onChange={(value) => handleChange("vendorName", value)}
              placeholder="Enter vendor name"
              error={errors.vendorName}
            />
            <Field
              label="Contact Person"
              value={form.contactPerson}
              onChange={(value) => handleChange("contactPerson", value)}
              placeholder="Enter contact person name"
              error={errors.contactPerson}
            />
            <SelectField
              label="Category"
              value={form.category}
              onChange={(value) => handleChange("category", value)}
              options={["Select Category", "Catering", "Decoration", "Photography", "Sound & Lighting"]}
              error={errors.category}
            />
            <DateField
              label="Contract Start Date"
              value={form.contractStartDate}
              onChange={(value) => handleChange("contractStartDate", value)}
              min={today}
              error={errors.contractStartDate}
            />
            <Field
              label="Phone"
              value={form.phone}
              onChange={(value) => handleChange("phone", value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter phone number"
              icon={Phone}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              error={errors.phone}
            />
            <DateField
              label="Contract End Date"
              value={form.contractEndDate}
              onChange={(value) => handleChange("contractEndDate", value)}
              min={form.contractStartDate || today}
              error={errors.contractEndDate}
            />
            <Field
              label="Email"
              value={form.email}
              onChange={(value) => handleChange("email", value)}
              placeholder="Enter email address"
              className="md:col-span-1"
              type="email"
              error={errors.email}
            />
            <SelectField
              label="Status"
              value={form.status}
              onChange={(value) => handleChange("status", value)}
              options={["Active", "Inactive", "Pending"]}
            />
            <SelectField
              label="Contract Basis"
              value={form.contractBasis}
              onChange={(value) => handleChange("contractBasis", value)}
              options={["Per Event", "Retainer", "Hourly"]}
            />
            <Field
              label="Bank Account Number"
              value={form.bankAccountNumber}
              onChange={(value) => handleChange("bankAccountNumber", value)}
              placeholder="e.g. 123456789012"
            />
            <Field
              label="IFSC Code"
              value={form.ifscCode}
              onChange={(value) => handleChange("ifscCode", value.toUpperCase())}
              placeholder="e.g. HDFC0001234"
            />
            <Field
              label="UPI ID"
              value={form.upiId}
              onChange={(value) => handleChange("upiId", value)}
              placeholder="e.g. vendor@upi"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              rows={4}
              placeholder="Enter full address"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
            />
          </div>

          {message && (
            <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5b2ceb] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#4e25b5]"
            >
              <Save size={16} />
              {saveLabel}
            </button>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Vendor Categories</h2>

          <div className="space-y-3">
            {vendorCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.title}
                  type="button"
                  onClick={() => handleChange("category", category.title)}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition hover:border-slate-300 hover:shadow-sm ${form.category === category.title ? "border-[#5b2ceb] bg-[#f6f3ff]" : "border-slate-200 bg-white"
                    }`}
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${category.accent}`}>
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{category.title}</span>
                    <span className="block text-xs text-slate-500">{category.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, icon: Icon = null, className = "", type = "text", inputMode, pattern, maxLength, error }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className={`flex items-center rounded-xl border bg-white px-3 py-2.5 transition focus-within:border-indigo-500 ${error ? "border-rose-400 focus-within:border-rose-500" : "border-slate-200"}`}>
        {Icon ? <Icon size={16} className="mr-2 text-slate-400" /> : null}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          inputMode={inputMode}
          pattern={pattern}
          maxLength={maxLength}
        />
      </div>
      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, error }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className={`flex items-center rounded-xl border bg-white px-3 py-2.5 transition focus-within:border-indigo-500 ${error ? "border-rose-400 focus-within:border-rose-500" : "border-slate-200"}`}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
        >
          {options.map((option) => (
            <option key={option} value={option === "Select Category" ? "" : option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="text-slate-400" />
      </div>
      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

function DateField({ label, value, onChange, min, error }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className={`flex items-center rounded-xl border bg-white px-3 py-2.5 transition focus-within:border-indigo-500 ${error ? "border-rose-400 focus-within:border-rose-500" : "border-slate-200"}`}>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min || getLocalDateString()}
          className="w-full bg-transparent text-sm text-slate-700 outline-none cursor-pointer"
        />
      </div>
      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

function validateVendor(form, today, existingVendors, editingVendorId) {
  const nextErrors = {};

  const vendorNameValue = form.vendorName.trim();
  const contactPersonValue = form.contactPerson.trim();
  const categoryValue = form.category.trim();
  const emailValue = form.email.trim();
  const phoneValue = form.phone.trim();
  const startDate = form.contractStartDate;
  const endDate = form.contractEndDate;

  // New Missing Basic Input Validations
  if (!vendorNameValue) {
    nextErrors.vendorName = "Vendor name is required";
  }

  if (!contactPersonValue) {
    nextErrors.contactPerson = "Contact person name is required";
  }

  if (!categoryValue) {
    nextErrors.category = "Please select a category";
  }

  // Email Checking
  if (!emailValue) {
    nextErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    nextErrors.email = "Please enter a valid email address";
  } else if (
    existingVendors.some(
      (vendor) => vendor.email?.toLowerCase() === emailValue.toLowerCase() && vendor.id !== editingVendorId
    )
  ) {
    nextErrors.email = "Email already exists";
  }

  // Phone Checking
  if (!phoneValue) {
    nextErrors.phone = "Phone number is required";
  } else if (!/^[0-9]{10}$/.test(phoneValue)) {
    nextErrors.phone = "Phone number must be 10 digits";
  } else if (
    existingVendors.some((vendor) => vendor.phone?.trim() === phoneValue && vendor.id !== editingVendorId)
  ) {
    nextErrors.phone = "Phone number already exists";
  }

  // Date Checking
  if (!startDate) {
    nextErrors.contractStartDate = "Start date is required";
  } else if (startDate < today) {
    nextErrors.contractStartDate = "Start date cannot be in the past";
  }

  if (!endDate) {
    nextErrors.contractEndDate = "End date is required";
  } else if (endDate < today) {
    nextErrors.contractEndDate = "End date cannot be in the past";
  }

  if (startDate && endDate && endDate < startDate) {
    nextErrors.contractEndDate = "End date must be after the start date";
  }

  return nextErrors;
}

function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}