export const platforms = [
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Professional and business-focused content",
    icon: "linkedin",
    color: "#0A66C2",
    dots: ["#0A66C2", "#4F9CF9", "#9CC9FF"],
    contentTypes: ["Text Only", "Image", "Video", "Text + Image", "Text + Video"],
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Visual-first social content with engaging captions",
    icon: "instagram",
    color: "#E1306C",
    dots: ["#E1306C", "#F77737", "#FCAF45"],
    contentTypes: ["Text Only", "Image", "Video", "Text + Image", "Text + Video"],
  },
  {
    id: "facebook",
    label: "Facebook",
    description: "Community-focused and conversational content",
    icon: "facebook",
    color: "#1877F2",
    dots: ["#1877F2", "#5FA8FF", "#A8D1FF"],
    contentTypes: ["Text Only", "Image", "Video", "Text + Image", "Text + Video"],
  },
  {
    id: "youtube",
    label: "YouTube",
    description: "Video-focused content with titles and descriptions",
    icon: "youtube",
    color: "#FF0000",
    dots: ["#FF0000", "#FF6666", "#FFB3B3"],
    contentTypes: ["Text Only", "Image", "Video", "Text + Image", "Text + Video"],
  },
];

// Backward compatibility for old files still using PERSONAS
export const PERSONAS = platforms;

export function getPersonaById(id) {
  return platforms.find((platform) => platform.id === id) || platforms[0];
}