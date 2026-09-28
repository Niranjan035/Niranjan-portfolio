/**
 * portfolio.ts
 * ---------------------------------------------------------------------------
 * Single source of truth for every piece of content on the site.
 *
 * NOTHING in this file is invented. If a fact is unknown (profile URLs, the
 * resume PDF, project images, the Shoonya write-up) it is either left as an
 * empty string, set to `false`, or represented as a labelled placeholder.
 * The UI reads these values and degrades gracefully.
 *
 * To update the site later, edit this file only — no component changes needed.
 */

/* ========================================================================== */
/* Identity                                                                    */
/* ========================================================================== */

export const identity = {
  name: 'Niranjan Hiremath',
  firstName: 'Niranjan',
  role: 'Software Developer & Full-Stack Developer',
  roleShort: 'Software Developer',
  /** Monospace technical label shown above the hero heading. */
  heroLabel: 'SOFTWARE DEVELOPER · FULL-STACK DEVELOPER',
  tagline:
    'I build clean, practical web applications with a focus on backend development, problem solving, and scalable systems.',
  /**
   * Deliberately empty. Both colleges below are in Raichur, but that is not the
   * same as a confirmed home base, and the site should not claim one. Set this to
   * a value like 'Bengaluru, India' and the "Based in" rows on the about,
   * contact and footer render again automatically.
   */
  location: '',
  /**
   * Also deliberately empty. A response-time promise is a commitment, so it is
   * only shown once one has actually been decided on.
   */
  responseTime: '',
  /** Plain address — used for mailto links and displayed on the contact page. */
  email: 'niranjanhiremath11@gmail.com',
  availableForWork: true,
} as const

/* ========================================================================== */
/* Profile links                                                               */
/* ---------------------------------------------------------------------------- */
/* URLs below were supplied directly by Niranjan and are used verbatim.        */
/* The SocialLinks component still hides an empty URL in production, so no     */
/* placeholder can ever render as if it were a real profile.                   */
/* ========================================================================== */

export const profileLinks = {
  linkedin: 'https://www.linkedin.com/in/niranjan-hiremath-88786b250',
  github: 'https://github.com/Niranjan035',
  leetcode: 'https://leetcode.com/u/Trizen_x/',
  email: 'mailto:niranjanhiremath11@gmail.com',
} as const

export type ProfileLinkKey = keyof typeof profileLinks

/** Only the three external profile networks are optional. Email is always set. */
export const socialLinkKeys: ProfileLinkKey[] = ['linkedin', 'github', 'leetcode']

/** Display metadata for each social network. Icons are rendered by SocialLinks. */
export const socialMeta: Record<
  ProfileLinkKey,
  { label: string; handle: string; accessibleLabel: string }
> = {
  linkedin: {
    label: 'LinkedIn',
    handle: 'View profile',
    accessibleLabel: 'LinkedIn profile of Niranjan Hiremath (opens in a new tab)',
  },
  github: {
    label: 'GitHub',
    handle: 'View profile',
    accessibleLabel: 'GitHub profile of Niranjan Hiremath (opens in a new tab)',
  },
  leetcode: {
    label: 'LeetCode',
    handle: 'View profile',
    accessibleLabel: 'LeetCode profile of Niranjan Hiremath (opens in a new tab)',
  },
  email: {
    label: 'Email',
    handle: identity.email,
    accessibleLabel: 'Send an email to Niranjan Hiremath',
  },
}

/** True when a link has a real, non-empty URL configured. */
export function hasProfileLink(key: ProfileLinkKey): boolean {
  const value = profileLinks[key]
  return typeof value === 'string' && value.trim().length > 0
}

/** The subset of social links that are actually configured. */
export function configuredSocialLinks(): ProfileLinkKey[] {
  return socialLinkKeys.filter(hasProfileLink)
}

/* ========================================================================== */
/* Resume                                                                     */
/* ---------------------------------------------------------------------------- */
/* A temporary resume PDF is published so the Resume page and download can be  */
/* tested end to end. `available: true` makes ResumeButton render a real       */
/* download link instead of the "coming soon" state.                          */
/*                                                                            */
/* NOTE: the PDF is content-only, not the source of truth for this file. When  */
/* the final resume arrives, synchronise the fields deliberately - do not let  */
/* the document silently overwrite the approved portfolio content.            */
/* ========================================================================== */

export const resume = {
  /** Path relative to the site root (served from frontend/public/resume). */
  fileName: 'Niranjan-Hiremath-Resume.pdf',
  path: '/resume/Niranjan-Hiremath-Resume.pdf',
  /** True because the PDF is present in frontend/public/resume. */
  available: true,
  /** Shown whenever `available` is false. */
  unavailableMessage: 'Resume coming soon.',
  summary:
    'A concise overview of my education, skills, projects, and achievements.',
} as const

/* ========================================================================== */
/* Technology strip (hero)                                                     */
/* ========================================================================== */

export const heroTechLine: string[] = [
  'Java',
  'Spring Boot',
  'Python',
  'Django',
  'React',
  'SQL',
]

/* ========================================================================== */
/* Skills                                                                     */
/* ---------------------------------------------------------------------------- */
/* `id` values map to the filter keys on the /skills page. No proficiency      */
/* percentages exist anywhere in this project — skills are listed, not scored. */
/* ========================================================================== */

export type SkillCategoryId =
  | 'languages'
  | 'backend'
  | 'frontend'
  | 'database'
  | 'core'
  | 'tools'

export interface SkillCategory {
  id: SkillCategoryId
  title: string
  /** Monospace label, e.g. "01 — LANGUAGES". */
  label: string
  description: string
  items: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    title: 'Programming Languages',
    label: '01 — LANGUAGES',
    description: 'Languages I write application and algorithmic code in.',
    items: ['Java', 'Python', 'JavaScript', 'C++'],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    label: '02 — BACKEND',
    description: 'Server-side frameworks and API design.',
    items: ['Spring Boot', 'Django', 'Node.js', 'REST APIs'],
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    label: '03 — FRONTEND',
    description: 'Interfaces built to stay readable and fast.',
    items: ['HTML', 'CSS', 'React'],
  },
  {
    id: 'database',
    title: 'Databases',
    label: '04 — DATABASE',
    description: 'Relational modelling, queries, and DBMS fundamentals.',
    items: ['SQL', 'MySQL', 'DBMS'],
  },
  {
    id: 'core',
    title: 'Core Computer Science',
    label: '05 — CORE CS',
    description: 'The theory underneath the frameworks.',
    items: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming',
      'Operating Systems',
      'Computer Networks',
      'System Design',
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Workflow',
    label: '06 — TOOLS',
    description: 'What I use day to day to build and ship.',
    items: ['Git', 'GitHub', 'VS Code', 'Postman'],
  },
]

/* ========================================================================== */
/* Projects                                                                    */
/* ---------------------------------------------------------------------------- */
/* Only Shoonya exists so far. Add future projects here; ProjectsPage and     */
/* ProjectCard both read from this array. No repository URL is claimed for     */
/* Shoonya, so no GitHub button is rendered.                                  */
/* ========================================================================== */

export type ProjectId = 'shoonya'

export interface GalleryImage {
  /** Set src to a real file under /public/images/shoonya to publish it. */
  src: string | null
  alt: string
  caption: string
}

export interface ComponentSpec {
  component: string
  details: string
}

export interface Project {
  id: ProjectId
  slug: string
  title: string
  type: string
  /** Short line used on cards and in the featured section. */
  summary: string
  /** Monospace component / technology chips. */
  tags: string[]
  /** Key technical facts. Rendered in mono type. */
  keyFacts: { label: string; value: string }[]
  /** No repository is public for this project yet, so the button is omitted. */
  repositoryUrl: string | null
  featured: boolean
  /** Project hero photograph, served from frontend/public/images/shoonya. */
  image: { src: string | null; alt: string }
  /** Case-study copy. Empty strings render as intentional whitespace. */
  overview: string
  hardware: { intro: string; table: ComponentSpec[] }
  buildSteps: { title: string; body: string; pending: boolean }[]
  challenges: { title: string; body: string; pending: boolean }[]
  gallery: GalleryImage[]
  learned: { title: string; body: string; pending: boolean }[]
}

export const projects: Project[] = [
  {
    id: 'shoonya',
    slug: 'shoonya',
    title: 'Shoonya',
    type: '5-inch Racing Quadcopter',
    summary: 'A 5-inch racing quadcopter — frame, flight stack, and tuning.',
    tags: ['SpeedyBee Mario 5', 'SpeedyBee F405 V4', 'Readytosky MT2204', 'Betaflight'],
    keyFacts: [
      { label: 'Platform', value: '5-inch racing quadcopter' },
      { label: 'Flight software', value: 'Betaflight' },
      { label: 'Frame', value: 'SpeedyBee Mario 5' },
      { label: 'Stack', value: 'SpeedyBee F405 V4' },
    ],
    repositoryUrl: null,
    featured: true,
    image: {
      src: '/images/shoonya/01.jpg',
      alt: 'Shoonya, a 5-inch racing quadcopter, photographed from a three-quarter angle with the battery secured on the top plate.',
    },
    overview:
      'Shoonya is a hardware build: a 5-inch racing quadcopter assembled from a SpeedyBee Mario 5 frame and a SpeedyBee F405 V4 flight controller stack, flown on Betaflight. Detailed documentation will be added here as the build and tuning notes are written up.',
    hardware: {
      intro: 'The component list, as built.',
      table: [
        { component: 'Frame', details: 'SpeedyBee Mario 5' },
        { component: 'Flight Controller / Stack', details: 'SpeedyBee F405 V4' },
        { component: 'Motors', details: 'Readytosky MT2204' },
        { component: 'Battery', details: 'Dogcom 120C 6S 1300mAh' },
        { component: 'Transmitter', details: 'FlySky FS-i6' },
        { component: 'Propellers', details: 'HQProp 5135' },
      ],
    },
    buildSteps: [
      { title: 'Frame', body: '', pending: true },
      { title: 'Electronics', body: '', pending: true },
      { title: 'Configuration', body: '', pending: true },
      { title: 'Testing', body: '', pending: true },
    ],
    challenges: [],
    gallery: [
      {
        src: '/images/shoonya/02.jpg',
        alt: 'Shoonya from a three-quarter angle, showing the frame, the battery strapped on top and the connected wiring.',
        caption: 'Frame, battery and wiring',
      },
      {
        src: '/images/shoonya/03.jpg',
        alt: 'A closer three-quarter view of Shoonya showing the front-mounted camera and its bracket.',
        caption: 'Camera and front assembly',
      },
      {
        src: '/images/shoonya/04.jpg',
        alt: 'Shoonya photographed at a three-quarter angle in a vertical frame, showing all four motors and propellers.',
        caption: 'Secondary angle',
      },
    ],
    learned: [
      { title: 'Hardware is a stack', body: '', pending: true },
      { title: 'Tuning is iteration', body: '', pending: true },
      { title: 'Documentation matters', body: '', pending: true },
    ],
  },
]

export const featuredProject: Project = projects[0] as Project

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

/* ========================================================================== */
/* Education                                                                   */
/* ========================================================================== */

export interface EducationEntry {
  year: string
  degree: string
  institution: string
  location: string
  scoreLabel: string
  score: string
}

export const education: EducationEntry[] = [
  {
    year: '2026',
    degree: 'B.E. Mechanical Engineering',
    institution: 'Sir M Visvesvarayya College of Engineering',
    location: 'Raichur',
    scoreLabel: 'CGPA',
    score: '8.64',
  },
  {
    year: '2023',
    degree: 'Diploma',
    institution: 'HKES Polytechnic',
    location: 'Raichur',
    scoreLabel: 'GPA',
    score: '8.6',
  },
]

/* ========================================================================== */
/* Achievements                                                                */
/* ---------------------------------------------------------------------------- */
/* The DCET entry is a Karnataka state rank. It is deliberately labelled       */
/* "Karnataka Rank" and never "AIR" / "All India Rank".                       */
/*                                                                            */
/* `detail` states only what was given. The reason behind each medal has not   */
/* been specified, so no reason is asserted here.                             */
/* ========================================================================== */

export interface Achievement {
  title: string
  scope: string
  detail: string
}

export const achievements: Achievement[] = [
  {
    title: 'Gold Medal',
    scope: 'College Engineering',
    detail: 'B.E. Mechanical Engineering, Sir M Visvesvarayya College of Engineering.',
  },
  {
    title: 'Silver Medal',
    scope: 'Polytechnic Diploma',
    detail: 'Diploma, HKES Polytechnic.',
  },
  {
    title: 'Top 90',
    scope: 'VTU Karnataka',
    detail: 'Ranked among the top 90 at VTU Karnataka.',
  },
  {
    title: 'DCET',
    scope: 'Karnataka Rank ~4000',
    detail: 'Karnataka state rank of approximately 4000.',
  },
]

/* ========================================================================== */
/* Leadership                                                                  */
/* ---------------------------------------------------------------------------- */
/* Only the role is stated. Responsibilities are intentionally not invented.  */
/* ========================================================================== */

export const leadership: {
  title: string
  organisation: string
  details: string
  pending: boolean
}[] = [
  {
    title: 'Treasury Manager',
    organisation: 'SMVCE',
    details: '',
    pending: true,
  },
]

/* ========================================================================== */
/* About                                                                       */
/* ========================================================================== */

export const about = {
  intro:
    'Software developer with an engineering background, passionate about building practical solutions, learning new technologies, and solving real-world problems.',
  homeHeading: 'From engineering to software.',
  homeBody:
    'I started in mechanical engineering, where problems are physical and tolerances are real. Software turned out to be the same discipline in a different medium: break a large problem into parts, understand how they interact, and be precise about the boundaries. That shift is what I work from today.',
  focus: ['Software Development', 'Full-Stack Development'],
  currentlyLearning: [
    'Java',
    'Spring Boot',
    'Python',
    'Django',
    'React',
    'System Design',
  ],
  journey: [
    {
      label: 'ENGINEERING FOUNDATION',
      title: 'Mechanical Engineering',
      body: 'Mechanical engineering at Sir M Visvesvarayya College of Engineering, Raichur, graduating in 2026 with a CGPA of 8.64, preceded by a diploma at HKES Polytechnic with a GPA of 8.6.',
    },
    {
      label: 'THE TRANSITION',
      title: 'Toward software',
      body: 'The move from mechanical engineering into software was a deliberate one. Engineering had given me the habits that matter in software — breaking a large problem into parts, reasoning about cause and effect, and being precise about boundaries — and software turned out to be the same discipline in a different medium.',
    },
    {
      label: 'FOUNDATIONS',
      title: 'Programming and DSA',
      body: 'Data structures and algorithms form the core of the toolkit: arrays, trees, graphs, sorting, and the habit of reasoning about time and space. Object-oriented programming, operating systems, and computer networks sit underneath, so the abstractions have something to rest on.',
    },
    {
      label: 'WEB DEVELOPMENT',
      title: 'Frontend and backend',
      body: 'Java and Spring Boot on the server, Python and Django as a second stack, React and modern CSS in the browser. REST APIs in between, and enough SQL and DBMS fundamentals to model data rather than just query it.',
    },
    {
      label: 'DESIGN & SCALE',
      title: 'System design and continuous learning',
      body: 'System design is about seeing a whole as a set of contracts — what a service promises, where it can fail, and how it should grow.',
    },
  ],
  currentFocusIntro:
    'What I am working on right now, and what I am actively studying.',

  /**
   * Visual element shown beside the profile card on the About page.
   *
   * IMPORTANT: this is NOT a portrait and does NOT depict Niranjan. It is a
   * personal decorative image (a Ganesha idol photograph) included by request.
   * It must never be described, captioned or alt-texted as him, and no
   * religious claims or text are added around it - the alt text is purely
   * descriptive of what is visible in the photograph.
   *
   * To replace it with a personal photograph later, drop the new file at
   * frontend/public/images/about/ganesha.jpg (same path) - no code change
   * needed. The native aspect ratio (736x1282, portrait) is preserved by CSS;
   * do not change `width`/`height` unless you actually swap the file.
   */
  image: {
    src: '/images/about/ganesha.jpg',
    alt: 'A decorated statue of Ganesha framed by lit oil lamps and scattered flower petals.',
    /** Natural pixel dimensions - used to reserve layout space and avoid CLS. */
    width: 736,
    height: 1282,
  },
} as const

/* ========================================================================== */
/* Navigation                                                                  */
/* ========================================================================== */

export const navLinks: { label: string; to: string }[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Skills', to: '/skills' },
  { label: 'Experience', to: '/experience' },
  { label: 'Contact', to: '/contact' },
  { label: 'Resume', to: '/resume' },
]
