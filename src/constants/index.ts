import type { TermsItem } from "@/types";

export const PLAN_STATS = [
  { label: "Investment Amount", value: "₹50,000", sub: "Per Application" },
  { label: "Total Shares", value: "160", sub: "Shares Allocated" },
  { label: "Per Share Value", value: "₹312.5", sub: "Per Share" },
  { label: "Minimum Term", value: "10 Years", sub: "Long-Term Investment" },
  { label: "Total Seats", value: "6,000", sub: "Applications Only" },
  { label: "Co-Applicant", value: "Mr. Manoj", sub: "Handles Your Shares" },
];

export const COMMISSION_STRUCTURE = [
  {
    role: "Share Owner",
    rate: "20%",
    description: "Commission on total sale price upon maturity",
    color: "gold",
  },
  {
    role: "Referral Bonus",
    rate: "25%",
    description: "25% of the middleman's 20% commission for bringing a referral",
    color: "blue",
  },
];

export const TERMS: TermsItem[] = [
  { id: 0, text: "LEGAL CHARGES: Legal Charges for registering the documents: Rs. 150 (Rupees One Hundred and Fifty only). This amount is payable at the time of document registration and is non-refundable.", highlight: true },
  { id: 1, text: "The contract will be effectively starting from the commencement date and will continue in force until the designated termination date as agreed upon application." },
  { id: 2, text: "The Project consists of a long-term investment with a minimum holding period of 10 years." },
  { id: 3, text: "The Project allotted applications are limited to only 6,000 seats in total." },
  { id: 4, text: "Each application consists of ₹50,000 fixed value for the purchase of shares." },
  { id: 5, text: "The investment amount of ₹50,000 is used to purchase 160 shares, where each share value is ₹312.50." },
  { id: 6, text: "Mr. Manoj will invest the amount in shares on behalf of the applicant as co-applicant and share handler." },
  { id: 7, text: "The Project cannot be cancelled, withdrawn, or returned in between. The investor must wait until the completion of the maturity period." },
  { id: 8, text: "The share owner agrees to pay a commission of 20% of the total sale price upon maturity." },
  { id: 9, text: "If the share owner provides a referral, he/she will receive a commission of 25% from the middleman's 20% commission value." },
  { id: 10, text: "If the company shows a negative performance indicator during the investment period, the co-applicant will suggest and guide the investor to withdraw the amount during the term of the application period." },
  { id: 11, text: "The applicant voluntarily and unconditionally agrees to make this investment at their own risk and understanding." },
  { id: 12, text: "The shares are handled exclusively by the co-applicant Mr. Manoj on behalf of the investor." },
  { id: 13, text: "The Project does not disclose the name of the investment share company to prevent fraud activity or theft of the project plan." },
  { id: 14, text: "The Project will enclose its full investment information only during the withdrawal period." },
  { id: 15, text: "If any fraud is found from the applicant's side, the necessary legal action will be taken accordingly." },
  { id: 16, text: "The applicant agrees to all the above terms and conditions with complete knowledge and free will, without any external pressure or inducement." },
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman & Nicobar Islands", "Lakshadweep", "Dadra & Nagar Haveli"
];
