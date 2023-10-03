import React from "react";
import styles from "./modal.module.css";
function ViewCollaboratorModal({
  isOpen,
  onClose,
  currentBook,
  removeCollaborator,
}: any) {
  return (
    <div className={`${isOpen ? styles.modalOverlay : styles.none}`}>
      <div className={styles.modalContainer}>
        <header className={styles.modalHeader}>
          <p className={styles.modalTitle}>Collaborators</p>
          <button
            className={styles.closeButton}
            aria-label="close"
            onClick={onClose}
          >
            x
          </button>
        </header>
        <section className={styles.modalContent}>
          <ul>
            {/* Map through the collaborators of the current book and display their information */}
            {currentBook.collaborators.map((collaborator: any) => (
              <li key={collaborator.id} className={styles.collaboratorItem}>
                <span>
                  Username: {collaborator.username}, Role: {collaborator.role}
                </span>
                <button
                  className={styles.removeButton}
                  onClick={() => removeCollaborator(collaborator.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default ViewCollaboratorModal;
