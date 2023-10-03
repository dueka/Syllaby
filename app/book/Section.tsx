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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(subsection.title);
  const [isAddingSubsection, setIsAddingSubsection] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setIsAddingSubsection(false);
  };

  const handleSave = () => {
    // Update the title in the state
    subsection.title = editedTitle;
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset the edited title and exit editing mode
    setEditedTitle(subsection.title);
    setIsEditing(false);
  };

  const handleAddSubsection = () => {
    if (newSubsectionTitle.trim() === "") return;
    onAddSubsection(subsection.id, newSubsectionTitle);
    setNewSubsectionTitle("");
    setIsAddingSubsection(false);
  };

  const isAddSubsectionDisabled = newSubsectionTitle.trim() === "";

  return (
    <div className={styles.subsection}>
      {isEditing ? (
        <div>
          <input
            className={styles.Input}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <button onClick={handleSave} id={styles.saveButton}>
            Save
          </button>
          <button onClick={handleCancel} id={styles.deleteButton}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className={styles.title}>
            <span>Subsection: {subsection.title}</span>
            <button onClick={handleEdit} className={styles.addSectionButton}>
              Edit
            </button>
          </div>
          <form className={styles.form}>
            <input
              className={styles.Input}
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
            <button
              onClick={() => onDelete(subsection.id)}
              id={styles.deleteButton}
            >
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
        </>
      )}
    </div>
  );
}

export function Section({ section, onAddSubsection, onDelete }: SectionProps) {
  const [newSubsectionTitle, setNewSubsectionTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(section.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Update the title in the state
    section.title = editedTitle;
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset the edited title and exit editing mode
    setEditedTitle(section.title);
    setIsEditing(false);
  };

  const handleAddSubsection = () => {
    if (newSubsectionTitle.trim() === "") return;
    onAddSubsection(section.id, newSubsectionTitle);
    setNewSubsectionTitle("");
  };

  const isAddSubsectionDisabled = newSubsectionTitle.trim() === "";

  return (
    <div className={styles.section}>
      {isEditing ? (
        <div>
          <input
            type="text"
            className={styles.Input}
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <button onClick={handleSave} id={styles.saveButton}>
            Save
          </button>
          <button onClick={handleCancel} id={styles.deleteButton}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className={styles.title}>
            <span>Section: {section.title}</span>
            <button onClick={handleEdit} className={styles.addSectionButton}>
              Edit
            </button>
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
            <button
              onClick={() => onDelete(section.id)}
              id={styles.deleteButton}
            >
              Delete Section
            </button>
          </form>
          {section.subsections.map((subsection) => (
            <Subsection
              key={subsection.id}
              subsection={subsection}
              onAddSubsection={onAddSubsection}
              onDelete={onDelete}
            />
          ))}
        </>
      )}
    </div>
  );
}
