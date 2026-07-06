import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Phone, Mail, MapPin, CreditCard, Heart, Users, ChevronRight, ChevronLeft, Clock, RotateCcw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { INDIAN_STATES } from "@/constants";
import type { ApplicationForm } from "@/types";

const DRAFT_KEY = "oti_form_draft";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  fatherHusbandName: z.string().min(2, "Father/Husband name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number"),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit pincode"),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Enter valid 12-digit Aadhaar number"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter valid PAN (e.g. ABCDE1234F)"),
  bankAccountNumber: z.string().min(9, "Enter valid bank account number"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter valid IFSC code (e.g. SBIN0001234)"),
  bankName: z.string().min(2, "Bank name is required"),
  nomineeName: z.string().min(2, "Nominee name is required"),
  nomineeRelationship: z.string().min(1, "Relationship is required"),
  nomineePhone: z.string().regex(/^[6-9]\d{9}$/, "Enter valid 10-digit mobile number"),
  nomineeAadhaar: z.string().regex(/^\d{12}$/, "Enter valid 12-digit Aadhaar number"),
  referralName: z.string().optional().or(z.literal("")),
  referralPhone: z.string().optional().or(z.literal("")),
  contractStart: z.string().min(1, "Contract start date is required"),
  contractEnd: z.string().min(1, "Contract end date is required"),
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: "You must agree to terms" }) }),
  signature: z.string().min(2, "Please type your full name as signature"),
});

type FormData = z.infer<typeof schema>;

const STEPS = [
  { id: 1, label: "Personal Info", icon: User },
  { id: 2, label: "KYC & Bank", icon: CreditCard },
  { id: 3, label: "Nominee", icon: Heart },
  { id: 4, label: "Referral & Agreement", icon: Users },
];

function formatDraftTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

export default function ApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  // Restore draft on mount
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const { data, savedAt } = JSON.parse(raw);
        if (data && savedAt) {
          reset(data);
          setDraftSavedAt(savedAt);
          setShowDraftBanner(true);
        }
      } catch { /* ignore */ }
    }
  }, [reset]);

  // Debounced auto-save
  const watchedValues = watch();
  const saveDraft = useCallback(() => {
    const savedAt = new Date().toISOString();
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ data: watchedValues, savedAt }));
      setDraftSavedAt(savedAt);
    } catch { /* ignore */ }
  }, [watchedValues]);

  useEffect(() => {
    const t = setTimeout(saveDraft, 500);
    return () => clearTimeout(t);
  }, [saveDraft]);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftBanner(false);
    setDraftSavedAt(null);
    reset();
    toast.success("Draft cleared successfully.");
  };

  const stepFields: Record<number, (keyof FormData)[]> = {
    1: ["fullName", "fatherHusbandName", "dateOfBirth", "gender", "phone", "email", "address", "city", "state", "pincode"],
    2: ["aadhaarNumber", "panNumber", "bankAccountNumber", "ifscCode", "bankName"],
    3: ["nomineeName", "nomineeRelationship", "nomineePhone", "nomineeAadhaar"],
    4: ["contractStart", "contractEnd", "agreeToTerms", "signature"],
  };

  const handleNext = async () => {
    const valid = await trigger(stepFields[currentStep]);
    if (valid) setCurrentStep((s) => s + 1);
    else toast.error("Please fill all required fields correctly.");
  };

  const onSubmit = (data: FormData) => {
    localStorage.setItem("oti_application", JSON.stringify(data));
    localStorage.removeItem(DRAFT_KEY); // clear draft on submit
    navigate("/agreement", { state: { formData: data } });
  };

  const inputClass = "w-full bg-navy-light/50 border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold/60 focus:border-gold/60 transition-colors";
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        {/* Draft Banner */}
        {showDraftBanner && draftSavedAt && (
          <div className="mt-6 flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-gold/30 bg-gold/8 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <Clock size={14} className="text-gold flex-shrink-0" />
              <span className="text-gold font-semibold flex-shrink-0">Resume Draft Available</span>
              <span className="text-muted-foreground text-xs hidden sm:inline truncate">
                — Last saved: {formatDraftTime(draftSavedAt)}
              </span>
            </div>
            <button
              onClick={clearDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors flex-shrink-0"
            >
              <RotateCcw size={11} /> Clear Draft
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mt-8 mb-10">
          <p className="text-gold uppercase tracking-widest text-xs font-semibold mb-2">OTI Investment</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-2">Application Form</h1>
          <p className="text-muted-foreground text-sm">Complete all 4 steps to submit your investment application</p>
          <div className="w-16 h-0.5 gold-gradient mx-auto mt-4" />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-gold to-gold/60 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div key={step.id} className="relative flex flex-col items-center z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted ? "gold-gradient border-gold text-navy-dark" :
                  isActive ? "border-gold bg-gold/20 text-gold" :
                  "border-border bg-background text-muted-foreground"
                }`}>
                  <Icon size={16} />
                </div>
                <p className={`text-[10px] font-semibold mt-2 hidden sm:block ${isActive ? "text-gold" : "text-muted-foreground"}`}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Auto-save indicator */}
        {draftSavedAt && (
          <p className="text-muted-foreground text-xs text-right mb-2 flex items-center justify-end gap-1">
            <Clock size={10} /> Draft auto-saved at {formatDraftTime(draftSavedAt)}
          </p>
        )}

        {/* Form Card */}
        <div className="navy-card rounded-xl p-6 sm:p-8 border-gold/20">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* STEP 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-semibold gold-text mb-4">Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input {...register("fullName")} placeholder="As per Aadhaar card" className={inputClass} />
                    {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Father / Husband Name *</label>
                    <input {...register("fatherHusbandName")} placeholder="Father or Husband name" className={inputClass} />
                    {errors.fatherHusbandName && <p className={errorClass}>{errors.fatherHusbandName.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input {...register("dateOfBirth")} type="date" className={inputClass} />
                    {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select {...register("gender")} className={inputClass}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number *</label>
                    <input {...register("phone")} placeholder="10-digit mobile number" className={inputClass} maxLength={10} />
                    {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input {...register("email")} type="email" placeholder="Optional" className={inputClass} />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Full Address *</label>
                  <textarea {...register("address")} placeholder="House No., Street, Locality" className={inputClass} rows={2} />
                  {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClass}>City *</label>
                    <input {...register("city")} placeholder="City" className={inputClass} />
                    {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <select {...register("state")} className={inputClass}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className={errorClass}>{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Pincode *</label>
                    <input {...register("pincode")} placeholder="6-digit pincode" className={inputClass} maxLength={6} />
                    {errors.pincode && <p className={errorClass}>{errors.pincode.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: KYC & Bank */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-semibold gold-text mb-4">KYC & Bank Details</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Aadhaar Number *</label>
                    <input {...register("aadhaarNumber")} placeholder="12-digit Aadhaar number" className={inputClass} maxLength={12} />
                    {errors.aadhaarNumber && <p className={errorClass}>{errors.aadhaarNumber.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>PAN Number *</label>
                    <input {...register("panNumber")} placeholder="e.g. ABCDE1234F" className={`${inputClass} uppercase`} maxLength={10} />
                    {errors.panNumber && <p className={errorClass}>{errors.panNumber.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Bank Name *</label>
                    <input {...register("bankName")} placeholder="Name of your bank" className={inputClass} />
                    {errors.bankName && <p className={errorClass}>{errors.bankName.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>IFSC Code *</label>
                    <input {...register("ifscCode")} placeholder="e.g. SBIN0001234" className={`${inputClass} uppercase`} maxLength={11} />
                    {errors.ifscCode && <p className={errorClass}>{errors.ifscCode.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Bank Account Number *</label>
                    <input {...register("bankAccountNumber")} placeholder="Bank account number" className={inputClass} />
                    {errors.bankAccountNumber && <p className={errorClass}>{errors.bankAccountNumber.message}</p>}
                  </div>
                </div>
                <div className="p-4 rounded border border-amber-500/20 bg-amber-500/5 text-amber-400/80 text-xs leading-relaxed">
                  Your KYC details are collected solely for investment registration purposes and are protected under applicable data privacy norms.
                </div>
              </div>
            )}

            {/* STEP 3: Nominee */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-semibold gold-text mb-4">Nominee Details</h2>
                <p className="text-muted-foreground text-sm mb-4">
                  The nominee will receive the investment benefits in case of the investor's absence.
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Nominee Full Name *</label>
                    <input {...register("nomineeName")} placeholder="Nominee's full name" className={inputClass} />
                    {errors.nomineeName && <p className={errorClass}>{errors.nomineeName.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Relationship with Nominee *</label>
                    <select {...register("nomineeRelationship")} className={inputClass}>
                      <option value="">Select relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.nomineeRelationship && <p className={errorClass}>{errors.nomineeRelationship.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Nominee Mobile Number *</label>
                    <input {...register("nomineePhone")} placeholder="10-digit mobile number" className={inputClass} maxLength={10} />
                    {errors.nomineePhone && <p className={errorClass}>{errors.nomineePhone.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Nominee Aadhaar Number *</label>
                    <input {...register("nomineeAadhaar")} placeholder="12-digit Aadhaar number" className={inputClass} maxLength={12} />
                    {errors.nomineeAadhaar && <p className={errorClass}>{errors.nomineeAadhaar.message}</p>}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                    Referral Details <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                  </h3>
                  <p className="text-muted-foreground text-xs mb-4">If someone referred you, enter their details to ensure they receive their referral commission.</p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Referral Person Name</label>
                      <input {...register("referralName")} placeholder="Name of person who referred you" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Referral Person Phone</label>
                      <input {...register("referralPhone")} placeholder="Their mobile number" className={inputClass} maxLength={10} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Agreement */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-semibold gold-text mb-4">Contract Dates & Agreement</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Contract Start Date *</label>
                    <input {...register("contractStart")} type="date" className={inputClass} />
                    {errors.contractStart && <p className={errorClass}>{errors.contractStart.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Contract End / Termination Date *</label>
                    <input {...register("contractEnd")} type="date" className={inputClass} />
                    {errors.contractEnd && <p className={errorClass}>{errors.contractEnd.message}</p>}
                  </div>
                </div>

                {/* Terms Preview */}
                <div className="mt-2 p-4 rounded border border-border bg-navy-dark/50 max-h-48 overflow-y-auto space-y-3">
                  <p className="text-gold text-xs font-semibold uppercase tracking-widest">Terms & Conditions Summary</p>
                  {[
                    "Legal Charges of Rs.150 are applicable for registering investment documents (non-refundable).",
                    "The investment cannot be cancelled, withdrawn, or returned before maturity.",
                    "Mr. Manoj handles shares on your behalf as co-applicant.",
                    "20% commission on total sale price upon maturity.",
                    "25% of middleman's commission for referring a new investor.",
                    "The underlying share company name is not disclosed to prevent fraud.",
                    "Investment is at the investor's own risk.",
                    "Legal action may be taken in case of fraud from the investor's side.",
                  ].map((t, i) => (
                    <div key={i} className={`flex gap-2 text-xs ${i === 0 ? "text-gold font-semibold" : "text-muted-foreground"}`}>
                      <span className="text-gold flex-shrink-0">•</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    {...register("agreeToTerms")}
                    type="checkbox"
                    id="agreeToTerms"
                    className="mt-1 w-4 h-4 accent-yellow-500 cursor-pointer"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                    I have read and understood all the terms and conditions of the OTI One Time Invest Plan, including the <strong className="text-gold">Rs.150 legal registration charges</strong>. I voluntarily agree to invest at my own risk and consent to all terms with complete knowledge.
                  </label>
                </div>
                {errors.agreeToTerms && <p className={errorClass}>{errors.agreeToTerms.message}</p>}

                <div>
                  <label className={labelClass}>Digital Signature (Type Full Name) *</label>
                  <input
                    {...register("signature")}
                    placeholder="Type your full legal name as signature"
                    className={`${inputClass} italic`}
                  />
                  {errors.signature && <p className={errorClass}>{errors.signature.message}</p>}
                  <p className="text-muted-foreground text-xs mt-1">
                    By typing your name, you are digitally signing this investment agreement.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-border rounded text-muted-foreground hover:text-foreground hover:border-gold/40 transition-colors text-sm"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
              ) : <div />}

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm"
                >
                  Next Step <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 gold-gradient text-navy-dark font-bold rounded hover:opacity-90 transition-opacity text-sm"
                >
                  Preview Agreement <ChevronRight size={16} />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
