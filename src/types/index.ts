export interface ApplicationForm {
  // Personal Info
  fullName: string;
  fatherHusbandName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  // KYC / ID
  aadhaarNumber: string;
  panNumber: string;
  bankAccountNumber: string;
  ifscCode: string;
  bankName: string;

  // Nominee
  nomineeName: string;
  nomineeRelationship: string;
  nomineePhone: string;
  nomineeAadhaar: string;

  // Referral
  referralName: string;
  referralPhone: string;

  // Agreement
  contractStart: string;
  contractEnd: string;
  agreeToTerms: boolean;
  signature: string;
}

export interface TermsItem {
  highlight?: boolean;
  id: number;
  text: string;
}
