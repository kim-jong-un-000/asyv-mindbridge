import {
  User,
  DailyQuestion,
  DailyQuestionAnswer,
  Assignment,
  WellnessLesson,
  TimetableSession,
  ChatMessage,
  EmergencyAlert,
  MoodLog,
  JournalEntry,
  TodoTask,
  WellnessTip,
  AuditLogEntry,
  EmotionalSupportQuote,
  KudosPost,
  ChampionDiscussionPost,
  AsyvColorKey,
  Announcement
} from '../types';
import { ASSETS } from '../utils/assets';

export interface AsyvColorPalette {
  id: AsyvColorKey;
  name: string;
  nameKinyarwanda: string;
  hex: string;
  secondaryHex: string;
  softBg: string;
  borderClass: string;
  textClass: string;
  gradientClass: string;
  symbolism: string;
  description: string;
}

export const ASYV_COLOR_PALETTES: AsyvColorPalette[] = [
  {
    id: 'forest',
    name: 'Acacia Hillside Forest',
    nameKinyarwanda: 'Icyatsi Cy’Umusozi wa Agahozo',
    hex: '#245934',
    secondaryHex: '#1b4327',
    softBg: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    textClass: 'text-[#245934]',
    gradientClass: 'from-[#1b4327] to-[#245934]',
    symbolism: 'Life, Hope, Rwandan Hillsides & Enduring Vitality',
    description: 'The iconic evergreen shade of Agahozo-Shalom, reflecting the lush hills of Rwamagana and enduring growth.'
  },
  {
    id: 'terracotta',
    name: 'Village Terracotta Sunburst',
    nameKinyarwanda: 'Ubutaka bwa Agahozo',
    hex: '#d95f18',
    secondaryHex: '#b84e12',
    softBg: 'bg-orange-50',
    borderClass: 'border-orange-200',
    textClass: 'text-[#d95f18]',
    gradientClass: 'from-[#d95f18] to-[#ea580c]',
    symbolism: 'Warmth, Family Homes, Solidarity & Rwandan Soil',
    description: 'The earth clay warmth of ASYV residential family houses where youth dine, heal, and bond as brothers and sisters.'
  },
  {
    id: 'gold',
    name: 'Liquidnet Solar Gold',
    nameKinyarwanda: 'Izuba ry’Icyizere n’Ubumenyi',
    hex: '#f59e0b',
    secondaryHex: '#d97706',
    softBg: 'bg-amber-50',
    borderClass: 'border-amber-200',
    textClass: 'text-amber-800',
    gradientClass: 'from-amber-500 to-amber-600',
    symbolism: 'Illumination, High School Excellence & Optimism',
    description: 'Inspired by Liquidnet Family High School and golden Rwandan dawns, lighting the academic path for every student.'
  },
  {
    id: 'muhazi',
    name: 'Lake Muhazi Azure Blue',
    nameKinyarwanda: 'Ubururu bw’Ikiyaga cya Muhazi',
    hex: '#0284c7',
    secondaryHex: '#0369a1',
    softBg: 'bg-sky-50',
    borderClass: 'border-sky-200',
    textClass: 'text-sky-800',
    gradientClass: 'from-sky-600 to-cyan-700',
    symbolism: 'Clarity, Expansive Horizons, Quiet Reflection & Peace',
    description: 'The serene waters of Lake Muhazi adjoining the village, bringing calm breathing, wide horizons, and mental peace.'
  },
  {
    id: 'jacaranda',
    name: 'Jacaranda Royal Purple',
    nameKinyarwanda: 'Umuhengeri w’Ubuyobozi',
    hex: '#7c3aed',
    secondaryHex: '#6d28d9',
    softBg: 'bg-purple-50',
    borderClass: 'border-purple-200',
    textClass: 'text-purple-800',
    gradientClass: 'from-purple-600 to-indigo-700',
    symbolism: 'Youth Leadership, Ethical Dignity & Artistic Expression',
    description: 'The flowering purple jacaranda trees along campus avenues, reminding students of their royalty, leadership, and nobility.'
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus Mindful Sage',
    nameKinyarwanda: 'Icyatsi Cy’Ubuzima n’Ihumure',
    hex: '#0d9488',
    secondaryHex: '#0f766e',
    softBg: 'bg-teal-50',
    borderClass: 'border-teal-200',
    textClass: 'text-teal-800',
    gradientClass: 'from-teal-600 to-emerald-700',
    symbolism: 'Trauma Recovery, Deep Respiration & Emotional Balance',
    description: 'The restorative aroma of village eucalyptus groves, anchoring mindfulness and sensory relaxation.'
  },
  {
    id: 'rose',
    name: 'Agahozo Tears Dried Coral Rose',
    nameKinyarwanda: 'Agahozo - Guhanagura Amarira',
    hex: '#e11d48',
    secondaryHex: '#be123c',
    softBg: 'bg-rose-50',
    borderClass: 'border-rose-200',
    textClass: 'text-rose-800',
    gradientClass: 'from-rose-500 to-pink-600',
    symbolism: 'Compassion, Tears Dried, Healing Trauma & Unconditional Love',
    description: 'The foundation of Agahozo: where tears are dried, wounds turn into resilience, and love heals every student.'
  }
];

export const INSPIRING_EMOTIONAL_QUOTES: EmotionalSupportQuote[] = [
  {
    id: 'quote-1',
    quote: {
      en: 'If you see far, you will go far. Every child deserves a place to heal, grow, and become a leader.',
      rw: 'Nureba kure, uzagera kure. Buri mwana akwiriye ahantu ho gukira ibikomere, gukura no kuba umuyobozi.',
      fr: 'Si vous voyez loin, vous irez loin. Chaque enfant mérite un lieu pour guérir, grandir et devenir un leader.'
    },
    author: 'Anne Heyman',
    sourceOrRole: 'ASYV Founder & Visionary Mother',
    theme: 'hope'
  },
  {
    id: 'quote-2',
    quote: {
      en: 'Agahozo: A place where tears are dried. Shalom: Where peace, love, and community dwell.',
      rw: 'Agahozo: Ahahanagurirwa amarira. Shalom: Ahasagambye amahoro, urukundo n\'ubufatanye.',
      fr: 'Agahozo : Le lieu où l\'on sèche les larmes. Shalom : Où règnent la paix, l\'amour et la communauté.'
    },
    author: 'ASYV Village Creed',
    sourceOrRole: 'Foundation Philosophy',
    theme: 'healing'
  },
  {
    id: 'quote-3',
    quote: {
      en: 'Healing the heart (Tikkun Halev) is the foundation of repairing the world (Tikkun Olam). You matter.',
      rw: 'Gukiza umutima (Tikkun Halev) niyo nkingi yo gusanura isi (Tikkun Olam). Ufite agaciro gakomeye.',
      fr: 'Guérir le cœur (Tikkun Halev) est le fondement de la réparation du monde (Tikkun Olam). Vous êtes précieux.'
    },
    author: 'Agahozo Core Philosophy',
    sourceOrRole: 'ASYV Psychosocial Desk',
    theme: 'healing'
  },
  {
    id: 'quote-4',
    quote: {
      en: 'Nta mvura idahita. In storms and calm, your village family stands beside you.',
      rw: 'Nta mvura idahita. Mu bihe bikomeye no mu ituze, umuryango w\'umudugudu wawe uri kumwe nawe.',
      fr: 'Aucune pluie ne dure éternellement. Dans la tempête comme dans le calme, votre village est à vos côtés.'
    },
    author: 'Rwandan Wisdom & ASYV Core',
    sourceOrRole: 'Traditional Resilience Proverb',
    theme: 'resilience'
  },
  {
    id: 'quote-5',
    quote: {
      en: 'You may not control all the events that happen to you, but you can decide not to be reduced by them.',
      rw: 'Ushobora kutagenzura ibyakubayeho byose, ariko ushobora gufata icyemezo cyo kutareka ngo biguce intege.',
      fr: 'Vous ne contrôlez peut-être pas tous les événements qui vous arrivent, mais vous pouvez décider de ne pas être diminué par eux.'
    },
    author: 'Maya Angelou',
    sourceOrRole: 'Poet, Activist & Healer',
    theme: 'courage'
  },
  {
    id: 'quote-6',
    quote: {
      en: 'It always seems impossible until it is done. Step by step, you are writing your new story.',
      rw: 'Bisa n\'ibidashoboka kugeza igihe birangiriye. Intambwe ku yindi, urimo kwandika amateka yawe mashya.',
      fr: 'Cela semble toujours impossible jusqu\'à ce que ce soit fait. Pas à pas, vous écrivez votre nouvelle histoire.'
    },
    author: 'Nelson Mandela',
    sourceOrRole: 'Global Peacemaker & Freedom Leader',
    theme: 'leadership'
  },
  {
    id: 'quote-7',
    quote: {
      en: 'Abishyize hamwe nta kibananira. When we join hearts and minds, no hardship can stand in our way.',
      rw: 'Abishyize hamwe nta kibananira. Iyo dushyize hamwe imitima n\'ubwenge, nta nzitizi idatsindwa.',
      fr: 'Quand nous unissons nos cœurs et nos esprits, aucun obstacle ne nous résiste.'
    },
    author: 'Rwandan Wisdom',
    sourceOrRole: 'Ancestral Proverb',
    theme: 'solidarity'
  },
  {
    id: 'quote-8',
    quote: {
      en: 'Hope is being able to see that there is light despite all of the darkness.',
      rw: 'Icyizere ni ugushobora kubona ko hari urumuri nubwo haba hari umwijima ukomeye.',
      fr: 'L\'espoir, c\'est être capable de voir qu\'il y a de la lumière malgré toute l\'obscurité.'
    },
    author: 'Desmond Tutu',
    sourceOrRole: 'Nobel Peace Laureate',
    theme: 'hope'
  },
  {
    id: 'quote-9',
    quote: {
      en: 'It is the little things citizens do that make the difference. My little thing is planting trees and giving hope.',
      rw: 'Utuntu duto duto abaturage bakora nitwo tuzana impinduka. Akantu kanjye gato ni ugutera ibiti no gutanga icyizere.',
      fr: 'Ce sont les petites choses faites par les citoyens qui font la différence. Ma petite action est de planter des arbres.'
    },
    author: 'Wangari Maathai',
    sourceOrRole: 'African Environmental Pioneer & Nobel Laureate',
    theme: 'leadership'
  },
  {
    id: 'quote-10',
    quote: {
      en: 'When we are no longer able to change a situation, we are challenged to change ourselves and grow.',
      rw: 'Iyo tudashobora guhindura ibirimo kubaho, dusabwa guhindura imitekerereze yacu no gukura mu bitekerezo.',
      fr: 'Lorsque nous ne pouvons plus changer une situation, nous sommes mis au défi de nous changer nous-mêmes.'
    },
    author: 'Viktor E. Frankl',
    sourceOrRole: 'Psychiatrist & Meaning-Centered Thinker',
    theme: 'resilience'
  },
  {
    id: 'quote-11',
    quote: {
      en: 'Urukundo n\'ubufatanye biruta ubutunzi. Caring for your peers is the true riches of village life.',
      rw: 'Urukundo n\'ubufatanye biruta ubutunzi. Kwitaho bagenzi bawe nibyo bukire bwa nyabwo.',
      fr: 'L\'amour et la solidarité valent mieux que toutes les richesses.'
    },
    author: 'Rwandan Philosophy',
    sourceOrRole: 'Village Core Value',
    theme: 'solidarity'
  },
  {
    id: 'quote-12',
    quote: {
      en: 'Asking for psychosocial help is not a weakness; it is the highest mark of self-leadership and courage.',
      rw: 'Gusaba ubufasha mu mitekerereze ntabwo ari intege nke; ni ikimenyetso gikomeye cy\'ubutwari n\'ubuyobozi.',
      fr: 'Demander de l\'aide n\'est pas une faiblesse ; c\'est la plus haute marque de courage et de leadership.'
    },
    author: 'ASYV Counseling Center',
    sourceOrRole: 'Psychosocial Health Principle',
    theme: 'courage'
  },
  {
    id: 'quote-13',
    quote: {
      en: 'You are worthy of belonging, safety, and respect right now, exactly as you are today.',
      rw: 'Ukwiye umutuzo, urukundo no kubahwa ubu ngubu, uko uri kose uyu munsi.',
      fr: 'Vous êtes digne d\'appartenance, de sécurité et de respect dès maintenant, exactement comme vous êtes.'
    },
    author: 'Brené Brown',
    sourceOrRole: 'Social Researcher & Author',
    theme: 'mindfulness'
  },
  {
    id: 'quote-14',
    quote: {
      en: 'Agasozi katarikugwa ntugashinge igikoni. With patience, focus, and quiet courage, your mountain will be climbed.',
      rw: 'Agasozi katarikugwa ntugashinge igikoni. Wihanganye, wibanze ku cyerekezo, umusozi wawe uzawutsinda.',
      fr: 'Avec patience et détermination, chaque montagne sera gravie pas à pas.'
    },
    author: 'Rwandan Wisdom',
    sourceOrRole: 'Traditional Heritage',
    theme: 'wisdom'
  },
  {
    id: 'quote-15',
    quote: {
      en: 'Our students are not just surviving; they are flourishing into Rwanda\'s ethical visionary leaders.',
      rw: 'Abanyeshuri bacu ntibariho gusa; barimo gukura neza ngo babe abayobozi b’intangarugero mu Rwanda.',
      fr: 'Nos élèves ne font pas que survivre ; ils s\'épanouissent pour devenir les leaders intègres du Rwanda.'
    },
    author: 'Anne Heyman',
    sourceOrRole: 'ASYV Founder',
    theme: 'leadership'
  },
  {
    id: 'quote-16',
    quote: {
      en: 'Smile, breathe, and go slowly. Healing is not a race; your peace of mind is sacred.',
      rw: 'Sekera ubuzima, humeka neza kandi ugende gahoro. Gukira ntabwo ari isiganwa; amahoro yawe ni ingenzi.',
      fr: 'Souriez, respirez et avancez doucement. Guérir n\'est pas une course ; votre paix est sacrée.'
    },
    author: 'Thich Nhat Hanh',
    sourceOrRole: 'Mindfulness Teacher & Peacemaker',
    theme: 'mindfulness'
  },
  {
    id: 'quote-17',
    quote: {
      en: 'Although the world is full of suffering, it is also full of the overcoming of it.',
      rw: 'Nubwo isi yuzuyemo ibibazo, irimo n\'uburyo bwinshi bwo kubitsinda.',
      fr: 'Bien que le monde soit plein de souffrance, il est aussi plein de victoires sur celle-ci.'
    },
    author: 'Helen Keller',
    sourceOrRole: 'Author & Advocate',
    theme: 'resilience'
  },
  {
    id: 'quote-18',
    quote: {
      en: 'Ntawe ugenda wenyine mu mudugudu. No one walks alone in Agahozo; your family house walks with you.',
      rw: 'Ntawe ugenda wenyine mu mudugudu. Nta muntu uri wenyine muri Agahozo; umuryango wawe uri kumwe nawe.',
      fr: 'Nul ne marche seul à Agahozo ; votre maison familiale marche à vos côtés.'
    },
    author: 'ASYV Village Culture',
    sourceOrRole: 'Family House Tradition',
    theme: 'solidarity'
  },
  {
    id: 'quote-19',
    quote: {
      en: 'Learn, Adapt, and Lead. Every mistake in classroom or village is an invitation to greater wisdom.',
      rw: 'Ige, Mumenyere, Kandi Muyobore. Buri kosa mu ishuri cyangwa mu mudugudu ni inzira igana ku bwenge.',
      fr: 'Apprendre, s\'adapter et diriger. Chaque erreur est une invitation à une plus grande sagesse.'
    },
    author: 'Liquidnet Family High School',
    sourceOrRole: 'ASYV Student Motto',
    theme: 'wisdom'
  },
  {
    id: 'quote-20',
    quote: {
      en: 'Education is the most powerful weapon which you can use to change the world and your community.',
      rw: 'Uburezi niyo ntwaro ikomeye cyane ushobora gukoresha mu guhindura isi n\'umuryango wawe.',
      fr: 'L\'éducation est l\'arme la plus puissante que vous puissiez utiliser pour changer le monde.'
    },
    author: 'Nelson Mandela',
    sourceOrRole: 'Freedom Leader',
    theme: 'hope'
  },
  {
    id: 'quote-21',
    quote: {
      en: 'The curious paradox is that when I accept myself just as I am, then I can change and grow.',
      rw: 'Igitangaje ni uko iyo nyakiriye uko ndi kose, aribwo mbona ubushobozi bwo guhinduka no gukura.',
      fr: 'Le paradoxe curieux est que lorsque je m\'accepte tel que je suis, je peux alors changer.'
    },
    author: 'Carl Rogers',
    sourceOrRole: 'Humanistic Psychology Pioneer',
    theme: 'healing'
  },
  {
    id: 'quote-22',
    quote: {
      en: 'Umutima ukeye utera imbaraga z\'ejo. A peaceful, unburdened heart generates strength for tomorrow.',
      rw: 'Umutima ukeye utera imbaraga z\'ejo. Umutima utuje kandi uruhutse utanga imbaraga z\'ahazaza.',
      fr: 'Un cœur pur et apaisé engendre la force nécessaire pour demain.'
    },
    author: 'Rwandan Wisdom',
    sourceOrRole: 'Proverb on Inner Peace',
    theme: 'wisdom'
  },
  {
    id: 'quote-23',
    quote: {
      en: 'Rest is not a luxury or a reward for work; quality sleep and peace are biological requirements for life.',
      rw: 'Kuruhuka ntabwo ari umwihariko; ibitotsi byiza n\'ituze ry\'ubwenge ni iby\'ingenzi ku buzima bwacu.',
      fr: 'Le repos n\'est pas un luxe ; le sommeil réparateur et la paix sont des nécessités biologiques.'
    },
    author: 'ASYV Health Center Desk',
    sourceOrRole: 'Wellness Health Guide',
    theme: 'mindfulness'
  },
  {
    id: 'quote-24',
    quote: {
      en: 'Gukunda igihugu bitangirira ku kwiyubaka. National progress begins with personal emotional healing.',
      rw: 'Gukunda igihugu bitangirira ku kwiyubaka. Iterambere ry\'igihugu ritangirira ku gukira mu mutima.',
      fr: 'L\'amour de la patrie commence par la reconstruction personnelle et la guérison du cœur.'
    },
    author: 'Rwandan Youth Philosophy',
    sourceOrRole: 'Kigali Youth Forum',
    theme: 'leadership'
  },
  {
    id: 'quote-25',
    quote: {
      en: 'Not everything that is faced can be changed, but nothing can be changed until it is faced.',
      rw: 'Ntabwo ibyo duhura nabyo byose bishobora guhinduka, ariko nta kintu cyahinduka tutagihangaye amaso.',
      fr: 'Tout ce qui est affronté ne peut pas être changé, mais rien ne peut être changé tant qu\'on ne l\'affronte pas.'
    },
    author: 'James Baldwin',
    sourceOrRole: 'Author & Civil Rights Voice',
    theme: 'courage'
  },
  {
    id: 'quote-26',
    quote: {
      en: 'Your feelings are valid. You do not have to carry everything by yourself; your village is here.',
      rw: 'Ibyiyumvo byawe bifite agaciro. Ntugomba kwikorera ibintu byose wenyine; umudugudu wawe urahari.',
      fr: 'Vos émotions sont légitimes. Vous n\'avez pas à tout porter seul ; votre village est là pour vous.'
    },
    author: 'Village Peer Champions',
    sourceOrRole: 'Mental Health Solidarity Creed',
    theme: 'solidarity'
  }
];

export const PERMANENT_SOCIAL_WORKERS: User[] = [
  {
    id: 'worker-ingabe',
    name: 'Marie Grace',
    familyName: 'Mukamwezi',
    email: 'maire.claire@asyv.org',
    role: 'social_worker',
    grade: 'Ingabe',
    avatar: '/asyv_emblem.svg',
    password: 'worker@asyv26',
    registeredAt: '2026-01-05T08:00:00Z',
    phone: '+250 788 412 101',
    whatsappNumber: '+250 788 412 101',
    officeLocation: 'Ingabe Grade House · Office 102',
    bio: 'Senior Psychosocial Officer supporting Senior 4 students through village orientation, emotional healing, and family house adjustment.'
  },
  {
    id: 'worker-ingabo',
    name: 'Zivugugkuri',
    familyName: 'Jean Marie Vianney',
    email: 'zi.jmv@asyv.org',
    role: 'social_worker',
    grade: 'Ingabo',
    avatar: '/asyv_emblem.svg',
    password: 'worker@asyv26',
    registeredAt: '2026-01-05T08:00:00Z',
    phone: '+250 788 412 102',
    whatsappNumber: '+250 788 412 102',
    officeLocation: 'Ingabo Grade House · Office 104',
    bio: 'Behavioral Counseling Specialist supporting Senior 5 students with academic balance, peer relations, and emotional regulation.'
  },
  {
    id: 'worker-ijabo',
    name: 'Ririrhafi',
    familyName: 'Gamaniel',
    email: 'ririhafi@asyv.org',
    role: 'social_worker',
    grade: 'Ijabo',
    avatar: '/asyv_emblem.svg',
    password: 'worker@asyv26',
    registeredAt: '2026-01-05T08:00:00Z',
    phone: '+250 788 412 103',
    whatsappNumber: '+250 788 412 103',
    officeLocation: 'Ijabo Senior Leadership Center · Office 106',
    bio: 'Senior Academic & Life Skills Counselor guiding Senior 6 graduating candidates in exam readiness, career pathways, and ethical leadership.'
  }
];

export const INITIAL_DEVELOPER: User = {
  id: 'dev-master',
  name: 'ASYV Master Administrator',
  email: 'admin@ALVA',
  role: 'developer',
  grade: 'Ingabe',
  avatar: ASSETS.emblem,
  registeredAt: '2026-01-01T00:00:00Z',
  password: 'king@asyv2028'
};

export const DEFAULT_VILLAGE_CONTACT_INFO = {
  officeLocation: 'ASYV Psychosocial Support Center · Main Village Campus, Rubona',
  officeHours: 'Monday – Friday: 7:30 AM – 5:30 PM (24/7 on-call emergency coverage)',
  hotlinePhone: '+250 788 312 400',
  whatsappPhone: '+250 788 312 401',
  emergencyEmail: 'wellbeing@asyv.org',
  clinicExtension: 'Village Health Center · Extension 104',
  counselorLead: 'Village Psychosocial Coordination Desk',
  additionalNotice: 'Confidential, trauma-informed school care dedicated to ASYV youth wellness.',
  customContacts: [
    {
      id: 'contact-1',
      name: 'Dr. Patrick Mukiza',
      role: 'Village Visiting Clinical Psychologist & Trauma Specialist',
      phone: '+250 788 450 112',
      category: 'mental_health' as const
    },
    {
      id: 'contact-2',
      name: 'Nurse Claudine Gasana',
      role: 'Village Health Clinic Chief Nurse',
      phone: '+250 788 560 223',
      category: 'clinic' as const
    },
    {
      id: 'contact-3',
      name: 'Campus Security & Dormitory Life Watch Desk',
      role: '24/7 Campus Security & Youth Life Assistance',
      phone: '+250 788 999 112',
      category: 'security' as const
    },
    {
      id: 'contact-4',
      name: 'Jeanette Umutoni',
      role: 'School Learning & Academic Support Counselor',
      phone: '+250 788 678 990',
      category: 'counseling' as const
    }
  ],
  updatedAt: '2026-10-08T08:00:00Z'
};

export const DEFAULT_APP_CUSTOMIZATION = {
  schoolMotto: 'LEARN, ADAPT AND LEAD',
  schoolSubMotto: 'Ingabe · Ingabo · Ijabo',
  portalTitle: 'Mind Bridge',
  portalSubtitle: 'The Agahozo Shalom Youth Village Psychosocial Platform',
  welcomeBannerTitle: 'Do you need any help from your counselor today?',
  welcomeBannerSubtitle: 'Your Grade social worker is available right now for confidential listening, academic support, or personal guidance.',
  welcomeHeroTitle: 'Welcome to Mind Bridge',
  welcomeHeroSubtitle: 'Where Every ASYV Youth Heals, Grows, and Becomes a Leader',
  welcomeHeroDescription: 'A dedicated psychosocial space connecting students, Grade Social Workers, and Peer Mental Champions across Senior 4 Ingabe, Senior 5 Ingabo, and Senior 6 Ijabo. Confidential care, daily mood tracking, peer support circles, and 24/7 village protection.',
  strategicPlanTag: 'ASYV Strategic Vision',
  strategicPlanTitle: 'Fostering Healing, Self-Sufficiency, and Sustainability',
  strategicPlanDescription: 'Celebrating youth empowerment, healing hearts, and building bright futures across Rwanda.',
  strategicPlanImageUrl: '/assets/aistudio/download_954a9c9b.jpg',
  portalLogoImageUrl: '/assets/aistudio/download_9de94bb3.png',
  loginNotice: 'Restricted Official Village Care Network · Authorized access only',
  primaryBrandColor: '#245934',
  accentBrandColor: '#d95f18',
  footerTagline: 'made to support the ASYV social workers support!',
  allowPublicStudentRegistration: false,
  allowPublicWorkerRegistration: false,
  customInspirationalQuote: 'If you see far, you will go far. Every child deserves a place to heal, grow, and become a leader.',
  customQuoteAuthor: 'Anne Heyman, ASYV Founder'
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Official Village Psychosocial Support & Counselor Availability',
    content: 'All ASYV students across Ingabe, Ingabo, and Ijabo are warmly invited to visit their Grade Social Worker for confidential listening, personal wellness check-ins, or academic stress guidance. Counseling offices are open daily from 7:30 AM to 5:30 PM with 24/7 on-call coverage.',
    category: 'wellness',
    targetGrades: 'all',
    authorName: 'ASYV Psychosocial Desk',
    createdAt: '2026-10-15T08:00:00Z',
    active: true
  },
  {
    id: 'ann-2',
    title: 'Senior 4 Ingabe: Village Transition & Family House Evening Circle',
    content: 'Join your family house brothers and sisters this Thursday evening at the Community Center for our monthly orientation check-in. Refreshments and peer sharing circle.',
    category: 'workshop',
    targetGrades: ['Ingabe'],
    authorName: 'Marie Grace Mukamwezi',
    createdAt: '2026-10-18T10:30:00Z',
    active: true
  },
  {
    id: 'ann-3',
    title: 'Senior 5 Ingabo: Academic Balance & Sleep Hygiene Workshop',
    content: 'Balancing multiple subject combinations with dormitory life can feel intense. Join counselor Zivugugkuri for a practical session on Pomodoro study habits, active recall, and proper rest.',
    category: 'wellness',
    targetGrades: ['Ingabo'],
    authorName: 'Zivugugkuri Jean Marie Vianney',
    createdAt: '2026-10-20T14:00:00Z',
    active: true
  },
  {
    id: 'ann-4',
    title: 'Senior 6 Ijabo: National Exam Mindfulness & Calm Focus Sessions',
    content: 'As national examinations approach, we have daily morning grounding circles in the Quiet Library Gazebo. Breathe, center your thoughts, and remember: “Urebeye kure ugera kure”.',
    category: 'urgent',
    targetGrades: ['Ijabo'],
    authorName: 'Ririrhafi Gamaniel',
    createdAt: '2026-10-22T09:15:00Z',
    active: true
  }
];

export const INITIAL_STUDENTS: User[] = [
  {
    id: 'student-mihigo',
    name: 'Mihigo',
    familyName: 'Mihigo',
    email: 'kingmihigo0@gmail.com',
    role: 'student',
    grade: 'Ingabo',
    schoolClass: 'Senior 5 MCB',
    avatar: '/asyv_emblem.svg',
    password: 'asyv2028',
    registeredAt: '2026-02-01T08:00:00Z',
    isMentalChampion: false,
    championStatus: 'none'
  },
  {
    id: 'student-keza',
    name: 'Keza',
    familyName: 'Uwase',
    email: 'keza.uwase@asyv.edu.rw',
    role: 'student',
    grade: 'Ingabe',
    schoolClass: 'Senior 4 MEG',
    avatar: '/asyv_emblem.svg',
    password: 'asyv2028',
    registeredAt: '2026-02-02T09:00:00Z',
    isMentalChampion: false,
    championStatus: 'none'
  },
  {
    id: 'student-patrick',
    name: 'Patrick',
    familyName: 'Manzi',
    email: 'patrick.manzi@asyv.edu.rw',
    role: 'student',
    grade: 'Ingabo',
    schoolClass: 'Senior 5 MPG',
    avatar: '/asyv_emblem.svg',
    password: 'asyv2028',
    registeredAt: '2026-02-03T10:00:00Z',
    isMentalChampion: false,
    championStatus: 'none'
  },
  {
    id: 'student-diane',
    name: 'Diane',
    familyName: 'Umutoni',
    email: 'diane.umutoni@asyv.edu.rw',
    role: 'student',
    grade: 'Ijabo',
    schoolClass: 'Senior 6 PCB',
    avatar: '/asyv_emblem.svg',
    password: 'asyv2028',
    registeredAt: '2026-01-15T08:00:00Z',
    isMentalChampion: true,
    championStatus: 'approved',
    championIdea: 'Leading dorm breathing circles and mindfulness preps before evening study hours.'
  },
  {
    id: 'student-jean',
    name: 'Jean de Dieu',
    familyName: 'Nshimiyimana',
    email: 'jean.n@asyv.edu.rw',
    role: 'student',
    grade: 'Ingabe',
    schoolClass: 'Senior 4 MCB',
    avatar: '/asyv_emblem.svg',
    password: 'asyv2028',
    registeredAt: '2026-02-10T11:00:00Z',
    isMentalChampion: false,
    championStatus: 'none'
  },
  {
    id: 'student-ange',
    name: 'Ange',
    familyName: 'Mutoni',
    email: 'ange.mutoni@asyv.edu.rw',
    role: 'student',
    grade: 'Ijabo',
    schoolClass: 'Senior 6 MEG',
    avatar: '/asyv_emblem.svg',
    password: 'asyv2028',
    registeredAt: '2026-02-12T14:00:00Z',
    isMentalChampion: false,
    championStatus: 'pending',
    championIdea: 'Organizing peer tutoring paired with stress check-ins in the science lab.'
  },
  {
    id: 'student-samuel',
    name: 'Samuel',
    familyName: 'Mugisha',
    email: 'samuel.m@asyv.edu.rw',
    role: 'student',
    grade: 'Ingabo',
    schoolClass: 'Senior 5 HEG',
    avatar: '/asyv_emblem.svg',
    password: 'asyv2028',
    registeredAt: '2026-02-14T09:30:00Z',
    isMentalChampion: false,
    championStatus: 'none'
  },
  {
    id: 'student-chantal',
    name: 'Chantal',
    familyName: 'Ishimwe',
    email: 'chantal.i@asyv.edu.rw',
    role: 'student',
    grade: 'Ijabo',
    schoolClass: 'Senior 6 MCB',
    avatar: '/asyv_emblem.svg',
    password: 'asyv2028',
    registeredAt: '2026-02-16T16:00:00Z',
    isMentalChampion: false,
    championStatus: 'none'
  }
];

export const INITIAL_DAILY_QUESTIONS: DailyQuestion[] = [
  {
    id: 'dq-ingabe',
    grade: 'Ingabe',
    socialWorkerId: 'worker-ingabe',
    socialWorkerName: 'Marie Grace Mukamwezi',
    question: 'What is one kind deed a family house brother or sister did for you this week that made you smile?',
    contextNote: 'Reflecting on mutual care builds brotherhood and sisterhood in Agahozo.',
    updatedAt: '2026-10-25T08:00:00Z'
  },
  {
    id: 'dq-ingabo',
    grade: 'Ingabo',
    socialWorkerId: 'worker-ingabo',
    socialWorkerName: 'Zivugugkuri Jean Marie Vianney',
    question: 'When you face difficult academic prep or feel pressured, what single habit helps you find calm?',
    contextNote: 'Sharing strategies helps us grow stronger as a grade community.',
    updatedAt: '2026-10-25T08:00:00Z'
  },
  {
    id: 'dq-ijabo',
    grade: 'Ijabo',
    socialWorkerId: 'worker-ijabo',
    socialWorkerName: 'Ririrhafi Gamaniel',
    question: 'As you step toward national exams, what village lesson or memory gives you the highest courage?',
    contextNote: 'Honoring our shared foundation: If you see far, you will go far.',
    updatedAt: '2026-10-25T08:00:00Z'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Senior 4 Ingabe: Settling In, Emotional Health & Family Bond',
    instructions: 'Take a quiet moment to reflect on your journey to Agahozo-Shalom. Your responses are read solely by your assigned Grade Social Worker to support you.',
    creatorId: 'worker-ingabe',
    creatorName: 'Marie Grace Mukamwezi',
    grade: 'Ingabe',
    dueDate: '2026-11-15',
    createdAt: '2026-10-20T08:00:00Z',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        prompt: 'How are you adjusting to living in your ASYV family house?',
        options: ['Very well and feeling supported', 'Adapting steadily step by step', 'A bit homesick but managing', 'Finding it quite challenging']
      },
      {
        id: 'q2',
        type: 'open_ended',
        prompt: 'What is one goal you want to achieve for your personal and emotional wellbeing this term?'
      },
      {
        id: 'q3',
        type: 'open_ended',
        prompt: 'Is there anything you would like to discuss privately with your social worker this week?'
      }
    ],
    submissions: []
  },
  {
    id: 'assign-2',
    title: 'Senior 5 Ingabo: Stress Management & Study Strategy Review',
    instructions: 'Reflect on how you organize your study schedule and decompress when coursework feels demanding.',
    creatorId: 'worker-ingabo',
    creatorName: 'Zivugugkuri Jean Marie Vianney',
    grade: 'Ingabo',
    dueDate: '2026-11-20',
    createdAt: '2026-10-22T08:00:00Z',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        prompt: 'Which time of day do you experience the highest cognitive energy for complex subjects?',
        options: ['Early morning (5:30 - 7:00 AM)', 'Afternoon prep (2:00 - 4:00 PM)', 'Evening family study (7:30 - 9:30 PM)', 'Late night']
      },
      {
        id: 'q2',
        type: 'open_ended',
        prompt: 'Describe what grounding exercise or hobby helps you calm down after an intense test.'
      }
    ],
    submissions: []
  },
  {
    id: 'assign-3',
    title: 'Senior 6 Ijabo: Exam Resilience & Leadership Reflection',
    instructions: 'Preparing for national examinations while anchoring our school motto: Learn, Adapt and Lead.',
    creatorId: 'worker-ijabo',
    creatorName: 'Ririrhafi Gamaniel',
    grade: 'Ijabo',
    dueDate: '2026-11-25',
    createdAt: '2026-10-24T08:00:00Z',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        prompt: 'How confident do you feel in balancing revision time with adequate sleep?',
        options: ['Very balanced and rested', 'Managing well most days', 'Struggling with sleep lately', 'Overwhelmed']
      },
      {
        id: 'q2',
        type: 'open_ended',
        prompt: 'Write down the main message of encouragement you would give to your fellow village brothers and sisters as you prepare to graduate.'
      }
    ],
    submissions: []
  }
];

export const INITIAL_TODOS: TodoTask[] = [
  {
    id: 'todo-1',
    workerId: 'dev-master',
    title: 'Audit Senior 4 Ingabe initial wellness check-in questionnaires',
    priority: 'high',
    dueDate: '2026-11-03',
    isCompleted: false,
    createdAt: '2026-10-25T08:00:00Z'
  },
  {
    id: 'todo-2',
    workerId: 'dev-master',
    title: 'Coordinate with Village Health Clinic on termly mental health workshop schedule',
    priority: 'high',
    dueDate: '2026-11-04',
    isCompleted: false,
    createdAt: '2026-10-26T08:00:00Z'
  },
  {
    id: 'todo-3',
    workerId: 'dev-master',
    title: 'Review Peer Mental Champion applications for Senior 6 Ijabo candidates',
    priority: 'medium',
    dueDate: '2026-11-08',
    isCompleted: false,
    createdAt: '2026-10-27T08:00:00Z'
  },
  {
    id: 'todo-4',
    workerId: 'dev-master',
    title: 'Verify Village Emergency Contact Hotline & WhatsApp numbers with Security Desk',
    priority: 'medium',
    dueDate: '2026-11-12',
    isCompleted: false,
    createdAt: '2026-10-28T08:00:00Z'
  }
];

export const INITIAL_TIMETABLES: TimetableSession[] = [
  {
    id: 'session-1',
    topic: 'Overcoming Exam Anxiety & Cognitive Reframing',
    description: 'Interactive workshop in the Quiet Study Hall with guided breathing, positive self-talk scripts, and group encouragement.',
    date: '2026-11-10',
    time: '16:30 - 17:30',
    targetGrades: 'all',
    leaderName: 'Ririrhafi',
    createdByWorkerId: 'worker-ijabo',
    createdAt: '2026-10-20T08:00:00Z'
  },
  {
    id: 'session-2',
    topic: 'Peer Support & Active Listening Circle',
    description: 'Monthly peer champion facilitation circle discussing active listening and how to support classmates experiencing distress.',
    date: '2026-11-12',
    time: '17:00 - 18:00',
    targetGrades: ['Ingabe', 'Ingabo'],
    leaderName: 'Marie Grace',
    createdByWorkerId: 'worker-ingabe',
    createdAt: '2026-10-22T08:00:00Z'
  }
];

export const INITIAL_LESSONS: WellnessLesson[] = [
  {
    id: 'lesson-1',
    title: 'Building Emotional Resilience in the Face of Academic Setbacks',
    category: 'resilience',
    description: 'Understanding how to treat low grades or mistakes as data rather than defining personal worth.',
    content: 'In Agahozo-Shalom, our student creed says: Learn, Adapt, and Lead. Growth mindset means our brain creates new neural pathways every time we analyze an error. When you receive a challenging score: 1) Acknowledge disappointment without judgment. 2) Schedule 10 minutes to walk through specific questions with your teacher. 3) Frame the lesson: What one concept did I learn today that I didn\'t know yesterday?',
    workerId: 'worker-ingabo',
    workerName: 'Zivugugkuri Jean Marie Vianney',
    targetGrades: 'all',
    createdAt: '2026-10-15T08:00:00Z'
  },
  {
    id: 'lesson-2',
    title: 'Sleep Hygiene, Restorative Rest & Academic Performance',
    category: 'mindfulness',
    description: 'Why 7 to 8 hours of quality sleep directly impacts memory consolidation and emotional regulation.',
    content: 'During deep sleep (REM and slow-wave), our hippocampus replays study notes and transfers them to long-term memory. Cutting sleep to cram notes actually degrades cognitive processing speed by up to 40%. Practice turning off electronic devices 30 minutes before dorm lights-out, do 3 minutes of slow 4-7-8 breathing, and keep your sleeping space calm.',
    workerId: 'worker-ingabe',
    workerName: 'Marie Grace Mukamwezi',
    targetGrades: 'all',
    createdAt: '2026-10-18T08:00:00Z'
  }
];

export const INITIAL_CHATS: ChatMessage[] = [];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];

export const INITIAL_MOOD_LOGS: MoodLog[] = [];

export const INITIAL_DAILY_ANSWERS: DailyQuestionAnswer[] = [];

export const INITIAL_DISCUSSIONS: ChampionDiscussionPost[] = [
  {
    id: 'disc-1',
    authorId: 'student-diane',
    authorName: 'Diane Umutoni',
    grade: 'Ijabo',
    content: 'Hello fellow champions! We are hosting a quiet meditation & tea circle on the dining hall porch tomorrow at 5 PM before dinner. All peer mentors and friends are welcome!',
    timestamp: '2026-10-26T15:00:00Z'
  }
];

export const WELLNESS_RESOURCES = {
  study: [
    {
      title: 'Active Recall & Spaced Practice',
      summary: 'Instead of re-reading notes passively, close your book and write down key concepts from memory. Review at 1, 3, and 7-day intervals.',
      actionable: 'Test yourself with 5 flash questions after every evening study prep.'
    },
    {
      title: 'The 25/5 Pomodoro Cycle for Focus',
      summary: 'Dedicate 25 uninterrupted minutes to a single subject, followed by 5 minutes of standing, stretching, or drinking water.',
      actionable: 'Turn off distractions and avoid multitasking during study hours.'
    },
    {
      title: 'Exam Day Mindset & Calming Reflex',
      summary: 'Replace catastrophizing thoughts ("What if I fail?") with grounded facts ("I have prepared, and I will take one question at a time").',
      actionable: 'Do three slow 4-7-8 breaths right before turning over your exam paper.'
    }
  ],
  stress: [
    {
      title: 'Box Breathing (Navy SEAL Protocol)',
      summary: 'Inhale for 4 counts, hold for 4, exhale for 4, hold empty for 4. Repeat for 4 full cycles to slow your heart rate.',
      actionable: 'Practice this anytime your chest feels tight or thoughts start racing.'
    },
    {
      title: 'Progressive Muscle Relaxation',
      summary: 'Tense your toes for 5 seconds and release. Move upward to calves, thighs, hands, shoulders, and jaw.',
      actionable: 'Use this in your dorm bed right before sleeping to release accumulated tension.'
    },
    {
      title: 'Worry Postponement Window',
      summary: 'Write down intrusive worries on paper and schedule a specific 15-minute review time with your social worker or self.',
      actionable: 'Once written down, tell your mind: "I have stored this; I will address it at 5 PM."'
    }
  ],
  social: [
    {
      title: 'Empathetic Active Listening',
      summary: 'When a village brother or sister shares a struggle, resist the urge to immediately solve it. First validate their emotions.',
      actionable: 'Say: "That sounds genuinely heavy. Thank you for trusting me with it. I am here with you."'
    },
    {
      title: 'Respectful Personal Boundaries',
      summary: 'Saying no to peer pressure or overwhelming social demands is an act of integrity, not hostility.',
      actionable: 'Communicate kindly: "I care about you, but tonight I need quiet time to recharge."'
    },
    {
      title: 'Healthy Conflict Resolution',
      summary: 'Address disagreements using "I" statements rather than accusatory "You" statements.',
      actionable: 'Say: "I felt unheard when plans changed abruptly" instead of "You always ignore me."'
    }
  ],
  living: [
    {
      title: 'Living in ASYV Village Harmony',
      summary: 'Our village is built on dignity, mutual respect, and community solidarity. Small acts of cleanliness and respect lift everyone.',
      actionable: 'Greet one staff worker or junior student warmly each morning.'
    },
    {
      title: 'Digital Wellness & Sleep Hygiene',
      summary: 'Quality sleep is the bedrock of mental clarity and emotional regulation.',
      actionable: 'Disengage from screens at least 30 minutes before dorm lights-out.'
    },
    {
      title: 'When Concerns Exceed School Support',
      summary: 'If you or a friend ever feels unsafe, overwhelmed, or hopeless, speak to your social worker immediately.',
      actionable: 'Your safety, health, and dignity are the highest priority. Help is always available.'
    }
  ]
};

export const INITIAL_TIPS: WellnessTip[] = [
  {
    id: 'tip-1',
    category: 'study',
    title: 'Active Recall & Spaced Practice',
    summary: 'Instead of re-reading notes passively, close your book and write down key concepts from memory. Review at 1, 3, and 7-day intervals.',
    actionable: 'Test yourself with 5 flash questions after every evening study prep.',
    authorName: 'ASYV Academic Desk',
    createdAt: '2026-10-10T08:00:00Z'
  },
  {
    id: 'tip-2',
    category: 'stress',
    title: 'Box Breathing (Navy SEAL Protocol)',
    summary: 'Inhale for 4 counts, hold for 4, exhale for 4, hold empty for 4. Repeat for 4 full cycles to slow your heart rate.',
    actionable: 'Practice this anytime your chest feels tight or thoughts start racing.',
    authorName: 'Village Psychosocial Desk',
    createdAt: '2026-10-10T08:00:00Z'
  },
  {
    id: 'tip-3',
    category: 'social',
    title: 'Empathetic Active Listening in Family Houses',
    summary: 'When a village brother or sister shares a struggle, resist the urge to immediately solve it. First validate their emotions.',
    actionable: 'Say: "That sounds genuinely heavy. Thank you for trusting me with it. I am here with you."',
    authorName: 'Counseling Lead',
    createdAt: '2026-10-10T08:00:00Z'
  },
  {
    id: 'tip-4',
    category: 'living',
    title: 'Living in ASYV Village Harmony',
    summary: 'Our village is built on dignity, mutual respect, and community solidarity. Small acts of cleanliness and respect lift everyone.',
    actionable: 'Greet one staff worker or junior student warmly each morning.',
    authorName: 'Village Life Director',
    createdAt: '2026-10-10T08:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-1',
    timestamp: '2026-10-31T06:00:00Z',
    userId: 'dev-master',
    userName: 'ASYV Master Administrator',
    userRole: 'developer',
    grade: 'Ingabe',
    action: 'SECURITY_CHECK',
    details: 'Administrator verified system governance, database schema, and counselor assignments for all 3 grades.',
    severity: 'info',
    ipOrDevice: 'System Host'
  }
];

export const INITIAL_KUDOS_POSTS: KudosPost[] = [
  {
    id: 'kudos-1',
    senderGrade: 'Ingabo',
    recipientGrade: 'Ingabe',
    recipientName: 'To all Senior 4 students in Family House 3',
    category: 'kindness',
    message: 'Shoutout to our junior brothers and sisters for maintaining incredible cleanliness and bringing bright positive energy during morning assembly!',
    createdAt: '2026-10-24T12:00:00Z',
    likesCount: 6,
    likedBy: []
  },
  {
    id: 'kudos-2',
    senderGrade: 'Ijabo',
    recipientGrade: 'all',
    recipientName: 'To the Village Dining Hall Family & Kitchen Staff',
    category: 'gratitude',
    message: 'Thank you for the nutritious meals and smiling faces that keep us nourished through rigorous study preps every single day!',
    createdAt: '2026-10-25T14:30:00Z',
    likesCount: 12,
    likedBy: []
  }
];

