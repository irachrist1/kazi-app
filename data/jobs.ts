import { Job } from "@/types";

export const JOBS: Job[] = [
  {
    id: "job_001",
    title: "Community Programs Coordinator",
    company: "GIZ Rwanda",
    location: "Kigali, Rwanda",
    type: "Full-time",
    raw_description:
      "Coordinate community development programs across Kigali. Manage stakeholder relationships, track program impact, and report to international donors.",
    structured_requirements: {
      required_skills: [
        "community engagement",
        "program coordination",
        "stakeholder communication",
        "report writing",
      ],
      preferred_skills: ["donor reporting", "M&E", "NGO experience"],
      experience_level: "2-4 years",
      role_summary:
        "Coordinate on-the-ground community programs with local and international partners.",
    },
  },
  {
    id: "job_002",
    title: "Data Analyst",
    company: "Andela",
    location: "Remote / Kigali",
    type: "Full-time",
    raw_description:
      "Analyze product usage data, build dashboards, and generate insights that drive decisions for a fast-growing tech company.",
    structured_requirements: {
      required_skills: [
        "data analysis",
        "SQL",
        "Excel or Google Sheets",
        "data visualization",
      ],
      preferred_skills: ["Python", "Tableau", "Power BI", "statistics"],
      experience_level: "1-3 years",
      role_summary:
        "Turn raw data into actionable insights for product and business teams.",
    },
  },
  {
    id: "job_003",
    title: "Sales & Business Development Officer",
    company: "MTN Rwanda",
    location: "Kigali, Rwanda",
    type: "Full-time",
    raw_description:
      "Drive B2B and B2C sales, build partnerships, and grow market share for telecom products across Rwanda.",
    structured_requirements: {
      required_skills: [
        "sales",
        "negotiation",
        "client relationship management",
        "target-driven mindset",
      ],
      preferred_skills: [
        "telecom sector knowledge",
        "CRM tools",
        "Kinyarwanda fluency",
      ],
      experience_level: "1-3 years",
      role_summary:
        "Grow revenue by building client relationships and closing deals in a competitive market.",
    },
  },
  {
    id: "job_004",
    title: "Youth Trainer / Facilitator",
    company: "Imbuto Foundation",
    location: "Kigali & Provinces",
    type: "Contract",
    raw_description:
      "Design and deliver training programs for youth aged 16–30 in entrepreneurship, leadership, and life skills.",
    structured_requirements: {
      required_skills: [
        "facilitation",
        "public speaking",
        "curriculum design",
        "youth engagement",
      ],
      preferred_skills: [
        "entrepreneurship knowledge",
        "coaching",
        "Kinyarwanda",
      ],
      experience_level: "2-5 years",
      role_summary:
        "Empower young Rwandans through structured training in skills and mindset.",
    },
  },
  {
    id: "job_005",
    title: "Operations Associate",
    company: "Equity Bank Rwanda",
    location: "Kigali, Rwanda",
    type: "Full-time",
    raw_description:
      "Support daily banking operations, process transactions, assist customers, and maintain accurate records.",
    structured_requirements: {
      required_skills: [
        "attention to detail",
        "customer service",
        "record-keeping",
        "numeracy",
      ],
      preferred_skills: ["banking software", "compliance knowledge", "Excel"],
      experience_level: "0-2 years",
      role_summary:
        "Keep banking operations running smoothly through precision and customer focus.",
    },
  },
  {
    id: "job_006",
    title: "Digital Marketing Specialist",
    company: "Kasha Rwanda",
    location: "Kigali, Rwanda",
    type: "Full-time",
    raw_description:
      "Run digital campaigns, manage social media, create content, and grow online presence for Rwanda's leading e-commerce platform.",
    structured_requirements: {
      required_skills: [
        "social media management",
        "content creation",
        "digital advertising",
        "copywriting",
      ],
      preferred_skills: [
        "Meta Ads",
        "Google Analytics",
        "graphic design basics",
        "SEO",
      ],
      experience_level: "1-3 years",
      role_summary:
        "Drive brand awareness and customer acquisition through digital channels.",
    },
  },
];
