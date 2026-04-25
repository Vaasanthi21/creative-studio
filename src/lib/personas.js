export const PERSONAS = [
  {
    id: "uden_tech",
    label: "UDEN.tech",
    description: "AI career platform · Tier 2/3 students",
    color: "#7c3aed",
    icon: "GraduationCap",
    contentTypes: ["Blog Post", "Social Media Caption", "Email Newsletter", "Landing Page Copy", "Video Script"],
    dots: ["#7c3aed", "#a78bfa", "#c4b5fd"],
  },
  {
    id: "viral_monkey",
    label: "Viral Monkey",
    description: "YouTube growth & viral content",
    color: "#ef4444",
    icon: "Youtube",
    contentTypes: ["YouTube Title", "Video Description", "Thumbnail Concept", "Community Post", "Short Script"],
    dots: ["#ef4444", "#f87171", "#fca5a5"],
  },
  {
    id: "career_jobs",
    label: "Career & Jobs",
    description: "Job market insights & career guidance",
    color: "#3b82f6",
    icon: "Briefcase",
    contentTypes: ["Resume Summary", "Cover Letter", "LinkedIn Post", "Job Description", "Career Advice Article"],
    dots: ["#3b82f6", "#60a5fa", "#93c5fd"],
  },
  {
    id: "gov_outreach",
    label: "Gov Outreach",
    description: "B2G communications & skill schemes",
    color: "#10b981",
    icon: "Building2",
    contentTypes: ["Press Release", "Policy Brief", "Scheme Announcement", "Public Notice", "Newsletter"],
    dots: ["#10b981", "#34d399", "#6ee7b7"],
  },
];

export function getPersonaById(id) {
  return PERSONAS.find((p) => p.id === id) || PERSONAS[0];
}