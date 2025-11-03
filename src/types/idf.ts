export interface Inventor {
  Name: string;
  id: string;
  nationality: string;
  employer: string;
  inventorship: string;
  address: string;
  Phone: string;
  email: string;
}

export interface PriorArtItem {
  title: string;
  authors: string;
  published: string;
  PublicationDate: string;
}

export interface DisclosureItem {
  title: string;
  authors: string;
  published: string;
  Date: string;
}

export interface PublicationPlan {
  title: string;
  authors: string;
  disclosed: string;
  Date: string;
}

export interface Invention {
  description: string;
  keywords: string[] | string;
  background: string;
  problem: string;
  components: string[] | string;
  advantages: string;
  additionaldata: string;
  uploadedImages: string[];
  results: string[] | string;
}

export interface IDFData {
  date: string;
  title: string;
  abstract: string;
  inventors: Inventor[];
  invention: Invention;
  prior_art: PriorArtItem[];
  disclosure: DisclosureItem[];
  plans: PublicationPlan[];
}

export interface LeftPartProps {
  message: any;
  setMessage: (value: any) => void;
}

export interface RightPartProps {
  message: any;
  setMessage: (value: any) => void;
}

export interface TextItem {
  title: string;
  authors: string;
  published: string;
  PublicationDate: string;
}

export const defaultIDFData: IDFData = {
  date: '',
  title: '',
  abstract: '',
  inventors: [],
  invention: {
    description: '',
    keywords: [],
    background: '',
    problem: '',
    components: [],
    advantages: '',
    additionaldata: '',
    uploadedImages: [],
    results: [],
  },
  prior_art: [],
  disclosure: [],
  plans: [],
};

export const placeholderText = {
  'description': "Describe the invention in detail including all essential elements. If you have a draft of a scientific article, a presentation, a grant proposal etc. related to the invention please also send by e-mail, in a separate file",
  'keywords': "Please provide 5 keywords that describe the main features of the invention",
  'background': "Provide details on the field of invention, what is common knowledge in the field and what are the pitfall and unanswered needs",
  'problem': "Describe in detail the need identified by you for which the invention is a solution",
  'components': "Describe in detail the elements of the invention that are crucial for its function. The elements could be parts of a device, a molecular formulation, physical characteristics, computational elements, working conditions, structural features such as size, shape, material etc. Make sure to include all the elements.",
  'advantages': "Based on your knowledge and expertise, describe in detail what is new (not previously known) in the solution proposed, why it is important, and what are the benefits compared to existing solutions",
  'additionaldata': "Provide figures, sketches, pictures, graphs, statistics, lists, sequences etc.",
  'results': "Where applicable, provide results such as in vitro, in vivo, prototype, simulation, working computer program, statistics, etc."
} as const;

export function isTableSectionKey(
  key: keyof IDFData
): key is 'prior_art' | 'disclosure' | 'plans' {
  return ['prior_art', 'disclosure', 'plans'].includes(key);
} 