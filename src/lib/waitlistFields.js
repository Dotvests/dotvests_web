// The Dotvests Investor Interest form, transcribed from the Google Form.
// Option strings must match the backend's constants/waitlistFields.js exactly —
// the server re-validates every answer.

export const AGE_RANGES = ["Under 18","18 - 24","25 - 34","35 - 44","45 and above"];

export const OCCUPATIONS = [
  "Student",
  "Employed (Private Sector)",
  "Employed (Public Sector)",
  "Self-employed / Business Owner",
  "Unemployed / Between Roles",
];

export const INCOME_RANGES = [
  "Below ₦50,000",
  "₦50,000 - ₦150,000",
  "₦150,001 - ₦500,000",
  "Above ₦500,000",
  "Prefer Not To Say",
];

export const SHARE_AWARENESS = [
  "Yes, I own shares",
  "Yes, but I don't own any",
  "I've heard the names but don't know much",
  "No, not familiar",
];

export const INVESTS_CURRENTLY = [
  "Yes, actively",
  "I've tried before but stopped",
  "No, I haven't started yet",
  "Dont have any idea of shares or investment",
];

export const INVEST_CHANNELS = [
  "Nigerian Stock Exchange",
  "Mutual Fund / ETFs",
  "Bamboo, Chaka, Troove",
  "Real Estate",
  "Fixed Deposits / Treasury Bills",
  "I use some Investment apps",
  "I don't invest",
];

export const INVEST_BARRIERS = [
  "I don't know how to start",
  "Investment requires a lot of money",
  "I can't find a platform I trust",
  "Limited time to manage investment",
  "No barrier - I invest freely",
];

export const WOULD_INVEST = [
  "Definitely yes",
  "Probably yes",
  "Not sure yet",
  "Probably not",
  "Definitely not",
];

export const BLOCKCHAIN_IMPORTANCE = [
  "Very Important",
  "Somewhat important",
  "Not very important",
  "I don't yet understand blockchain",
];

export const TRUST_FACTORS = [
  "A platform registered with SEC/CBN and partners with a licensed broker or custodian",
  "24/7 Customer Service",
  "Transparent, verifiable ownership records",
  "Strong user reviews and testimonials",
  "Backing from banks and companies they sell shares for",
];

export const MONTHLY_INVESTMENT = [
  "₦1,000 - ₦3,000",
  "₦3,001 - ₦10,000",
  "₦10,001 - ₦50,000",
  "₦50,001 - ₦1,000,000",
  "₦1,000,001 and above",
];

export const LIQUIDITY_IMPORTANCE = ["Very Important", "It doesn't matter to me"];

export const FINANCIAL_EDUCATION = [
  "I am open to it",
  "I am financially educated already but I am open to learning.",
  "It is very important to me",
  "I don't want it",
];

export const HEARD_ABOUT_US = [
  "Social Media (X, Instagram, LinkedIn)",
  "Family and Friend",
  "Online Search",
  "Event or Conference",
];

export const DISCOVERY_CHANNELS = [
  "Instagram",
  "X (Formerly Twitter)",
  "Whatsapp Status",
  "Facebook",
  "Family and Friends",
  "Google/Internet",
];

export const WOULD_RECOMMEND = ["Yes I will", "No I won't", "I don't know"];

// Suggestions only — the input stays free text so diaspora members can
// enter somewhere outside Nigeria.
export const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Federal Capital Territory",
  "Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto",
  "Taraba","Yobe","Zamfara",
];

/**
 * One entry per screen of the wizard. Field `type` is one of:
 *   text | tel | email | textarea | datalist | radio | checkbox
 * `allowOther: true` appends an "Other" choice with a free-text input.
 * Only Section 1 fields are required, matching the Google Form.
 */
export const SECTIONS = [
  {
    id: "about",
    title: "About You",
    blurb: "Help us understand who our community is made of.",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Your full name", maxLength: 120, autoComplete: "name" },
      { key: "phone", label: "Phone number", hint: "WhatsApp preferred", type: "tel", required: true, placeholder: "080 1234 5678", maxLength: 32, autoComplete: "tel" },
      { key: "email", label: "Email address", hint: "We send your referral code here", type: "email", required: true, placeholder: "you@email.com", maxLength: 120, autoComplete: "email" },
      { key: "age_range", label: "What is your age range?", type: "radio", required: true, options: AGE_RANGES },
      { key: "state_of_residence", label: "State of residence", type: "datalist", required: true, placeholder: "e.g. Lagos", maxLength: 80, options: NIGERIAN_STATES },
      { key: "occupation", label: "What best describes your occupation?", type: "radio", required: true, options: OCCUPATIONS },
      { key: "income_range", label: "What is your monthly income range (₦)?", type: "radio", required: true, options: INCOME_RANGES },
    ],
  },
  {
    id: "habits",
    title: "Your Investment Habits",
    fields: [
      { key: "share_awareness", label: "Have you heard of shares of some companies like GTBank, Dangote Cement, MTN Nigeria, or Zenith Bank?", type: "radio", options: SHARE_AWARENESS },
      { key: "invests_currently", label: "Do you currently invest?", hint: "Have you ever bought shares with any company, such as GTB, Dangote Cement, or MTN?", type: "radio", options: INVESTS_CURRENTLY },
      { key: "invest_channels", label: "Where do you actively invest?", hint: "Select all that apply", type: "checkbox", options: INVEST_CHANNELS },
      { key: "invest_barriers", label: "What is the biggest barrier stopping you from investing more?", hint: "Select all that apply", type: "checkbox", options: INVEST_BARRIERS, allowOther: true },
    ],
  },
  {
    id: "interest",
    title: "Your Interest in DotVests",
    fields: [
      { key: "would_invest", label: "Would you invest, using a platform that offers you shares with any company from as little as ₦1,000?", type: "radio", options: WOULD_INVEST },
      { key: "blockchain_importance", label: "How important is it to you that your investment is recorded on a blockchain (transparent and cannot be changed)?", type: "radio", options: BLOCKCHAIN_IMPORTANCE },
      { key: "trust_factors", label: "What would most make you trust a new investment platform?", hint: "Select all that apply", type: "checkbox", options: TRUST_FACTORS, allowOther: true },
      { key: "monthly_investment", label: "If you could start with ₦1,000, how much would you invest monthly?", type: "radio", options: MONTHLY_INVESTMENT },
      { key: "liquidity_importance", label: "How important is it for you that you can buy shares anytime and sell it anytime you want?", type: "radio", options: LIQUIDITY_IMPORTANCE },
      { key: "financial_education", label: "How open are you to financial education?", type: "radio", options: FINANCIAL_EDUCATION },
    ],
  },
  {
    id: "reach",
    title: "Reach and Referral",
    fields: [
      { key: "heard_about_us", label: "How did you hear about DotVests?", type: "radio", options: HEARD_ABOUT_US, allowOther: true },
      { key: "discovery_channels", label: "Where do you often hear about money/investment apps?", hint: "Select all that apply", type: "checkbox", options: DISCOVERY_CHANNELS },
      { key: "would_recommend", label: "Would you recommend an app like this to your family and friends if you liked it?", type: "radio", options: WOULD_RECOMMEND },
      { key: "comments", label: "Any other thoughts, questions, or suggestions for us?", type: "textarea", placeholder: "Optional", maxLength: 2000 },
    ],
  },
  {
    id: "finish",
    title: "Join The Waitlist",
    blurb: "Last step. Add a referral code if someone invited you, then confirm and you're in.",
    fields: [],
  },
];

export const FIELDS = SECTIONS.flatMap((s) => s.fields);
export const MULTI_KEYS = FIELDS.filter((f) => f.type === "checkbox").map((f) => f.key);

export const emptyForm = () =>
  Object.fromEntries(FIELDS.map((f) => [f.key, f.type === "checkbox" ? [] : ""]));

// Free-text "Other" answers live alongside the main values, keyed by field.
export const emptyOther = () =>
  Object.fromEntries(FIELDS.filter((f) => f.allowOther).map((f) => [f.key, ""]));

export const OTHER_MAX_LENGTH = 200;

/**
 * Validates one section. The server re-checks everything; this just avoids a
 * pointless round trip and puts the message next to the offending input.
 */
export function validateSection(section, values, other) {
  const errors = {};

  for (const f of section.fields) {
    const raw = values[f.key];

    if (f.type === "checkbox") {
      if (f.required && (!raw || raw.length === 0)) errors[f.key] = `${f.label} is required.`;
    } else {
      const value = (raw || "").trim();
      if (!value) {
        if (f.required) errors[f.key] = `This field is required.`;
        continue;
      }
      if (f.options && f.type === "radio" && !f.options.includes(value) && !f.allowOther) {
        errors[f.key] = "Please choose one of the options.";
      }
      if (f.maxLength && value.length > f.maxLength) {
        errors[f.key] = `Please keep this under ${f.maxLength} characters.`;
      }
    }

    // "Other" was picked but left blank, or is too long.
    if (f.allowOther) {
      const picked =
        f.type === "checkbox" ? (raw || []).includes("__other__") : raw === "__other__";
      const text = (other?.[f.key] || "").trim();
      if (picked && !text) errors[f.key] = "Please fill in your own answer.";
      else if (text.length > OTHER_MAX_LENGTH)
        errors[f.key] = `Your own answer must be under ${OTHER_MAX_LENGTH} characters.`;
    }
  }

  if (section.fields.some((f) => f.key === "email")) {
    const email = (values.email || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address.";
    }
    const digits = (values.phone || "").replace(/\D/g, "");
    if ((values.phone || "").trim() && digits.length < 10) {
      errors.phone = "Enter a valid phone number.";
    }
  }

  return errors;
}

/**
 * Swaps the "__other__" sentinel for the typed text, producing the exact
 * shape the API expects.
 */
export function buildPayload(values, other) {
  const out = {};

  for (const f of FIELDS) {
    const raw = values[f.key];
    const text = (other?.[f.key] || "").trim();

    if (f.type === "checkbox") {
      const list = (raw || []).filter((v) => v !== "__other__");
      if (f.allowOther && (raw || []).includes("__other__") && text) list.push(text);
      out[f.key] = list;
    } else {
      const value = (raw || "").trim();
      out[f.key] = value === "__other__" ? text : value;
    }
  }

  return out;
}
