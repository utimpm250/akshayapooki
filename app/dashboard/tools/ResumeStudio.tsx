"use client";

import React, { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Palette,
  Phone,
  Plus,
  Trash2,
  UserRound,
  X,
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

type TemplateId = "blue" | "common" | "navy" | "dark" | "ats" | "corporate";

type Template = {
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
};

const templates: Template[] = [
  {
    id: "blue",
    name: "Professional Blue",
    description: "Modern blue header with a clean professional layout",
    accent: "from-blue-800 to-cyan-600",
  },
  {
    id: "common",
    name: "Common",
    description: "Clean grey header and simple two-column sections",
    accent: "from-slate-500 to-slate-700",
  },
  {
    id: "navy",
    name: "Modern Navy",
    description: "Strong navy profile column with white content",
    accent: "from-blue-950 to-blue-700",
  },
  {
    id: "dark",
    name: "Elegant Dark",
    description: "Premium dark profile panel with refined typography",
    accent: "from-slate-950 to-slate-700",
  },
  {
    id: "ats",
    name: "ATS Readable",
    description: "Simple single-column format designed for easy scanning",
    accent: "from-slate-700 to-slate-500",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Compact corporate layout with a professional sidebar",
    accent: "from-cyan-800 to-blue-950",
  },
];

type ResumeStudioProps = {
  onClose?: () => void;
};

export default function ResumeStudio({ onClose }: ResumeStudioProps) {
  const [name, setName] = useState("Your Name");
  const [jobTitle, setJobTitle] = useState("Professional Title");
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
  const [showTemplates, setShowTemplates] = useState(true);

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

  const printResume = () => window.print();

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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={printResume}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-blue-700 shadow-lg transition hover:bg-blue-50"
            >
              <Download size={17} />
              Download / Print
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Resume Studio"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-slate-600 shadow-lg transition hover:bg-white hover:text-slate-900"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center gap-2">
                <UserRound size={18} className="text-cyan-600" />
                <h2 className="font-black">Personal Details</h2>
              </div>

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
                      reader.onload = () => setPhoto(String(reader.result || ""));
                      reader.readAsDataURL(file);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 font-black">Basic Details</h2>
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
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 font-black">Professional Summary</h2>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={5}
                placeholder="Write a short professional summary..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </section>

            

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-black">Languages Known</h2>
                  <p className="text-[11px] text-slate-400">Add language and proficiency level</p>
                </div>
                <button
                  type="button"
                  onClick={addLanguage}
                  className="rounded-lg bg-cyan-50 p-2 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/40"
                >
                  <Plus size={16} />
                </button>
              </div>

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
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness size={18} className="text-cyan-600" />
                  <h2 className="font-black">Work Experience</h2>
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="rounded-lg bg-cyan-50 p-2 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/40"
                  aria-label="Add work experience"
                >
                  <Plus size={16} />
                </button>
              </div>

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
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-cyan-600" />
                  <h2 className="font-black">Education</h2>
                </div>

                <button
                  type="button"
                  onClick={addEducation}
                  className="rounded-lg bg-cyan-50 p-2 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/40"
                  aria-label="Add education"
                >
                  <Plus size={16} />
                </button>
              </div>

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
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-black">Projects Details</h2>
                  <p className="text-[11px] text-slate-400">Add projects and short descriptions</p>
                </div>
                <button
                  type="button"
                  onClick={addProject}
                  className="rounded-lg bg-cyan-50 p-2 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-950/40"
                >
                  <Plus size={16} />
                </button>
              </div>

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
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 font-black">Skills</h2>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={3}
                placeholder="Communication, MS Office, Photoshop, Customer Service..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800"
              />
            </section>
<section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-cyan-600" />
                  <div>
                    <h2 className="font-black">Resume Templates</h2>
                    <p className="text-[11px] text-slate-400">
                      Choose a design — preview updates instantly
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTemplates((value) => !value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {showTemplates ? "Hide" : "Show"}
                </button>
              </div>

              {showTemplates && (
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
              )}
            </section>
          </div>

          <div className="lg:sticky lg:top-4 lg:self-start">
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
                />
              </article>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
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
  template,
  name,
  jobTitle,
  email,
  phone,
  location,
  fatherName,
  gender,
  dob,
  maritalStatus,
  nationality,
  religion,
  passport,
  photo,
  summary,
  skillsList,
  languages,
  projects,
  education,
  experience,
}: {
  template: TemplateId;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  fatherName: string;
  gender: string;
  dob: string;
  maritalStatus: string;
  nationality: string;
  religion: string;
  passport: string;
  photo: string;
  summary: string;
  skillsList: string[];
  languages: Language[];
  projects: Project[];
  education: Education[];
  experience: Experience[];
}) {
  if (template === "navy") {
    return (
      <div className="grid min-h-[900px] grid-cols-[220px_1fr] bg-white">
        <aside className="bg-gradient-to-b from-blue-950 to-blue-800 p-7 text-white">
          <div className="mb-8">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-3xl font-black">
              {(name || "Y").charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-black leading-tight">
              {name || "Your Name"}
            </h1>
            <p className="mt-1 text-sm font-semibold text-cyan-200">
              {jobTitle || "Professional Title"}
            </p>
          </div>

          <ContactBlock
            email={email}
            phone={phone}
            location={location}
            light
          />

          {skillsList.length > 0 && (
            <div className="mt-8">
              <SideTitle>Skills</SideTitle>
              <div className="space-y-2">
                {skillsList.map((skill) => (
                  <div
                    key={skill}
                    className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="p-8 sm:p-10">
          <ResumeBody
            summary={summary}
            experience={experience}
            education={education}
            languages={languages}
            projects={projects}
            fatherName={fatherName}
            gender={gender}
            dob={dob}
            maritalStatus={maritalStatus}
            nationality={nationality}
            religion={religion}
            passport={passport}
            skillsList={[]}
            accent="text-blue-800"
            headingBorder="border-blue-200"
          />
        </main>
      </div>
    );
  }

  if (template === "dark") {
    return (
      <div className="min-h-[900px] bg-white">
        <header className="bg-slate-950 px-8 py-9 text-white sm:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">
                Professional Resume
              </p>
              <h1 className="text-4xl font-black tracking-tight">
                {name || "Your Name"}
              </h1>
              <p className="mt-2 text-lg font-semibold text-slate-300">
                {jobTitle || "Professional Title"}
              </p>
            </div>
            <ContactBlock
              email={email}
              phone={phone}
              location={location}
              light
              compact
            />
          </div>
        </header>

        <main className="grid gap-8 p-8 sm:grid-cols-[1fr_220px] sm:p-10">
          <ResumeBody
            summary={summary}
            experience={experience}
            education={education}
            languages={languages}
            projects={projects}
            fatherName={fatherName}
            gender={gender}
            dob={dob}
            maritalStatus={maritalStatus}
            nationality={nationality}
            religion={religion}
            passport={passport}
            skillsList={skillsList}
            accent="text-slate-900"
            headingBorder="border-slate-300"
          />
          <aside className="border-l border-slate-200 pl-6">
            <SideTitle dark>Skills</SideTitle>
            <div className="flex flex-wrap gap-2">
              {skillsList.length > 0 ? (
                skillsList.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">
                  Add skills from the editor.
                </span>
              )}
            </div>
          </aside>
        </main>
      </div>
    );
  }

  if (template === "common") {
    return (
      <div className="min-h-[900px] bg-white">
        <header className="border-b-8 border-slate-600 bg-slate-100 px-8 py-7 sm:px-10">
          <h1 className="text-3xl font-black text-slate-900">
            {name || "Your Name"}
          </h1>
          <p className="mt-1 text-base font-bold text-slate-600">
            {jobTitle || "Professional Title"}
          </p>
          <ContactBlock
            email={email}
            phone={phone}
            location={location}
            className="mt-4 text-slate-500"
          />
        </header>

        <div className="grid gap-8 p-8 sm:grid-cols-[1fr_210px] sm:p-10">
          <ResumeBody
            summary={summary}
            experience={experience}
            education={education}
            languages={languages}
            projects={projects}
            fatherName={fatherName}
            gender={gender}
            dob={dob}
            maritalStatus={maritalStatus}
            nationality={nationality}
            religion={religion}
            passport={passport}
            skillsList={skillsList}
            accent="text-slate-700"
            headingBorder="border-slate-300"
          />
          <aside>
            <SideTitle dark>Core Skills</SideTitle>
            <div className="space-y-2">
              {skillsList.map((skill) => (
                <div
                  key={skill}
                  className="border-l-4 border-slate-500 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
                >
                  {skill}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (template === "ats") {
    return (
      <div className="min-h-[900px] bg-white p-8 text-slate-900 sm:p-10">
        <header className="border-b-2 border-slate-900 pb-5 text-center">
          <h1 className="text-3xl font-black">
            {name || "Your Name"}
          </h1>
          <p className="mt-1 font-bold">{jobTitle || "Professional Title"}</p>
          <ContactBlock
            email={email}
            phone={phone}
            location={location}
            centered
            className="mt-3 text-slate-600"
          />
        </header>

        <ResumeBody
          summary={summary}
          experience={experience}
          education={education}
          skillsList={skillsList}
          accent="text-slate-900"
          headingBorder="border-slate-900"
          compact
        />
      </div>
    );
  }

  if (template === "corporate") {
    return (
      <div className="grid min-h-[900px] grid-cols-[190px_1fr] bg-white">
        <aside className="bg-cyan-950 p-6 text-white">
          <div className="mb-8 h-16 w-16 rounded-full border-4 border-cyan-300 bg-cyan-800 p-3 text-center text-2xl font-black">
            {(name || "Y").charAt(0).toUpperCase()}
          </div>

          <h1 className="text-xl font-black leading-tight">
            {name || "Your Name"}
          </h1>
          <p className="mt-1 text-xs font-semibold text-cyan-200">
            {jobTitle || "Professional Title"}
          </p>

          <ContactBlock
            email={email}
            phone={phone}
            location={location}
            light
            compact
            className="mt-7"
          />

          <div className="mt-7">
            <SideTitle>Skills</SideTitle>
            <div className="space-y-1.5">
              {skillsList.map((skill) => (
                <p key={skill} className="text-xs font-semibold text-cyan-50">
                  • {skill}
                </p>
              ))}
            </div>
          </div>
        </aside>

        <main className="p-7 sm:p-9">
          <ResumeBody
            summary={summary}
            experience={experience}
            education={education}
            languages={languages}
            projects={projects}
            fatherName={fatherName}
            gender={gender}
            dob={dob}
            maritalStatus={maritalStatus}
            nationality={nationality}
            religion={religion}
            passport={passport}
            skillsList={[]}
            accent="text-cyan-900"
            headingBorder="border-cyan-200"
          />
        </main>
      </div>
    );
  }

  // Professional Blue — default design
  return (
    <div className="min-h-[900px] bg-white">
      <header className="bg-gradient-to-r from-blue-800 to-cyan-600 px-8 py-8 text-white sm:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100">
              Professional Resume
            </p>
            <h1 className="text-4xl font-black tracking-tight">
              {name || "Your Name"}
            </h1>
            <p className="mt-1 text-lg font-semibold text-blue-100">
              {jobTitle || "Professional Title"}
            </p>
          </div>

          <ContactBlock
            email={email}
            phone={phone}
            location={location}
            light
            compact
          />
        </div>
      </header>

      <div className="grid gap-8 p-8 sm:grid-cols-[1fr_220px] sm:p-10">
        <ResumeBody
          summary={summary}
          experience={experience}
          education={education}
          skillsList={[]}
          accent="text-blue-800"
          headingBorder="border-cyan-200"
        />

        <aside className="rounded-2xl bg-slate-50 p-5">
          <SideTitle dark>Skills</SideTitle>
          <div className="flex flex-wrap gap-2">
            {skillsList.length > 0 ? (
              skillsList.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-800 shadow-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">
                Add skills from the editor.
              </span>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ResumeBody({
  summary,
  experience,
  education,
  languages = [],
  projects = [],
  fatherName = "",
  gender = "",
  dob = "",
  maritalStatus = "",
  nationality = "",
  religion = "",
  passport = "",
  skillsList,
  accent,
  headingBorder,
  compact = false,
}: {
  summary: string;
  experience: Experience[];
  education: Education[];
  languages?: Language[];
  projects?: Project[];
  fatherName?: string;
  gender?: string;
  dob?: string;
  maritalStatus?: string;
  nationality?: string;
  religion?: string;
  passport?: string;
  skillsList: string[];
  accent: string;
  headingBorder: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-5" : "space-y-7"}>
      {(fatherName || gender || dob || maritalStatus || nationality || religion || passport) && (
        <ResumeSection
          title="Personal Information"
          accent={accent}
          headingBorder={headingBorder}
        >
          <div className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {fatherName && <InfoRow label="Father's Name" value={fatherName} />}
            {gender && <InfoRow label="Gender" value={gender} />}
            {dob && <InfoRow label="Date of Birth" value={dob} />}
            {maritalStatus && <InfoRow label="Marital Status" value={maritalStatus} />}
            {nationality && <InfoRow label="Nationality" value={nationality} />}
            {religion && <InfoRow label="Religion" value={religion} />}
            {passport && <InfoRow label="Passport Number" value={passport} />}
          </div>
        </ResumeSection>
      )}

      {summary && (
        <ResumeSection
          title="Professional Summary"
          accent={accent}
          headingBorder={headingBorder}
        >
          <p className="text-sm leading-6 text-slate-600">{summary}</p>
        </ResumeSection>
      )}

      {experience.some((item) => item.role || item.company) && (
        <ResumeSection
          title="Experience"
          accent={accent}
          headingBorder={headingBorder}
        >
          <div className={compact ? "space-y-4" : "space-y-5"}>
            {experience
              .filter((item) => item.role || item.company)
              .map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-black text-slate-900">
                        {item.role || "Role"}
                      </h3>
                      {item.company && (
                        <p className={`text-sm font-bold ${accent}`}>
                          {item.company}
                        </p>
                      )}
                    </div>
                    {item.period && (
                      <span className="text-xs font-semibold text-slate-400">
                        {item.period}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </ResumeSection>
      )}

      {education.some((item) => item.degree || item.institution) && (
        <ResumeSection
          title="Education"
          accent={accent}
          headingBorder={headingBorder}
        >
          <div className="space-y-3">
            {education
              .filter((item) => item.degree || item.institution)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <h3 className="font-black text-slate-900">
                      {item.degree || "Degree / Course"}
                    </h3>
                    {item.institution && (
                      <p className="text-sm text-slate-600">
                        {item.institution}
                      </p>
                    )}
                  </div>
                  {item.year && (
                    <span className="text-xs font-semibold text-slate-400">
                      {item.year}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </ResumeSection>
      )}

      {projects.some((item) => item.title || item.description) && (
        <ResumeSection
          title="Projects"
          accent={accent}
          headingBorder={headingBorder}
        >
          <div className="space-y-4">
            {projects
              .filter((item) => item.title || item.description)
              .map((item) => (
                <div key={item.id}>
                  <h3 className="font-black text-slate-900">
                    {item.title || "Project"}
                  </h3>
                  {item.description && (
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </ResumeSection>
      )}

      {languages.some((item) => item.language) && (
        <ResumeSection
          title="Languages"
          accent={accent}
          headingBorder={headingBorder}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {languages
              .filter((item) => item.language)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="text-sm font-bold text-slate-700">
                    {item.language}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {item.level}
                  </span>
                </div>
              ))}
          </div>
        </ResumeSection>
      )}

      {skillsList.length > 0 && (
        <ResumeSection
          title="Skills"
          accent={accent}
          headingBorder={headingBorder}
        >
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </ResumeSection>
      )}
    </div>
  );
}

function ContactBlock({
  email,
  phone,
  location,
  light = false,
  compact = false,
  centered = false,
  className = "",
}: {
  email: string;
  phone: string;
  location: string;
  light?: boolean;
  compact?: boolean;
  centered?: boolean;
  className?: string;
}) {
  const items = [
    email ? { icon: <Mail size={compact ? 12 : 13} />, value: email } : null,
    phone ? { icon: <Phone size={compact ? 12 : 13} />, value: phone } : null,
    location
      ? { icon: <MapPin size={compact ? 12 : 13} />, value: location }
      : null,
  ].filter(Boolean) as { icon: React.ReactNode; value: string }[];

  if (!items.length) return null;

  return (
    <div
      className={`flex flex-wrap gap-x-4 gap-y-2 text-xs ${
        centered ? "justify-center" : ""
      } ${light ? "text-slate-200" : "text-slate-500"} ${className}`}
    >
      {items.map((item) => (
        <span key={item.value} className="inline-flex items-center gap-1.5">
          {item.icon}
          {item.value}
        </span>
      ))}
    </div>
  );
}

function SideTitle({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <h3
      className={`mb-3 border-b pb-2 text-[10px] font-black uppercase tracking-[0.18em] ${
        dark
          ? "border-slate-200 text-slate-700"
          : "border-white/20 text-cyan-200"
      }`}
    >
      {children}
    </h3>
  );
}

function ResumeSection({
  title,
  children,
  accent,
  headingBorder,
}: {
  title: string;
  children: React.ReactNode;
  accent: string;
  headingBorder: string;
}) {
  return (
    <section>
      <h3
        className={`mb-3 border-b pb-2 text-xs font-black uppercase tracking-[0.16em] ${accent} ${headingBorder}`}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}


function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-3 border-b border-slate-100 py-1.5">
      <span className="font-semibold text-slate-400">{label}</span>
      <span className="text-right font-bold text-slate-700">{value}</span>
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800"
      >
        <option value="">Choose {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-800"
      />
    </label>
  );
}
