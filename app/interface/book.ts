export interface Book {
  id: number;
  title: string;
  description: string;
  sections: SectionInterface[];
}

export interface SectionInterface {
  id: number;
  title: string;
  subsections: Subsection[];
}

export interface Subsection {
  id: number;
  title: string;
  subsections: Subsection[];
}

export interface SectionProps {
  section: SectionInterface;
  onAddSubsection: (parentId: number, title: string) => void;
  onDelete: (id: number) => void;
}

export interface SubsectionProps {
  subsection: Subsection;
  onAddSubsection: (parentId: number, title: string) => void;
  onDelete: (id: number) => void;
}
