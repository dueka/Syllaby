"use client";
import React, { useState } from "react";
import styles from "./book.module.css";
import { SectionProps, SubsectionProps } from "../interface/book";

function Subsection({
  subsection,
  onAddSubsection,
  onDelete,
}: SubsectionProps) {
  const [newSubsectionTitle, setNewSubsectionTitle] = useState("");

  const handleAddSubsection = () => {
    if (newSubsectionTitle.trim() === "") return;
    onAddSubsection(subsection.id, newSubsectionTitle);
    setNewSubsectionTitle("");
  };

  const isAddSubsectionDisabled = newSubsectionTitle.trim() === "";

  return (
    <div className={styles.subsection}>
      <div className={styles.title}>
        <span>Subsection:</span> {subsection.title}
      </div>
      <form className={styles.form}>
        <input
          type="text"
          placeholder="Enter Subsection Title"
          value={newSubsectionTitle}
          onChange={(e) => setNewSubsectionTitle(e.target.value)}
        />
        <button
          onClick={handleAddSubsection}
          disabled={isAddSubsectionDisabled}
        >
          Add Subsection
        </button>
        <button onClick={() => onDelete(subsection.id)}>
          Delete Subsection
        </button>
      </form>
      {subsection.subsections.map((subsubsection) => (
        <Subsection
          key={subsubsection.id}
          subsection={subsubsection}
          onAddSubsection={onAddSubsection}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export function Section({ section, onAddSubsection, onDelete }: SectionProps) {
  const [newSubsectionTitle, setNewSubsectionTitle] = useState("");

  const handleAddSubsection = () => {
    if (newSubsectionTitle.trim() === "") return;
    onAddSubsection(section.id, newSubsectionTitle);
    setNewSubsectionTitle("");
  };

  const isAddSubsectionDisabled = newSubsectionTitle.trim() === "";

  return (
    <div className={styles.section}>
      <div className={styles.title}>
        <span>Section:</span> {section.title}
      </div>
      <form className={styles.form}>
        <input
          type="text"
          placeholder="Enter Subsection Title"
          value={newSubsectionTitle}
          onChange={(e) => setNewSubsectionTitle(e.target.value)}
        />
        <button
          onClick={handleAddSubsection}
          disabled={isAddSubsectionDisabled}
        >
          Add Subsection
        </button>
        <button onClick={() => onDelete(section.id)}>Delete Section</button>
      </form>
      {section.subsections.map((subsection) => (
        <Subsection
          key={subsection.id}
          subsection={subsection}
          onAddSubsection={onAddSubsection}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
