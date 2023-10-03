import React, { useState } from "react";
import styles from "./book.module.css";
import CollaboratorModal from "./components/modal";
import ViewCollaboratorModal from "./components/ViewCollaboratorModal";

function CollaboratorSection({
  users,
  currentBook,
  onAddCollaborator,
  removeCollaborator,
}: any) {
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [isViewCollaboratorModalOpen, setIsViewCollaboratorModalOpen] =
    useState(false);

  const openCreateCollaboratorModal = () => {
    setIsCollaboratorModalOpen(true);
  };

  const closeCreateCollaboratorModal = () => {
    setIsCollaboratorModalOpen(false);
  };

  const openCollaboratorModal = () => {
    setIsViewCollaboratorModalOpen(true);
  };

  const closeCollaboratorModal = () => {
    setIsViewCollaboratorModalOpen(false);
  };

  return (
    <div className={styles.collaboratorSection}>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={openCreateCollaboratorModal}
          className={styles.addSectionButton}
        >
          Add Collaborators +
        </button>
        <CollaboratorModal
          users={users}
          isOpen={isCollaboratorModalOpen}
          onClose={closeCreateCollaboratorModal}
          onAddCollaborator={onAddCollaborator}
        />

        <button
          onClick={openCollaboratorModal}
          className={styles.addSectionButton}
        >
          View Collaborators
        </button>
        <ViewCollaboratorModal
          isOpen={isViewCollaboratorModalOpen}
          onClose={closeCollaboratorModal}
          currentBook={currentBook}
          removeCollaborator={removeCollaborator}
        />
      </div>
    </div>
  );
}

export default CollaboratorSection;
