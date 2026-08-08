"use client";

import React, { useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Download,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UserRound,
  Palette,
  Upload,
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

type TemplateId =
  | "blue"
  | "common"
  | "navy"
  | "dark"
  | "ats"
  | "corporate";

const templates: {
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
}[] = [
  {
    id: "blue",
    name: "Professional Blue",
    description: "Blue sidebar with a modern professional layout",
    accent: "from-blue-800 to-blue-600",
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
    description: "Strong navy sidebar with clean white content",
    accent: "from-blue-950 to-blue-700",
  },
  {
    id: "dark",
    name: "Elegant Dark",
    description: "Dark profile column with premium resume styling",
    accent: "from-slate-950 to-slate-700",
  },
  {
    id: "ats",
    name: "ATS Readable",
    description: "Simple structure designed for easy scanning",
    accent: "from-slate-700 to-slate-500",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Professional sidebar with compact sections",
    accent: "from-blue-950 to-cyan-700",
  },
];

export default function ResumeStudio({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [name, setName] = useState("Your Name");
  const [jobTitle, setJobTitle] = useState("Professional Title");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [photo, setPhoto] = useState("");

  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>("blue");

  const [education, setEducation] = useState<Education[]>([
    { id: 1, degree: "", institution: "", year: "" },
  ]);

  const [experience, setExperience] = useState<Experience[]>([
    {
      id: 1,
      role: "",
      company: "",
      period: "",
      description: "",
    },
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
      {
        id: Date.now(),
        degree: "",
        institution: "",
        year: "",
      },
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

  const handlePhoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const printResume = () => window.print();

  const filteredExperience = experience.filter(
    (item) => item.role || item.company || item.description
  );

  const filteredEducation = education.filter(
    (item) => item.degree || item.institution || item.year
  );

  const contactItems = [
    email && { icon: Mail, text: email },
    phone && { icon: Phone, text: phone },
    location && { icon: MapPin, text: location },
  ].filter(Boolean) as {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    text: string;
  }[];

  return (
    <div className="min-h-full bg-slate-100 p-3 text-slate-800 dark:bg-slate-950 dark:text-slate-100 sm:p-5">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-4 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100">
              Smart Akshaya
            </p>
            <h1 className="text-2xl font-black">Resume Studio</h1>
            <p className="text-sm text-blue-100">
              Choose a design, enter details and download a professional resume.
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
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl font-bold text-white transition hover:bg-white/30"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[430px_minmax(0,1fr)]">
          {/* LEFT EDITOR */}
          <div className="space-y-4">
            {/* Templates */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex items-center gap-2">
                <Palette size={18} className="text-cyan-600" />
                <div>
                  <h2 className="font-black">Resume Designs</h2>
                  <p className="text-xs text-slate-400">
                    Designs based on the screenshots you provided
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {templates.map((template) => {
                  const active = selectedTemplate === template.id;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`overflow-hidden rounded-xl border-2 text-left transition ${
                        active
                          ? "border-cyan-500 ring-2 ring-cyan-100"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <TemplateThumbnail
                        template={template.id}
                        photo={photo}
                      />
                      <div className="bg-white p-2 dark:bg-slate-900">
                        <p className="text-xs font-black text-slate-800 dark:text-white">
                          {template.name}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-400">
                          {template.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Personal */}
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Email" value={email} onChange={setEmail} />
                  <Input label="Phone" value={phone} onChange={setPhone} />
                </div>

                <Input
                  label="Location"
                  value={location}
                  onChange={setLocation}
                />

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 hover:border-cyan-400 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm dark:bg-slate-700">
                    {photo ? (
                      <img
                        src={photo}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={22} className="text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-black text-slate-700 dark:text-slate-200">
                      Profile Photo
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Optional — JPG / PNG
                    </p>
                  </div>

                  <Upload size={17} className="text-cyan-600" />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhoto(e.target.files?.[0])}
                  />
                </label>
              </div>
            </section>

            {/* Summary */}
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

            {/* Experience */}
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

            {/* Education */}
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

            {/* Skills */}
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
          </div>

          {/* LIVE PREVIEW */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Live Preview
                </p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {templates.find((item) => item.id === selectedTemplate)?.name}
                </p>
              </div>

              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
                A4 Resume
              </span>
            </div>

            <div className="overflow-auto rounded-2xl bg-slate-300 p-3 shadow-inner dark:bg-slate-800 sm:p-5">
              <article
                id="resume-print"
                className="mx-auto w-full max-w-[820px] overflow-hidden bg-white text-slate-800 shadow-2xl"
              >
                <ResumeDesign
                  template={selectedTemplate}
                  name={name}
                  jobTitle={jobTitle}
                  email={email}
                  phone={phone}
                  location={location}
                  summary={summary}
                  skills={skillsList}
                  education={filteredEducation}
                  experience={filteredExperience}
                  photo={photo}
                  contactItems={contactItems}
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
  summary,
  skills,
  education,
  experience,
  photo,
  contactItems,
}: {
  template: TemplateId;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  photo: string;
  contactItems: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    text: string;
  }[];
}) {
  if (template === "common") {
    return (
      <div className="min-h-[1100px] p-10 font-sans">
        <header className="border-b-[10px] border-slate-300 pb-6">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
                {name || "YOUR NAME"}
              </h1>
              <p className="mt-1 text-lg font-bold text-slate-500">
                {jobTitle || "PROFESSIONAL TITLE"}
              </p>
            </div>
            {photo && <ProfilePhoto src={photo} size="lg" />}
          </div>

          <ContactLine items={contactItems} className="mt-4" />
        </header>

        <div className="grid gap-8 pt-7 md:grid-cols-[1.5fr_1fr]">
          <main>
            <ClassicSection title="Professional Summary">
              <TextOrPlaceholder text={summary} />
            </ClassicSection>

            <ClassicSection title="Work Experience">
              <ExperienceList
                experience={experience}
                accent="slate"
              />
            </ClassicSection>
          </main>

          <aside>
            <ClassicSection title="Education">
              <EducationList education={education} />
            </ClassicSection>

            <ClassicSection title="Skills">
              <SkillList skills={skills} variant="plain" />
            </ClassicSection>
          </aside>
        </div>
      </div>
    );
  }

  if (template === "ats") {
    return (
      <div className="min-h-[1100px] p-11 font-sans text-[13px]">
        <header className="border-b border-slate-800 pb-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <h1 className="text-3xl font-black uppercase text-slate-900">
                {name || "YOUR NAME"}
              </h1>
              <p className="mt-1 font-bold text-slate-700">
                {jobTitle || "PROFESSIONAL TITLE"}
              </p>
            </div>
            {photo && <ProfilePhoto src={photo} size="md" />}
          </div>
          <ContactLine items={contactItems} className="mt-3 text-[11px]" />
        </header>

        <section className="mt-6">
          <AtsTitle title="PROFESSIONAL SUMMARY" />
          <TextOrPlaceholder text={summary} compact />
        </section>

        <section className="mt-6">
          <AtsTitle title="PROFESSIONAL EXPERIENCE" />
          <ExperienceList experience={experience} accent="ats" />
        </section>

        <section className="mt-6">
          <AtsTitle title="EDUCATION" />
          <EducationList education={education} compact />
        </section>

        <section className="mt-6">
          <AtsTitle title="CORE COMPETENCIES" />
          <SkillList skills={skills} variant="ats" />
        </section>
      </div>
    );
  }

  const sidebarClass =
    template === "dark"
      ? "bg-slate-950"
      : template === "corporate"
        ? "bg-blue-950"
        : "bg-blue-900";

  const accentText =
    template === "dark" ? "text-amber-300" : "text-cyan-300";

  return (
    <div className="grid min-h-[1100px] grid-cols-[30%_70%] font-sans">
      <aside className={`${sidebarClass} p-6 text-white`}>
        <div className="mb-6 flex justify-center">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="h-28 w-28 rounded-full border-4 border-white/80 object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/20 bg-white/10">
              <UserRound size={48} className="text-white/70" />
            </div>
          )}
        </div>

        <h1 className="text-center text-2xl font-black leading-tight">
          {name || "YOUR NAME"}
        </h1>

        <p className={`mt-2 text-center text-xs font-bold uppercase tracking-wider ${accentText}`}>
          {jobTitle || "PROFESSIONAL TITLE"}
        </p>

        <SidebarSection title="CONTACT">
          <SidebarContact items={contactItems} />
        </SidebarSection>

        <SidebarSection title="SKILLS">
          <SidebarSkills skills={skills} />
        </SidebarSection>

        <SidebarSection title="EDUCATION">
          {education.length ? (
            <div className="space-y-3">
              {education.map((item) => (
                <div key={item.id}>
                  <p className="text-xs font-black">
                    {item.degree || "Qualification"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/70">
                    {item.institution}
                  </p>
                  <p className="text-[10px] text-white/50">{item.year}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-white/50">Add education details</p>
          )}
        </SidebarSection>
      </aside>

      <main className="bg-white p-8">
        <section>
          <SectionHeading
            title="Professional Profile"
            dark={template === "dark"}
          />
          <TextOrPlaceholder text={summary} />
        </section>

        <section className="mt-7">
          <SectionHeading title="Work Experience" dark={template === "dark"} />
          <ExperienceList
            experience={experience}
            accent={template === "dark" ? "dark" : "blue"}
          />
        </section>

        <section className="mt-7">
          <SectionHeading title="Education" dark={template === "dark"} />
          <EducationList education={education} />
        </section>
      </main>
    </div>
  );
}

function TemplateThumbnail({
  template,
  photo,
}: {
  template: TemplateId;
  photo: string;
}) {
  if (template === "common") {
    return (
      <div className="h-28 bg-white p-2">
        <div className="flex justify-between border-b-4 border-slate-300 pb-2">
          <div>
            <div className="h-2 w-20 rounded bg-slate-800" />
            <div className="mt-1 h-1.5 w-14 rounded bg-slate-400" />
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-200" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-slate-300" />
            <div className="h-1.5 w-4/5 bg-slate-200" />
            <div className="h-1.5 w-full bg-slate-200" />
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-slate-300" />
            <div className="h-1.5 w-4/5 bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (template === "ats") {
    return (
      <div className="h-28 bg-white p-3">
        <div className="h-2 w-24 bg-slate-900" />
        <div className="mt-1 h-1 w-16 bg-slate-500" />
        <div className="mt-2 h-px bg-slate-800" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="mt-2 h-1.5 w-full bg-slate-200" />
        ))}
      </div>
    );
  }

  const sidebar =
    template === "dark"
      ? "bg-slate-950"
      : template === "corporate"
        ? "bg-blue-950"
        : "bg-blue-900";

  return (
    <div className="grid h-28 grid-cols-[30%_70%] bg-white">
      <div className={`${sidebar} p-2`}>
        <div className="mx-auto h-9 w-9 rounded-full border-2 border-white/70 bg-white/20" />
        <div className="mx-auto mt-2 h-1.5 w-12 rounded bg-white/70" />
        <div className="mx-auto mt-1 h-1 w-9 rounded bg-white/40" />
        <div className="mt-4 space-y-1">
          <div className="h-1 w-full bg-white/30" />
          <div className="h-1 w-4/5 bg-white/20" />
          <div className="h-1 w-full bg-white/20" />
        </div>
      </div>
      <div className="p-3">
        <div className="h-2 w-24 bg-slate-800" />
        <div className="mt-1 h-1.5 w-16 bg-blue-600" />
        <div className="mt-4 h-1.5 w-full bg-slate-300" />
        <div className="mt-2 h-1.5 w-5/6 bg-slate-200" />
        <div className="mt-2 h-1.5 w-full bg-slate-200" />
        <div className="mt-4 h-1.5 w-20 bg-slate-700" />
        <div className="mt-2 h-1.5 w-full bg-slate-200" />
      </div>
    </div>
  );
}

function ProfilePhoto({
  src,
  size = "md",
}: {
  src: string;
  size?: "md" | "lg";
}) {
  return (
    <img
      src={src}
      alt="Profile"
      className={`rounded-full border border-slate-200 object-cover ${
        size === "lg" ? "h-20 w-20" : "h-14 w-14"
      }`}
    />
  );
}

function ContactLine({
  items,
  className = "",
}: {
  items: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    text: string;
  }[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 ${className}`}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <span key={index} className="inline-flex items-center gap-1">
            <Icon size={12} />
            {item.text}
          </span>
        );
      })}
    </div>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h2 className="mb-2 border-b border-white/20 pb-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SidebarContact({
  items,
}: {
  items: {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    text: string;
  }[];
}) {
  return (
    <div className="space-y-2">
      {items.length ? (
        items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex gap-2 text-[10px] leading-4 text-white/75">
              <Icon size={12} className="mt-0.5 shrink-0" />
              <span className="break-all">{item.text}</span>
            </div>
          );
        })
      ) : (
        <p className="text-[10px] text-white/40">Add contact details</p>
      )}
    </div>
  );
}

function SidebarSkills({ skills }: { skills: string[] }) {
  if (!skills.length) {
    return <p className="text-[10px] text-white/40">Add skills</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <span
          key={skill}
          className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-[9px] font-bold text-white/90"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function SectionHeading({
  title,
  dark = false,
}: {
  title: string;
  dark?: boolean;
}) {
  return (
    <h2
      className={`mb-3 border-b-2 pb-2 text-xs font-black uppercase tracking-[0.16em] ${
        dark
          ? "border-slate-300 text-slate-900"
          : "border-blue-100 text-blue-800"
      }`}
    >
      {title}
    </h2>
  );
}

function ClassicSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 bg-slate-200 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-800">
        {title}
      </h2>
      {children}
    </section>
  );
}

function AtsTitle({ title }: { title: string }) {
  return (
    <h2 className="mb-3 border-b border-slate-800 pb-1 text-xs font-black tracking-wider text-slate-900">
      {title}
    </h2>
  );
}

function TextOrPlaceholder({
  text,
  compact = false,
}: {
  text: string;
  compact?: boolean;
}) {
  return (
    <p
      className={`whitespace-pre-line leading-6 text-slate-600 ${
        compact ? "text-[12px]" : "text-sm"
      }`}
    >
      {text || "Professional summary will appear here once you enter it."}
    </p>
  );
}

function ExperienceList({
  experience,
  accent,
}: {
  experience: Experience[];
  accent: "blue" | "dark" | "slate" | "ats";
}) {
  if (!experience.length) {
    return (
      <p className="text-xs text-slate-400">
        Add your work experience from the editor.
      </p>
    );
  }

  const accentClass =
    accent === "blue"
      ? "text-blue-800"
      : accent === "dark"
        ? "text-slate-800"
        : "text-slate-700";

  return (
    <div className="space-y-5">
      {experience.map((item) => (
        <div key={item.id}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h3 className={`font-black ${accentClass}`}>
                {item.role || "Professional Role"}
              </h3>
              <p className="text-xs font-bold text-slate-500">
                {item.company || "Company"}
              </p>
            </div>

            {item.period && (
              <span className="text-[10px] font-bold text-slate-400">
                {item.period}
              </span>
            )}
          </div>

          {item.description && (
            <p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationList({
  education,
  compact = false,
}: {
  education: Education[];
  compact?: boolean;
}) {
  if (!education.length) {
    return (
      <p className="text-xs text-slate-400">
        Add education details from the editor.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {education.map((item) => (
        <div key={item.id} className="flex justify-between gap-4">
          <div>
            <h3 className="font-black text-slate-800">
              {item.degree || "Qualification"}
            </h3>
            <p className={`${compact ? "text-[11px]" : "text-xs"} text-slate-500`}>
              {item.institution || "Institution"}
            </p>
          </div>

          {item.year && (
            <span className="shrink-0 text-[10px] font-bold text-slate-400">
              {item.year}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function SkillList({
  skills,
  variant,
}: {
  skills: string[];
  variant: "plain" | "ats";
}) {
  if (!skills.length) {
    return <p className="text-xs text-slate-400">Add your skills.</p>;
  }

  return (
    <div
      className={
        variant === "ats"
          ? "grid grid-cols-2 gap-x-6 gap-y-2 text-xs"
          : "flex flex-wrap gap-x-5 gap-y-2"
      }
    >
      {skills.map((skill) => (
        <span
          key={skill}
          className={
            variant === "ats"
              ? "font-semibold text-slate-700"
              : "text-xs font-semibold text-slate-600"
          }
        >
          {variant === "ats" ? `• ${skill}` : skill}
        </span>
      ))}
    </div>
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
