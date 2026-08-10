"use client";

import React, { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  FileDown,
  Printer,
  WandSparkles,
  GraduationCap,
  Mail,
  MapPin,
  Palette,
  Phone,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";

type Education = {
  id: number;
  degree: string;
  institution: string;
  year: string;
};

type Experience = {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
};

type Language = {
  id: number;
  language: string;
  level: string;
};

type Project = {
  id: number;
  title: string;
  description: string;
};

type TemplateId = "blue" | "common" | "navy" | "dark" | "ats" | "corporate" | "minimal" | "creative" | "executive" | "timeline" | "classic" | "medical" | "teacher" | "sales";

type Template = {
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
};

const templates: Template[] = [
  { id: "blue", name: "Professional Blue", description: "Modern blue header with clean professional layout", accent: "from-blue-800 to-cyan-600" },
  { id: "common", name: "Common", description: "Clean grey header and simple two-column sections", accent: "from-slate-500 to-slate-700" },
  { id: "navy", name: "Modern Navy", description: "Strong navy profile column with white content", accent: "from-blue-950 to-blue-700" },
  { id: "dark", name: "Elegant Dark", description: "Premium dark profile panel with refined typography", accent: "from-slate-950 to-slate-700" },
  { id: "ats", name: "ATS Readable", description: "Simple single-column format designed for easy scanning", accent: "from-slate-700 to-slate-500" },
  { id: "corporate", name: "Corporate", description: "Compact corporate layout with professional sidebar", accent: "from-cyan-800 to-blue-950" },
  { id: "minimal", name: "Minimal Clean", description: "Elegant white layout with precise spacing", accent: "from-slate-300 to-slate-500" },
  { id: "creative", name: "Creative Accent", description: "Modern colorful split layout", accent: "from-fuchsia-600 to-violet-700" },
  { id: "executive", name: "Executive", description: "Premium executive resume with strong hierarchy", accent: "from-amber-600 to-slate-900" },
  { id: "timeline", name: "Career Timeline", description: "Timeline-style experience and education", accent: "from-emerald-600 to-teal-800" },
  { id: "classic", name: "Classic", description: "Traditional formal CV layout", accent: "from-stone-500 to-stone-800" },
  { id: "medical", name: "Medical Professional", description: "Healthcare-focused clean design", accent: "from-emerald-600 to-cyan-700" },
  { id: "teacher", name: "Teacher Profile", description: "Education-focused professional design", accent: "from-indigo-600 to-sky-600" },
  { id: "sales", name: "Sales Professional", description: "Compact results-focused design", accent: "from-orange-600 to-rose-600" },
];

type ResumeCategory = "general" | "teacher" | "sales" | "medical" | "accountant" | "mechanical";

type ExtraQualification = {
  id: number;
  title: string;
  description: string;
};

const categoryLabels: Record<ResumeCategory, string> = {
  general: "General / Professional",
  teacher: "Teacher / Education",
  sales: "Sales / Retail",
  medical: "Medical / Healthcare",
  accountant: "Accountant / Finance",
  mechanical: "Mechanical / QA-QC / NDT",
};

const categoryPresets: Record<ResumeCategory, {
  jobTitle: string;
  summary: string;
  skills: string;
  languages: Language[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  hobbies: string[];
  strengths: string[];
  qualifications: ExtraQualification[];
  declaration: string;
}> = {
  general: {
    jobTitle: "Professional",
    summary: "Motivated professional seeking a challenging position where I can use my skills, contribute to organizational success and continue professional growth.",
    skills: "Communication, Teamwork, Problem Solving, Time Management",
    languages: [{ id: 1, language: "English", level: "Professional" }],
    experience: [{ id: 1, role: "", company: "", period: "", description: "" }],
    education: [{ id: 1, degree: "", institution: "", year: "" }],
    projects: [{ id: 1, title: "", description: "" }],
    hobbies: ["Reading", "Writing"],
    strengths: ["Hardworking", "Positive attitude", "Adaptable"],
    qualifications: [],
    declaration: "I hereby declare that the above mentioned information is correct and true to the best of my knowledge and belief.",
  },
  teacher: {
    jobTitle: "Teacher",
    summary: "Dedicated and passionate educator committed to fostering student development in a nurturing and inclusive classroom environment. Skilled in communication, classroom management and lesson planning.",
    skills: "Classroom Management, Lesson Planning & Curriculum Development, Student Assessment & Evaluation, Effective Communication & Presentation, Organizational Skills & Multitasking, Leadership",
    languages: [
      { id: 1, language: "English", level: "Professional" },
      { id: 2, language: "Malayalam", level: "Professional" },
      { id: 3, language: "Hindi", level: "Intermediate" },
      { id: 4, language: "Arabic", level: "Intermediate" },
    ],
    experience: [{ id: 1, role: "Primary Teacher", company: "", period: "", description: "" }],
    education: [
      { id: 1, degree: "Secondary School Leaving Certificate (SSLC)", institution: "Kerala Public Examination Board", year: "" },
      { id: 2, degree: "Higher Secondary (HSE)", institution: "", year: "" },
      { id: 3, degree: "Diploma in Montessori Training (MTTC)", institution: "", year: "" },
    ],
    projects: [{ id: 1, title: "", description: "" }],
    hobbies: ["Drawing", "Painting", "Reading", "Speaking", "Story Telling"],
    strengths: ["Respectful and patient with students", "Honesty and integrity", "Diligent and punctual", "Adaptable", "Motivating people"],
    qualifications: [
      { id: 1, title: "MTTC Training", description: "Offline class with lab" },
      { id: 2, title: "PPTTC Training", description: "Teacher training course" },
      { id: 3, title: "Motivation Teachers Training Programme", description: "" },
      { id: 4, title: "Life Skill and Mentorship Camp", description: "" },
    ],
    declaration: "I hereby declare that the above mentioned details are true to my knowledge.",
  },
  sales: {
    jobTitle: "Sales Professional",
    summary: "Hardworking sales professional with customer service and retail experience, focused on achieving targets, supporting customers and contributing to business growth.",
    skills: "Customer Service, Sales, Communication, Teamwork, Product Knowledge, Time Management",
    languages: [
      { id: 1, language: "English", level: "Professional" },
      { id: 2, language: "Hindi", level: "Intermediate" },
      { id: 3, language: "Malayalam", level: "Mother tongue" },
    ],
    experience: [{ id: 1, role: "Salesman", company: "Bharath Super Market", period: "6 Year", description: "" }],
    education: [
      { id: 1, degree: "SSLC", institution: "", year: "" },
      { id: 2, degree: "PLUS TWO", institution: "", year: "" },
    ],
    projects: [{ id: 1, title: "", description: "" }],
    hobbies: ["Reading", "Craft work", "Writing"],
    strengths: ["Hardworking, Determined & Self-confident", "Honest and Discipline", "Flexible to handle change", "Positive attitude"],
    qualifications: [],
    declaration: "I hereby declare that the above mentioned information are correct and true to the best of my knowledge and belief.",
  },
  medical: {
    jobTitle: "Medical Laboratory Technician",
    summary: "Committed healthcare professional seeking a position in a forward-looking hospital where I can apply my technical knowledge, practical skills and dedication to quality patient care.",
    skills: "Laboratory Assistance, Sample Handling, ECG, Nebulization, IV, Pulse Monitoring, Reception, GRBs",
    languages: [
      { id: 1, language: "English", level: "Professional" },
      { id: 2, language: "Malayalam", level: "Professional" },
    ],
    experience: [
      { id: 1, role: "Lab Assistant Trainee", company: "Venniyur GHC, Malappuram", period: "6 Month", description: "" },
      { id: 2, role: "Lab Assistant Technician", company: "Family Medical Center, Pookiparamba, Malappuram", period: "1 Year", description: "" },
    ],
    education: [
      { id: 1, degree: "Diploma in Medical Laboratory", institution: "Jain University", year: "2023" },
      { id: 2, degree: "PLUS TWO", institution: "Kerala Board of Higher Secondary Examination", year: "2020" },
      { id: 3, degree: "S.S.L.C", institution: "Board of Public Examinations, Kerala", year: "2018" },
    ],
    projects: [{ id: 1, title: "", description: "" }],
    hobbies: ["Reading", "Craft work", "Writing"],
    strengths: ["Hardworking, Determined & Self-confident", "Honest and Discipline", "Flexible to handle change", "Positive attitude"],
    qualifications: [
      { id: 1, title: "Reception", description: "" }, { id: 2, title: "Nebulization", description: "" },
      { id: 3, title: "IV", description: "" }, { id: 4, title: "ECG", description: "" },
      { id: 5, title: "GRBs", description: "" }, { id: 6, title: "Pulse", description: "" },
    ],
    declaration: "I hereby declare that the above mentioned information are correct and true to the best of my knowledge and belief.",
  },
  accountant: {
    jobTitle: "Accountant / Manager",
    summary: "To obtain a challenging position in a forward-looking company where I can utilize my accounting skills and abilities while contributing to organizational success and professional growth.",
    skills: "Team Leadership, Team Work, Good Communication, Creativity, Social Media Engagement, Negotiation Skill, Management, Accounting",
    languages: [
      { id: 1, language: "English", level: "Professional" },
      { id: 2, language: "Malayalam", level: "Professional" },
      { id: 3, language: "Arabic", level: "Intermediate" },
    ],
    experience: [{ id: 1, role: "Accountant & Manager", company: "V G R Rent House", period: "6 month", description: "" }],
    education: [
      { id: 1, degree: "S.S.L.C", institution: "N I O S", year: "2017" },
      { id: 2, degree: "PLUSTWO", institution: "N I O S", year: "2021" },
      { id: 3, degree: "PG Diploma in Indian and Foreign Accounting", institution: "ITPC Campus, Kottakkal", year: "2024" },
      { id: 4, degree: "TALLY ESSENTIAL LEVEL-1", institution: "ITPC Campus, Kottakkal", year: "2024" },
      { id: 5, degree: "SAP S/4HANA Finance & Controlling", institution: "ITPC Campus, Kottakkal", year: "2024" },
      { id: 6, degree: "Diploma in Computerised Financial Accounting / Data Entry", institution: "ITPC Campus", year: "2024" },
    ],
    projects: [{ id: 1, title: "", description: "" }],
    hobbies: ["Reading", "Writing"],
    strengths: ["Hardworking, Determined & Self-confident", "Honest and Discipline", "Flexible to handle change", "Positive attitude"],
    qualifications: [
      { id: 1, title: "Accounting", description: "Indian and Foreign Accounting" },
      { id: 2, title: "TALLY ESSENTIAL LEVEL-1", description: "" },
      { id: 3, title: "SAP S/4HANA", description: "Finance & Controlling" },
      { id: 4, title: "Computerised Financial Accounting", description: "Data entry" },
    ],
    declaration: "I hereby declare that the above mentioned information are correct and true to the best of my knowledge and belief.",
  },
  mechanical: {
    jobTitle: "QA/QC Mechanical / NDT Professional",
    summary: "Certified NDT Level-II professional with a strong foundation in material testing and inspection techniques. Eager to apply knowledge of Ultrasonic, Magnetic Particle and Penetrant Testing in the Oil & Gas industry, committed to precision, safety and continuous learning.",
    skills: "QA/QC Mechanical Engineering, Ultrasonic Testing (UT), Radiographic Testing (RT), Magnetic Particle Testing (MT), Liquid Penetrant Testing (PT), Welding Inspection, Piping & Pipeline Engineering, Project Management, HSE Management, Risk Management, Problem Solving, Team Collaboration, Leadership, Time Management",
    languages: [
      { id: 1, language: "English", level: "Professional" }, { id: 2, language: "Tamil", level: "Intermediate" },
      { id: 3, language: "Hindi", level: "Intermediate" }, { id: 4, language: "Malayalam", level: "Professional" },
    ],
    experience: [{ id: 1, role: "", company: "", period: "", description: "" }],
    education: [
      { id: 1, degree: "S.S.L.C", institution: "Kerala Board Of Public Examinations", year: "2022" },
      { id: 2, degree: "PLUSTWO", institution: "Kerala Board Of Higher Secondary Examinations", year: "2025" },
      { id: 3, degree: "Diploma in Fire and Safety Engineering", institution: "Knowit Education", year: "2026" },
    ],
    projects: [{ id: 1, title: "Industrial Visit: Fire Station, Tirur", description: "Gained exposure to emergency response protocols and fire safety equipment handling." }],
    hobbies: ["Reading"],
    strengths: ["Hardworking, Determined & Self-confident", "Honest and Discipline", "Flexible to handle change", "Positive attitude"],
    qualifications: [
      { id: 1, title: "Diploma in Oil & Gas", description: "" }, { id: 2, title: "Diploma in Health & Safety", description: "" },
      { id: 3, title: "Piping & Pipeline Engineering", description: "" }, { id: 4, title: "Welding Inspection", description: "" },
      { id: 5, title: "QA/QC", description: "" }, { id: 6, title: "Magnetic Particle Testing", description: "" },
      { id: 7, title: "Penetrant Testing", description: "" }, { id: 8, title: "Radiography Testing", description: "" },
      { id: 9, title: "Ultrasonic Testing", description: "" }, { id: 10, title: "Visual Testing", description: "" },
      { id: 11, title: "Permit to Work", description: "" }, { id: 12, title: "QHSE - Accident Reporting, Inspecting & Audit", description: "" },
      { id: 13, title: "First Aider Testing", description: "" },
    ],
    declaration: "I hereby declare that the above mentioned information are correct and true to the best of my knowledge and belief.",
  },
};

type ResumeStudioProps = {
  onClose?: () => void;
};

export default function ResumeStudio({ onClose }: ResumeStudioProps) {
  const [name, setName] = useState("Your Name");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [nationality, setNationality] = useState("");
  const [religion, setReligion] = useState("");
  const [passport, setPassport] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [photo, setPhoto] = useState("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("blue");
  const [category, setCategory] = useState<ResumeCategory>("general");
  const [hobbies, setHobbies] = useState("Reading, Writing");
  const [strengths, setStrengths] = useState("Hardworking, Positive attitude, Adaptable");
  const [hobbyGenerationIndex, setHobbyGenerationIndex] = useState(0);
  const [strengthGenerationIndex, setStrengthGenerationIndex] = useState(0);
  const [declaration, setDeclaration] = useState("I hereby declare that the above mentioned information is correct and true to the best of my knowledge and belief.");
  const [qualifications, setQualifications] = useState<ExtraQualification[]>([]);
  const [customAccent, setCustomAccent] = useState("blue");
  const [showSidebar, setShowSidebar] = useState(true);
  const [compactLayout, setCompactLayout] = useState(false);
  const [photoShape, setPhotoShape] = useState<"circle" | "rounded" | "square">("rounded");
  const [fontFamily, setFontFamily] = useState<"sans" | "serif" | "mono">("sans");
  const [textScale, setTextScale] = useState<"small" | "normal" | "large">("normal");
  const [headerAlignment, setHeaderAlignment] = useState<"left" | "center">("left");
  const [showPhoto, setShowPhoto] = useState(true);
  const [showContact, setShowContact] = useState(true);
  const [paperTone, setPaperTone] = useState<"white" | "soft">("white");
  const [headingColor, setHeadingColor] = useState("#0f766e");
  const [photoBorderColor, setPhotoBorderColor] = useState("#ffffff");
  const [isDownloading, setIsDownloading] = useState(false);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);

  const [education, setEducation] = useState<Education[]>([
    { id: 1, degree: "", institution: "", year: "" },
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    { id: 1, role: "", company: "", period: "", description: "" },
  ]);

  const [languages, setLanguages] = useState<Language[]>([
    { id: 1, language: "", level: "" },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: "", description: "" },
  ]);

  const skillsList = useMemo(
    () =>
      skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [skills]
  );

  const addEducation = () =>
    setEducation((items) => [
      ...items,
      { id: Date.now(), degree: "", institution: "", year: "" },
    ]);

  const removeEducation = (id: number) =>
    setEducation((items) => items.filter((item) => item.id !== id));

  const addExperience = () =>
    setExperience((items) => [
      ...items,
      {
        id: Date.now(),
        role: "",
        company: "",
        period: "",
        description: "",
      },
    ]);

  const removeExperience = (id: number) =>
    setExperience((items) => items.filter((item) => item.id !== id));

  const addLanguage = () =>
    setLanguages((items) => [...items, { id: Date.now(), language: "", level: "" }]);

  const removeLanguage = (id: number) =>
    setLanguages((items) => items.filter((item) => item.id !== id));

  const updateLanguage = (
    id: number,
    field: keyof Omit<Language, "id">,
    value: string
  ) =>
    setLanguages((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

  const addProject = () =>
    setProjects((items) => [
      ...items,
      { id: Date.now(), title: "", description: "" },
    ]);

  const removeProject = (id: number) =>
    setProjects((items) => items.filter((item) => item.id !== id));

  const updateProject = (
    id: number,
    field: keyof Omit<Project, "id">,
    value: string
  ) =>
    setProjects((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

  const updateEducation = (
    id: number,
    field: keyof Omit<Education, "id">,
    value: string
  ) =>
    setEducation((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

  const updateExperience = (
    id: number,
    field: keyof Omit<Experience, "id">,
    value: string
  ) =>
    setExperience((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

  const applyCategoryPreset = (nextCategory: ResumeCategory) => {
    const preset = categoryPresets[nextCategory];
    const now = Date.now();
    setCategory(nextCategory);
    setJobTitle(preset.jobTitle);
    setSummary(preset.summary);
    setSkills(preset.skills);
    setLanguages(preset.languages.map((item, i) => ({ ...item, id: now + i })));
    setExperience(preset.experience.map((item, i) => ({ ...item, id: now + 20 + i })));
    setEducation(preset.education.map((item, i) => ({ ...item, id: now + 40 + i })));
    setProjects(preset.projects.map((item, i) => ({ ...item, id: now + 60 + i })));
    setHobbies(preset.hobbies.join(", "));
    setStrengths(preset.strengths.join(", "));
    setHobbyGenerationIndex(0);
    setStrengthGenerationIndex(0);
    setQualifications(preset.qualifications.map((item, i) => ({ ...item, id: now + 80 + i })));
    setDeclaration(preset.declaration);
    setSelectedTemplate(
      nextCategory === "teacher" ? "teacher" :
      nextCategory === "medical" ? "medical" :
      nextCategory === "sales" ? "sales" :
      nextCategory === "accountant" ? "common" :
      nextCategory === "mechanical" ? "corporate" : "blue"
    );
  };

  const addQualification = () =>
    setQualifications((items) => [...items, { id: Date.now(), title: "", description: "" }]);

  const updateQualification = (id: number, field: keyof Omit<ExtraQualification, "id">, value: string) =>
    setQualifications((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));

  const removeQualification = (id: number) =>
    setQualifications((items) => items.filter((item) => item.id !== id));

  const generatedHobbySets: Record<ResumeCategory, string[][]> = {
    general: [
      ["Reading", "Writing", "Listening to music", "Traveling"],
      ["Reading", "Photography", "Learning new skills", "Community activities"],
      ["Traveling", "Sports", "Reading", "Creative activities"],
      ["Writing", "Technology", "Music", "Volunteering"],
    ],
    teacher: [
      ["Reading", "Drawing", "Storytelling", "Educational activities"],
      ["Reading", "Painting", "Public speaking", "Community activities"],
      ["Creative writing", "Child-friendly activities", "Music", "Volunteering"],
      ["Reading", "Craft work", "Educational content", "Cultural activities"],
    ],
    sales: [
      ["Reading", "Traveling", "Sports", "Meeting new people"],
      ["Music", "Photography", "Networking", "Fitness"],
      ["Reading", "Traveling", "Customer interaction", "Team activities"],
      ["Sports", "Technology", "Social activities", "Learning new skills"],
    ],
    medical: [
      ["Reading", "Health awareness", "Walking", "Volunteering"],
      ["Reading", "Fitness", "Community service", "Learning new skills"],
      ["Music", "Traveling", "Health education", "Sports"],
      ["Reading", "Yoga", "Volunteering", "Public awareness activities"],
    ],
    accountant: [
      ["Reading", "Technology", "Learning new skills", "Traveling"],
      ["Reading", "Finance learning", "Music", "Community activities"],
      ["Photography", "Technology", "Sports", "Professional learning"],
      ["Reading", "Writing", "Problem-solving activities", "Traveling"],
    ],
    mechanical: [
      ["Reading", "Technical learning", "Sports", "Traveling"],
      ["Technology", "Mechanical projects", "Fitness", "Photography"],
      ["Reading", "Safety learning", "Outdoor activities", "Music"],
      ["Technical research", "Traveling", "Sports", "Learning new skills"],
    ],
  };

  const generatedStrengthSets: Record<ResumeCategory, string[][]> = {
    general: [
      ["Hardworking", "Positive attitude", "Adaptable", "Quick learner"],
      ["Responsible", "Team player", "Good communication", "Problem solving"],
      ["Reliable", "Organized", "Self-motivated", "Time management"],
      ["Disciplined", "Flexible", "Positive mindset", "Attention to detail"],
    ],
    teacher: [
      ["Patient with students", "Good communication", "Classroom management", "Adaptable"],
      ["Creative teaching approach", "Responsible", "Organized", "Teamwork"],
      ["Empathetic", "Positive attitude", "Leadership", "Quick learner"],
      ["Diligent", "Punctual", "Motivating", "Problem solving"],
    ],
    sales: [
      ["Customer focused", "Good communication", "Target oriented", "Confident"],
      ["Negotiation skills", "Team player", "Positive attitude", "Adaptable"],
      ["Self-motivated", "Persuasive", "Problem solving", "Time management"],
      ["Responsible", "Energetic", "Quick learner", "Relationship building"],
    ],
    medical: [
      ["Patient focused", "Responsible", "Attention to detail", "Calm under pressure"],
      ["Teamwork", "Good communication", "Disciplined", "Quick learner"],
      ["Compassionate", "Reliable", "Adaptable", "Safety conscious"],
      ["Organized", "Diligent", "Problem solving", "Professional attitude"],
    ],
    accountant: [
      ["Accurate", "Detail oriented", "Responsible", "Good communication"],
      ["Organized", "Analytical", "Time management", "Team player"],
      ["Reliable", "Problem solving", "Disciplined", "Quick learner"],
      ["Self-motivated", "Confidentiality conscious", "Adaptable", "Professional attitude"],
    ],
    mechanical: [
      ["Safety conscious", "Attention to detail", "Technical knowledge", "Teamwork"],
      ["Problem solving", "Quality focused", "Disciplined", "Adaptable"],
      ["Responsible", "Analytical", "Quick learner", "Good communication"],
      ["Reliable", "Safety focused", "Time management", "Leadership"],
    ],
  };

  const generateHobbies = () => {
    const sets = generatedHobbySets[category] || generatedHobbySets.general;
    const next = hobbyGenerationIndex % sets.length;
    setHobbies(sets[next].join(", "));
    setHobbyGenerationIndex((value) => value + 1);
  };

  const generateStrengths = () => {
    const sets = generatedStrengthSets[category] || generatedStrengthSets.general;
    const next = strengthGenerationIndex % sets.length;
    setStrengths(sets[next].join(", "));
    setStrengthGenerationIndex((value) => value + 1);
  };

  const generateObjective = () => {
    const role = jobTitle.trim() || categoryLabels[category] || "professional";
    const skillText = skillsList.slice(0, 3).join(", ");
    const skillPhrase = skillText || "relevant professional skills";
    const objectives = [
      `Motivated ${role} seeking an opportunity to apply ${skillPhrase}, contribute to organizational goals and grow through continuous learning and practical experience.`,
      `Dedicated ${role} looking for a responsible position where I can use my strengths in ${skillPhrase} to deliver quality work, support the team and contribute to long-term organizational success.`,
      `Professional and hardworking ${role} seeking a suitable position to apply ${skillPhrase}, maintain high standards of performance and build a successful career through continuous improvement.`,
      `Career-focused ${role} seeking an opportunity in a professional environment where I can apply ${skillPhrase}, take on new responsibilities and make a positive contribution to the organization.`,
      `Enthusiastic ${role} with a strong commitment to learning, teamwork and quality, seeking a position where ${skillPhrase} can be used effectively to achieve professional and organizational objectives.`,
      `Responsible and adaptable ${role} seeking a challenging opportunity to utilize ${skillPhrase}, solve day-to-day responsibilities efficiently and contribute positively to a productive workplace.`,
      `Results-oriented ${role} seeking a position that allows me to combine ${skillPhrase} with communication, teamwork and problem-solving abilities while supporting the growth and success of the organization.`,
      `Ambitious ${role} seeking a long-term professional opportunity to apply ${skillPhrase}, develop new capabilities and consistently deliver reliable, high-quality work.`,
    ];

    const available = objectives.filter((objective) => objective !== summary);
    const generated = available[Math.floor(Math.random() * available.length)] || objectives[0];
    setSummary(generated);
  };

  const printResume = () => window.print();

  const downloadPdf = async () => {
    const element = document.getElementById("resume-print");
    if (!element) return;

    try {
      setIsDownloading(true);
      const [{ toCanvas }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);

      const canvas = await toCanvas(element, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
      const pageWidth = 210;
      const pageHeight = 297;
      const pageHeightPx = Math.floor(canvas.width * (pageHeight / pageWidth));
      let offsetY = 0;
      let page = 0;

      while (offsetY < canvas.height) {
        const sliceHeight = Math.min(pageHeightPx, canvas.height - offsetY);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) break;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(canvas, 0, offsetY, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

        if (page > 0) pdf.addPage();
        pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.94), "JPEG", 0, 0, pageWidth, (sliceHeight / canvas.width) * pageWidth, undefined, "FAST");
        offsetY += sliceHeight;
        page += 1;
      }

      const safeName = (name || "resume").replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || "resume";
      pdf.save(`${safeName}-resume.pdf`);
    } catch (error) {
      console.error("PDF download failed", error);
      window.alert("PDF download failed. Please try again after the resume preview finishes rendering.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 p-5 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100">
              Smart Akshaya
            </p>
            <h1 className="text-2xl font-black">Resume Studio</h1>
            <p className="text-sm text-blue-100">
              Create a clean professional resume with live preview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={downloadPdf} disabled={isDownloading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-blue-700 shadow-lg transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70">
              <FileDown size={17} />
              {isDownloading ? "Preparing PDF…" : "Download PDF"}
            </button>
            <button type="button" onClick={printResume} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-black text-white ring-1 ring-white/40 transition hover:bg-white/25">
              <Printer size={17} />
              Print
            </button>


          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-4">
            <details className="rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 shadow-sm dark:border-cyan-900 dark:from-slate-900 dark:to-slate-900">
              <summary className="mb-3 flex cursor-pointer list-none items-center justify-between gap-3 font-black marker:hidden">
                <span>Resume Category</span><span className="rounded-full bg-white px-2 py-1 text-[9px] font-black text-cyan-700 shadow-sm">AUTO FILL</span>
              </summary>
              <p className="mb-3 text-[11px] text-slate-500">Select a category and auto-fill the professional data.</p>
              <select
                value={category}
                onChange={(e) => applyCategoryPreset(e.target.value as ResumeCategory)}
                className="w-full rounded-xl border border-cyan-200 bg-white px-3 py-3 text-sm font-bold text-slate-700 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {(Object.keys(categoryLabels) as ResumeCategory[]).map((item) => (
                  <option key={item} value={item}>{categoryLabels[item]}</option>
                ))}
              </select>
              <p className="mt-2 text-[10px] leading-4 text-slate-400">Personal details stay untouched; professional sections are filled and remain editable.</p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="mb-4 flex cursor-pointer list-none items-center gap-2 font-black marker:hidden">
                <UserRound size={18} className="text-cyan-600" />
                <span>Personal Details</span>
              </summary>

              <div className="grid gap-3">
                <Input label="Full Name" value={name} onChange={setName} />
                <Input
                  label="Job Title"
                  value={jobTitle}
                  onChange={setJobTitle}
                />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <Input label="Email" value={email} onChange={setEmail} />
                  <Input label="Phone" value={phone} onChange={setPhone} />
                  <Input
                    label="Location"
                    value={location}
                    onChange={setLocation}
                  />
                </div>

                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Profile Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => { setPhoto(String(reader.result || "")); setPhotoZoom(1); setPhotoOffsetX(0); setPhotoOffsetY(0); };
                      reader.readAsDataURL(file);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </label>

                {photo && (
                  <PhotoControls
                    zoom={photoZoom}
                    onZoom={setPhotoZoom}
                    onReset={() => {
                      setPhotoZoom(1);
                      setPhotoOffsetX(0);
                      setPhotoOffsetY(0);
                    }}
                  />
                )}
              </div>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="mb-3 cursor-pointer list-none font-black marker:hidden">Basic Details</summary>
              <div className="grid gap-3">
                <Input label="Father's Name" value={fatherName} onChange={setFatherName} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectInput
                    label="Gender"
                    value={gender}
                    onChange={setGender}
                    options={["Male", "Female", "Transgender"]}
                  />
                  <Input label="Date of Birth" value={dob} onChange={setDob} />
                  <SelectInput
                    label="Marital Status"
                    value={maritalStatus}
                    onChange={setMaritalStatus}
                    options={["Married", "Unmarried", "Widow", "Widower", "Divorced"]}
                  />
                  <Input label="Nationality" value={nationality} onChange={setNationality} />
                  <Input label="Religion" value={religion} onChange={setReligion} />
                  <Input label="Passport Number" value={passport} onChange={setPassport} />
                </div>
              </div>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="mb-3 cursor-pointer list-none font-black marker:hidden">Professional Summary / Objective</summary>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[10px] text-slate-400">Write your own objective or generate one from the selected category.</p>
                <button type="button" onClick={generateObjective} className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-[10px] font-black text-white shadow-sm transition hover:bg-cyan-700"><WandSparkles size={13} /> Generate</button>
              </div>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={5}
                placeholder="Write a short professional summary..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </details>

            

            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="mb-3 flex cursor-pointer list-none items-center justify-between gap-3 font-black marker:hidden">
                <div><span>Languages Known</span><p className="text-[11px] font-medium text-slate-400">Add language and proficiency level</p></div>
                <button type="button" onClick={(e) => { e.preventDefault(); addLanguage(); }} className="rounded-lg bg-cyan-50 p-2 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/40"><Plus size={16} /></button>
              </summary>

              <div className="space-y-3">
                {languages.map((item, index) => (
                  <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[1fr_1fr_auto] dark:border-slate-700">
                    <Input
                      label={`Language ${index + 1}`}
                      value={item.language}
                      onChange={(v) => updateLanguage(item.id, "language", v)}
                    />
                    <SelectInput
                      label="Level"
                      value={item.level}
                      onChange={(v) => updateLanguage(item.id, "level", v)}
                      options={["Mother tongue", "Professional", "Intermediate", "Basic"]}
                    />
                    {languages.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeLanguage(item.id)}
                        className="self-end rounded-lg p-2 text-rose-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    ) : <span />}
                  </div>
                ))}
              </div>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="mb-3 flex cursor-pointer list-none items-center justify-between gap-3 font-black marker:hidden">
                <span className="flex items-center gap-2"><BriefcaseBusiness size={18} className="text-cyan-600" />Work Experience</span>
                <button type="button" onClick={(e) => { e.preventDefault(); addExperience(); }} className="rounded-lg bg-cyan-50 p-2 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/40" aria-label="Add work experience"><Plus size={16} /></button>
              </summary>

              <div className="space-y-4">
                {experience.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-400">
                        Experience {index + 1}
                      </span>

                      {experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(item.id)}
                          className="text-rose-500"
                          aria-label={`Remove experience ${index + 1}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Input
                        label="Role"
                        value={item.role}
                        onChange={(v) =>
                          updateExperience(item.id, "role", v)
                        }
                      />
                      <Input
                        label="Company"
                        value={item.company}
                        onChange={(v) =>
                          updateExperience(item.id, "company", v)
                        }
                      />
                      <Input
                        label="Period"
                        value={item.period}
                        onChange={(v) =>
                          updateExperience(item.id, "period", v)
                        }
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          updateExperience(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        rows={3}
                        placeholder="Responsibilities and achievements..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="mb-3 flex cursor-pointer list-none items-center justify-between gap-3 font-black marker:hidden">
                <span className="flex items-center gap-2"><GraduationCap size={18} className="text-cyan-600" />Education</span>
                <button type="button" onClick={(e) => { e.preventDefault(); addEducation(); }} className="rounded-lg bg-cyan-50 p-2 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/40" aria-label="Add education"><Plus size={16} /></button>
              </summary>

              <div className="space-y-4">
                {education.map((item, index) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-400">
                        Education {index + 1}
                      </span>

                      {education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEducation(item.id)}
                          className="text-rose-500"
                          aria-label={`Remove education ${index + 1}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3">
                      <Input
                        label="Degree / Course"
                        value={item.degree}
                        onChange={(v) =>
                          updateEducation(item.id, "degree", v)
                        }
                      />
                      <Input
                        label="Institution"
                        value={item.institution}
                        onChange={(v) =>
                          updateEducation(item.id, "institution", v)
                        }
                      />
                      <Input
                        label="Year"
                        value={item.year}
                        onChange={(v) =>
                          updateEducation(item.id, "year", v)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="mb-3 flex cursor-pointer list-none items-center justify-between gap-3 font-black marker:hidden">
                <div><span>Projects Details</span><p className="text-[11px] font-medium text-slate-400">Add projects and short descriptions</p></div>
                <button type="button" onClick={(e) => { e.preventDefault(); addProject(); }} className="rounded-lg bg-cyan-50 p-2 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/40"><Plus size={16} /></button>
              </summary>

              <div className="space-y-3">
                {projects.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-slate-400">
                        Project {index + 1}
                      </span>
                      {projects.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProject(item.id)}
                          className="text-rose-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Input
                        label="Project Details"
                        value={item.title}
                        onChange={(v) => updateProject(item.id, "title", v)}
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) => updateProject(item.id, "description", e.target.value)}
                        rows={3}
                        placeholder="Project related description in brief"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="mb-3 cursor-pointer list-none font-black marker:hidden">Skills</summary>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={3}
                placeholder="Communication, MS Office, Photoshop, Customer Service..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </details>
            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="mb-3 cursor-pointer list-none font-black marker:hidden">Additional Resume Content</summary>
              <div className="grid gap-3">
                <label className="grid gap-1.5">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500">Hobbies & Interests</span>
                    <button
                      type="button"
                      onClick={generateHobbies}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-2.5 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-cyan-700"
                    >
                      <WandSparkles size={12} /> Generate
                    </button>
                  </span>
                  <textarea value={hobbies} onChange={(e) => setHobbies(e.target.value)} rows={2} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800" />
                </label>
                <label className="grid gap-1.5">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-500">Strengths</span>
                    <button
                      type="button"
                      onClick={generateStrengths}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-2.5 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-cyan-700"
                    >
                      <WandSparkles size={12} /> Generate
                    </button>
                  </span>
                  <textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={2} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Declaration</span>
                  <textarea value={declaration} onChange={(e) => setDeclaration(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800" />
                </label>
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <div className="mb-3 flex items-center justify-between">
                  <div><h3 className="text-sm font-black">Additional Qualifications / Certifications</h3><p className="text-[10px] text-slate-400">Certificates, courses and role-specific skills.</p></div>
                  <button type="button" onClick={addQualification} className="rounded-lg bg-cyan-50 p-2 text-cyan-700"><Plus size={16} /></button>
                </div>
                <div className="space-y-3">
                  {qualifications.map((item, index) => (
                    <div key={item.id} className="rounded-lg border border-slate-100 p-2 dark:border-slate-800">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400">Qualification {index + 1}</span>
                        <button type="button" onClick={() => removeQualification(item.id)} className="text-rose-500"><Trash2 size={14} /></button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input label="Title" value={item.title} onChange={(v) => updateQualification(item.id, "title", v)} />
                        <Input label="Details" value={item.description} onChange={(v) => updateQualification(item.id, "description", v)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="cursor-pointer list-none text-sm font-black marker:hidden">Customize Template</summary>
              <p className="mt-1 text-[11px] text-slate-400">Click the heading to open or hide customization controls.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <SelectInput label="Accent" value={customAccent} onChange={setCustomAccent} options={["blue","cyan","emerald","violet","orange","slate"]} />
                <label className="grid w-fit gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Heading Color</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <input
                      type="color"
                      value={headingColor}
                      onChange={(e) => setHeadingColor(e.target.value)}
                      title="Choose heading color"
                      aria-label="Choose heading color"
                      className="block h-9 w-9 cursor-pointer appearance-none rounded-lg border-0 bg-transparent p-0"
                    />
                  </span>
                </label>
                <label className="grid w-fit gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Photo Border Color</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <input
                      type="color"
                      value={photoBorderColor}
                      onChange={(e) => setPhotoBorderColor(e.target.value)}
                      title="Choose photo border color"
                      aria-label="Choose photo border color"
                      className="block h-9 w-9 cursor-pointer appearance-none rounded-lg border-0 bg-transparent p-0"
                    />
                  </span>
                </label>
                <SelectInput label="Photo Shape" value={photoShape} onChange={(v) => setPhotoShape(v as "circle" | "rounded" | "square")} options={["circle","rounded","square"]} />
                <SelectInput label="Font" value={fontFamily} onChange={(v) => setFontFamily(v as "sans" | "serif" | "mono")} options={["sans","serif","mono"]} />
                <SelectInput label="Text Size" value={textScale} onChange={(v) => setTextScale(v as "small" | "normal" | "large")} options={["small","normal","large"]} />
                <SelectInput label="Header Alignment" value={headerAlignment} onChange={(v) => setHeaderAlignment(v as "left" | "center")} options={["left","center"]} />
                <SelectInput label="Paper Tone" value={paperTone} onChange={(v) => setPaperTone(v as "white" | "soft")} options={["white","soft"]} />
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"><input type="checkbox" checked={showSidebar} onChange={(e) => setShowSidebar(e.target.checked)} /> Show sidebar</label>
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"><input type="checkbox" checked={compactLayout} onChange={(e) => setCompactLayout(e.target.checked)} /> Compact layout</label>
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"><input type="checkbox" checked={showPhoto} onChange={(e) => setShowPhoto(e.target.checked)} /> Show photo</label>
                <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"><input type="checkbox" checked={showContact} onChange={(e) => setShowContact(e.target.checked)} /> Show contact details</label>
              </div>
            </details>

<details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-black marker:hidden">
                <Palette size={18} className="text-cyan-600" />
                  <span>Resume Templates</span>
                <span className="ml-auto text-[11px] font-medium text-slate-400">Choose a design — preview updates instantly</span>
              </summary>

              <div className="mt-3 grid grid-cols-2 gap-3">
                {templates.map((template) => {
                  const active = selectedTemplate === template.id;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`group overflow-hidden rounded-2xl border-2 text-left transition-all ${
                        active
                          ? "border-cyan-500 bg-cyan-50/60 shadow-md ring-2 ring-cyan-100 dark:bg-cyan-950/30 dark:ring-cyan-900"
                          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                      }`}
                    >
                      <div
                        className={`h-16 bg-gradient-to-r ${template.accent} p-2.5`}
                      >
                        <div className="h-full rounded-lg bg-white/15 p-2">
                          <div className="h-1.5 w-16 rounded-full bg-white/90" />
                          <div className="mt-1.5 h-1 w-10 rounded-full bg-white/60" />
                          <div className="mt-3 grid grid-cols-3 gap-1">
                            <span className="h-1 rounded-full bg-white/50" />
                            <span className="h-1 rounded-full bg-white/30" />
                            <span className="h-1 rounded-full bg-white/30" />
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                            {template.name}
                          </p>
                          {active && (
                            <span className="rounded-full bg-cyan-500 px-1.5 py-0.5 text-[8px] font-black text-white">
                              SELECTED
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[10px] leading-4 text-slate-400">
                          {template.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </details>
          </div>

          <div className="min-w-0">
            <div className="rounded-2xl bg-slate-300 p-3 shadow-inner dark:bg-slate-800">
              <article
                id="resume-print"
                className={`mx-auto min-h-[900px] max-w-[800px] bg-white text-slate-800 shadow-2xl ${
                  selectedTemplate === "ats"
                    ? "p-8 sm:p-10"
                    : "p-0"
                }`}
              >
                <ResumeDesign
                  template={selectedTemplate}
                  name={name}
                  jobTitle={jobTitle}
                  email={email}
                  phone={phone}
                  location={location}
                  fatherName={fatherName}
                  gender={gender}
                  dob={dob}
                  maritalStatus={maritalStatus}
                  nationality={nationality}
                  religion={religion}
                  passport={passport}
                  photo={photo}
                  summary={summary}
                  skillsList={skillsList}
                  languages={languages}
                  projects={projects}
                  education={education}
                  experience={experience}
                  hobbies={hobbies}
                  strengths={strengths}
                  qualifications={qualifications}
                  declaration={declaration}
                  showSidebar={showSidebar}
                  compactLayout={compactLayout}
                  photoShape={photoShape}
                  customAccent={customAccent}
                  fontFamily={fontFamily}
                  textScale={textScale}
                  headerAlignment={headerAlignment}
                  showPhoto={showPhoto}
                  showContact={showContact}
                  paperTone={paperTone}
                  headingColor={headingColor}
                  photoBorderColor={photoBorderColor}
                  photoZoom={photoZoom}
                  photoOffsetX={photoOffsetX}
                  photoOffsetY={photoOffsetY}
                  onZoom={setPhotoZoom}
                  onOffsetX={setPhotoOffsetX}
                  onOffsetY={setPhotoOffsetY}
                />
              </article>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @page { size: A4; margin: 0; }
        @media print {
          body {
            background: white !important;
          }

          body * {
            visibility: hidden;
          }

          #resume-print,
          #resume-print * {
            visibility: visible;
          }

          #resume-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: none;
            min-height: auto;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}


function ResumeDesign({
  template, name, jobTitle, email, phone, location, fatherName, gender, dob,
  maritalStatus, nationality, religion, passport, photo, summary, skillsList,
  languages, projects, education, experience, hobbies, strengths,
  qualifications, declaration, showSidebar, compactLayout, photoShape, customAccent,
  fontFamily, textScale, headerAlignment, showPhoto, showContact, paperTone, headingColor, photoBorderColor, photoZoom, photoOffsetX, photoOffsetY,
  onZoom, onOffsetX, onOffsetY,
}: {
  template: TemplateId; name: string; jobTitle: string; email: string; phone: string;
  location: string; fatherName: string; gender: string; dob: string; maritalStatus: string;
  nationality: string; religion: string; passport: string; photo: string; summary: string;
  skillsList: string[]; languages: Language[]; projects: Project[]; education: Education[];
  experience: Experience[]; hobbies: string; strengths: string;
  qualifications: ExtraQualification[]; declaration: string; showSidebar: boolean;
  compactLayout: boolean; photoShape: "circle" | "rounded" | "square"; customAccent: string;
  fontFamily: "sans" | "serif" | "mono"; textScale: "small" | "normal" | "large";
  headerAlignment: "left" | "center"; showPhoto: boolean; showContact: boolean;
  paperTone: "white" | "soft"; headingColor: string; photoBorderColor: string; photoZoom: number; photoOffsetX: number; photoOffsetY: number;
  onZoom: (value: number) => void; onOffsetX: (value: number) => void; onOffsetY: (value: number) => void;
}) {
  const fontClass = fontFamily === "serif" ? "font-serif" : fontFamily === "mono" ? "font-mono" : "font-sans";
  const scaleClass = textScale === "small" ? "text-[95%]" : textScale === "large" ? "text-[108%]" : "text-[100%]";
  const paperClass = paperTone === "soft" ? "bg-slate-50" : "bg-white";
  const alignClass = headerAlignment === "center" ? "text-center" : "text-left";
  const body = (
    <ResumeBody
      summary={summary} experience={experience} education={education} languages={languages}
      projects={projects} fatherName={fatherName} gender={gender} dob={dob}
      maritalStatus={maritalStatus} nationality={nationality} religion={religion}
      passport={passport} skillsList={skillsList} hobbies={hobbies} strengths={strengths}
      qualifications={qualifications} declaration={declaration} compact={compactLayout}
      accent={accentFor(template, customAccent)} headingBorder={borderFor(template)}
      timeline={template === "timeline"} headingColor={headingColor}
    />
  );
  const shape = photoShape === "circle" ? "rounded-full" : photoShape === "square" ? "rounded-none" : "rounded-2xl";
  const photoSizeClass = photoShape === "circle" ? "h-32 w-32" : "h-40 w-[120px]";
  const photoEl = showPhoto && photo ? <InteractivePhoto photo={photo} shape={shape} sizeClass={photoSizeClass} borderColor={photoBorderColor} zoom={photoZoom} offsetX={photoOffsetX} offsetY={photoOffsetY} onZoom={onZoom} onOffsetX={onOffsetX} onOffsetY={onOffsetY} /> : null;
  const contact = showContact ? <ContactBlock email={email} phone={phone} location={location} compact={template !== "ats"} light={template !== "minimal" && template !== "classic"} centered={headerAlignment === "center"} /> : null;
  const title = (
    <div className={alignClass}>
      <h1 className="text-3xl font-black leading-tight">{name || "Your Name"}</h1>
      {jobTitle && <p className="mt-1 text-base font-bold opacity-80">{jobTitle}</p>}
      {contact}
    </div>
  );

  if (template === "ats") {
    return <div className={`min-h-[900px] ${paperClass} ${fontClass} ${scaleClass} p-8 text-slate-900 sm:p-10`}>
      <header className="flex items-start justify-between gap-5 border-b-2 border-slate-900 pb-5">{title}{photoEl}</header>{body}
    </div>;
  }

  if (template === "navy" || template === "corporate") {
    return <div className={`min-h-[900px] ${paperClass} ${fontClass} ${scaleClass} ${showSidebar ? "grid grid-cols-[210px_1fr]" : ""}`}>
      {showSidebar && <aside className={`${template === "navy" ? "bg-gradient-to-b from-blue-950 to-blue-800" : "bg-cyan-950"} p-6 text-white`}>
        {photoEl || <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 text-3xl font-black">{(name || "Y").charAt(0)}</div>}
        <h1 className="mt-5 text-xl font-black">{name || "Your Name"}</h1>
        {jobTitle && <p className="text-xs font-semibold text-cyan-200">{jobTitle}</p>}
        <div className="mt-4">{contact}</div>
        {skillsList.length > 0 && <div className="mt-7"><SideTitle>Skills</SideTitle><SkillCloud skills={skillsList} dark /></div>}
      </aside>}
      <main className="p-7 sm:p-9">{!showSidebar && <div className="mb-7 flex items-center justify-between border-b pb-5">{title}{photoEl}</div>}{body}</main>
    </div>;
  }

  const headerClass =
    template === "dark" || template === "executive" ? "bg-slate-950" :
    template === "creative" ? "bg-gradient-to-r from-fuchsia-700 to-violet-700" :
    template === "timeline" ? "bg-emerald-800" :
    template === "medical" ? "bg-gradient-to-r from-emerald-700 to-cyan-700" :
    template === "teacher" ? "bg-gradient-to-r from-indigo-700 to-sky-600" :
    template === "sales" ? "bg-gradient-to-r from-orange-600 to-rose-600" :
    template === "classic" ? "bg-stone-100 text-stone-900" :
    template === "minimal" ? "bg-white text-slate-900 border-b" :
    template === "common" ? "bg-slate-700" : "bg-gradient-to-r from-blue-800 to-cyan-600";

  if (template === "classic" || template === "minimal") {
    return <div className={`min-h-[900px] ${paperClass} ${fontClass} ${scaleClass}`}>
      <header className={`p-8 sm:p-10 ${headerClass}`}><div className="flex items-center justify-between gap-5">{title}{photoEl}</div></header>
      <main className="p-8 sm:p-10">{body}</main>
    </div>;
  }

  return <div className={`min-h-[900px] ${paperClass} ${fontClass} ${scaleClass}`}>
    <header className={`p-8 text-white sm:p-10 ${headerClass}`}><div className="flex items-center justify-between gap-5">{title}{photoEl}</div></header>
    <main className={`${template === "creative" && showSidebar ? "grid gap-8 sm:grid-cols-[1fr_220px]" : ""} p-8 sm:p-10`}>
      <div>{body}</div>
      {template === "creative" && showSidebar && <aside className="rounded-2xl bg-violet-50 p-5"><SideTitle dark>Skills</SideTitle><SkillCloud skills={skillsList} /></aside>}
    </main>
  </div>;
}

function accentFor(template: TemplateId, custom: string) {
  if (custom === "emerald" || template === "medical" || template === "timeline") return "text-emerald-800";
  if (custom === "violet" || template === "creative") return "text-violet-800";
  if (custom === "orange" || template === "sales") return "text-orange-800";
  if (custom === "slate" || template === "common" || template === "classic" || template === "minimal") return "text-slate-800";
  return "text-blue-800";
}

function borderFor(template: TemplateId) {
  if (template === "medical" || template === "timeline") return "border-emerald-200";
  if (template === "creative" || template === "teacher") return "border-violet-200";
  if (template === "sales") return "border-orange-200";
  if (template === "common" || template === "classic" || template === "minimal") return "border-slate-200";
  return "border-cyan-200";
}

function PhotoControls({ zoom, onZoom, onReset }: {
  zoom: number;
  onZoom: (value: number) => void;
  onReset: () => void;
}) {
  return <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-black text-slate-500">Zoom</span>
      <button type="button" onClick={() => onZoom(Math.max(1, Number((zoom - 0.1).toFixed(2))))} className="h-7 w-7 rounded-lg border border-slate-200 bg-white text-sm font-black dark:border-slate-700 dark:bg-slate-900">−</button>
      <input type="range" min="1" max="3" step="0.05" value={zoom} onChange={(e) => onZoom(Number(e.target.value))} className="min-w-0 flex-1" aria-label="Photo zoom" />
      <button type="button" onClick={() => onZoom(Math.min(3, Number((zoom + 0.1).toFixed(2))))} className="h-7 w-7 rounded-lg border border-slate-200 bg-white text-sm font-black dark:border-slate-700 dark:bg-slate-900">+</button>
      <span className="w-10 text-right text-[10px] font-bold">{zoom.toFixed(2)}×</span>
      <button type="button" onClick={onReset} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-black dark:border-slate-700 dark:bg-slate-900">Reset</button>
    </div>
  </div>;
}

function InteractivePhoto({ photo, shape, sizeClass, borderColor, zoom, offsetX, offsetY, onZoom, onOffsetX, onOffsetY }: {
  photo: string;
  shape: string;
  sizeClass: string;
  borderColor: string;
  zoom: number;
  offsetX: number;
  offsetY: number;
  onZoom: (value: number) => void;
  onOffsetX: (value: number) => void;
  onOffsetY: (value: number) => void;
}) {
  const drag = React.useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const boxRef = React.useRef<HTMLDivElement | null>(null);

  const move = (clientX: number, clientY: number) => {
    const box = boxRef.current;
    if (!box || !drag.current) return;
    const rect = box.getBoundingClientRect();
    const dx = ((clientX - drag.current.x) / Math.max(1, rect.width)) * 100;
    const dy = ((clientY - drag.current.y) / Math.max(1, rect.height)) * 100;
    onOffsetX(Math.max(-48, Math.min(48, drag.current.ox + dx)));
    onOffsetY(Math.max(-48, Math.min(48, drag.current.oy + dy)));
  };

  return <div
    ref={boxRef}
    className={`${shape} ${sizeClass} relative shrink-0 overflow-hidden border-4 bg-slate-100 shadow-lg touch-none select-none`}
    style={{ borderColor }}
    onWheel={(e) => {
      e.preventDefault();
      e.stopPropagation();
      const next = zoom + (e.deltaY < 0 ? 0.1 : -0.1);
      onZoom(Math.max(1, Math.min(3, Number(next.toFixed(2)))));
    }}
    onPointerDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { x: e.clientX, y: e.clientY, ox: offsetX, oy: offsetY };
    }}
    onPointerMove={(e) => {
      if (!drag.current) return;
      e.preventDefault();
      e.stopPropagation();
      move(e.clientX, e.clientY);
    }}
    onPointerUp={(e) => {
      drag.current = null;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    }}
    onPointerCancel={() => { drag.current = null; }}
  >
    <img
      src={photo}
      alt="Profile"
      draggable={false}
      className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      style={{
        objectPosition: `${50 + offsetX}% ${50 + offsetY}%`,
        transform: `scale(${zoom})`,
        transformOrigin: "center",
      }}
    />
  </div>;
}

function SkillCloud({ skills, dark = false }: { skills: string[]; dark?: boolean }) {
  return skills.length ? <div className="flex flex-wrap gap-2">
    {skills.map((skill, i) => <span key={`cloud-${i}-${skill}`} className={`rounded-full px-3 py-1.5 text-xs font-bold ${dark ? "bg-white/10 text-white" : "bg-white text-slate-700 shadow-sm"}`}>{skill}</span>)}
  </div> : <span className="text-xs text-slate-400">Add skills from the editor.</span>;
}

function ResumeBody({
  summary, experience, education, languages = [], projects = [], fatherName = "", gender = "",
  dob = "", maritalStatus = "", nationality = "", religion = "", passport = "",
  skillsList, accent, headingBorder, compact = false, hobbies = "", strengths = "",
  qualifications = [], declaration = "", timeline = false, headingColor = "",
}: {
  summary: string; experience: Experience[]; education: Education[]; languages?: Language[];
  projects?: Project[]; fatherName?: string; gender?: string; dob?: string; maritalStatus?: string;
  nationality?: string; religion?: string; passport?: string; skillsList: string[];
  accent: string; headingBorder: string; compact?: boolean; hobbies?: string; strengths?: string;
  qualifications?: ExtraQualification[]; declaration?: string; timeline?: boolean; headingColor?: string;
}) {
  const list = (v: string) => v.split(/[,\n•]+/).map((x) => x.trim()).filter(Boolean);
  const hasPersonal = [fatherName, gender, dob, maritalStatus, nationality, religion, passport].some(Boolean);
  return <div className={compact ? "space-y-5" : "space-y-7"}>
    {hasPersonal && <ResumeSection title="Personal Information" accent={accent} headingBorder={headingBorder} headingColor={headingColor}>
      <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {fatherName && <InfoRow label="Father's Name" value={fatherName} />}{gender && <InfoRow label="Gender" value={gender} />}
        {dob && <InfoRow label="Date of Birth" value={dob} />}{maritalStatus && <InfoRow label="Marital Status" value={maritalStatus} />}
        {nationality && <InfoRow label="Nationality" value={nationality} />}{religion && <InfoRow label="Religion" value={religion} />}
        {passport && <InfoRow label="Passport Number" value={passport} />}
      </div>
    </ResumeSection>}

    {summary && <ResumeSection title="Objective" accent={accent} headingBorder={headingBorder} headingColor={headingColor}><p className="whitespace-pre-line text-sm leading-6 text-slate-600">{summary}</p></ResumeSection>}

    {experience.some((x) => x.role || x.company || x.description) && <ResumeSection title="Work Experience" accent={accent} headingBorder={headingBorder} headingColor={headingColor}>
      <div className={timeline ? "space-y-5 border-l-2 border-emerald-200 pl-5" : "space-y-5"}>
        {experience.filter((x) => x.role || x.company || x.description).map((item) => <div key={item.id} className="relative">
          {timeline && <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-emerald-600" />}
          <div className="flex flex-wrap items-baseline justify-between gap-2"><div><h3 className="font-black text-slate-900">{item.role || "Role"}</h3>{item.company && <p className={`text-sm font-bold ${accent}`}>{item.company}</p>}</div>{item.period && <span className="text-xs font-semibold text-slate-400">{item.period}</span>}</div>
          {item.description && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{item.description}</p>}
        </div>)}
      </div>
    </ResumeSection>}

    {education.some((x) => x.degree || x.institution) && <ResumeSection title="Education / Academic Qualification" accent={accent} headingBorder={headingBorder} headingColor={headingColor}>
      <div className="space-y-3">{education.filter((x) => x.degree || x.institution).map((item) => <div key={item.id} className="flex justify-between gap-4">
        <div><h3 className="font-black text-slate-900">{item.degree || "Degree / Course"}</h3>{item.institution && <p className="text-sm text-slate-600">{item.institution}</p>}</div>
        {item.year && <span className="text-xs font-semibold text-slate-400">{item.year}</span>}
      </div>)}</div>
    </ResumeSection>}

    {qualifications.some((x) => x.title || x.description) && <ResumeSection title="Additional Qualifications / Certifications" accent={accent} headingBorder={headingBorder} headingColor={headingColor}>
      <div className="space-y-2">{qualifications.filter((x) => x.title || x.description).map((x) => <div key={x.id} className="text-sm"><b>• {x.title}</b>{x.description && <span className="text-slate-600"> — {x.description}</span>}</div>)}</div>
    </ResumeSection>}

    {projects.some((x) => x.title || x.description) && <ResumeSection title="Projects" accent={accent} headingBorder={headingBorder} headingColor={headingColor}>
      <div className="space-y-4">{projects.filter((x) => x.title || x.description).map((x) => <div key={x.id}><h3 className="font-black text-slate-900">{x.title || "Project"}</h3>{x.description && <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">{x.description}</p>}</div>)}</div>
    </ResumeSection>}

    {languages.some((x) => x.language) && <ResumeSection title="Languages Known" accent={accent} headingBorder={headingBorder} headingColor={headingColor}>
      <div className="grid gap-2 sm:grid-cols-2">{languages.filter((x) => x.language).map((x) => <div key={x.id} className="flex justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"><span className="text-sm font-bold text-slate-700">{x.language}</span><span className="text-xs font-semibold text-slate-400">{x.level}</span></div>)}</div>
    </ResumeSection>}

    {skillsList.length > 0 && <ResumeSection title="Skills" accent={accent} headingBorder={headingBorder} headingColor={headingColor}><div className="flex flex-wrap gap-2">{skillsList.map((x, i) => <span key={`skill-${i}-${x}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{x}</span>)}</div></ResumeSection>}

    {list(strengths).length > 0 && <ResumeSection title="Strengths" accent={accent} headingBorder={headingBorder} headingColor={headingColor}><div className="grid gap-2 sm:grid-cols-2">{list(strengths).map((x, i) => <div key={`strength-${i}-${x}`} className="text-sm font-semibold text-slate-700">• {x}</div>)}</div></ResumeSection>}

    {list(hobbies).length > 0 && <ResumeSection title="Hobbies & Interests" accent={accent} headingBorder={headingBorder} headingColor={headingColor}><div className="flex flex-wrap gap-2">{list(hobbies).map((x, i) => <span key={`hobby-${i}-${x}`} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600">{x}</span>)}</div></ResumeSection>}

    {declaration && <ResumeSection title="Declaration" accent={accent} headingBorder={headingBorder} headingColor={headingColor}><p className="text-sm leading-6 text-slate-600">{declaration}</p></ResumeSection>}
  </div>;
}

function ContactBlock({ email, phone, location, light = false, compact = false, centered = false, className = "" }: {
  email: string; phone: string; location: string; light?: boolean; compact?: boolean; centered?: boolean; className?: string;
}) {
  const items = [
    email ? { icon: <Mail size={compact ? 12 : 13} />, value: email } : null,
    phone ? { icon: <Phone size={compact ? 12 : 13} />, value: phone } : null,
    location ? { icon: <MapPin size={compact ? 12 : 13} />, value: location } : null,
  ].filter(Boolean) as { icon: React.ReactNode; value: string }[];
  if (!items.length) return null;
  return <div className={`flex flex-wrap gap-x-4 gap-y-2 text-xs ${centered ? "justify-center" : ""} ${light ? "text-slate-200" : "text-slate-500"} ${className}`}>
    {items.map((item, i) => <span key={`${item.value}-${i}`} className="inline-flex items-center gap-1.5 break-all">{item.icon}{item.value}</span>)}
  </div>;
}

function SideTitle({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <h3 className={`mb-3 border-b pb-2 text-[10px] font-black uppercase tracking-[0.18em] ${dark ? "border-slate-200 text-slate-700" : "border-white/20 text-cyan-200"}`}>{children}</h3>;
}

function ResumeSection({ title, children, accent, headingBorder, headingColor }: {
  title: string; children: React.ReactNode; accent: string; headingBorder: string; headingColor?: string;
}) {
  return <section><h3 style={headingColor ? { color: headingColor } : undefined} className={`mb-3 border-b pb-2 text-xs font-black uppercase tracking-[0.16em] ${headingColor ? "" : accent} ${headingBorder}`}>{title}</h3>{children}</section>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-3 border-b border-slate-100 py-1.5"><span className="font-semibold text-slate-400">{label}</span><span className="break-words text-right font-bold text-slate-700">{value}</span></div>;
}

function SelectInput({ label, value, onChange, options }: {
  label: string; value: string; onChange: (value: string) => void; options: string[];
}) {
  return <label className="grid gap-1.5"><span className="text-xs font-bold text-slate-500">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800">
      <option value="">Choose {label.toLowerCase()}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>;
}

function Input({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (value: string) => void; placeholder?: string;
}) {
  return <label className="grid gap-1.5"><span className="text-xs font-bold text-slate-500">{label}</span>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
  </label>;
}
