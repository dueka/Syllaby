import React from "react";
import styles from "./modal.module.css";
function CollaboratorModal({ users, isOpen, onClose, onAddCollaborator }: any) {
  const [selectedCollaborator, setSelectedCollaborator] = React.useState("");

  const handleAddCollaborator = () => {
    if (selectedCollaborator) {
      onAddCollaborator(selectedCollaborator);
      setSelectedCollaborator("");
      window.alert("Collaborator added successfully!");
      onClose();
    }
  };

  return (
    <div className={`${isOpen ? styles.modalOverlay : styles.none}`}>
      <div className={styles.modalContainer}>
        <header className={styles.modalHeader}>
          <p className={styles.modalTitle}>Select Collaborator</p>
          <button
            className={styles.closeButton}
            aria-label="close"
            onClick={onClose}
          >
            x
          </button>
        </header>
        <section className={styles.modalContent}>
          <select
            className={styles.selectInput}
            onChange={(e) => setSelectedCollaborator(e.target.value)}
          >
            <option value="">Select a collaborator</option>
            {users &&
              Object.values(users).map((user: any) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))}
          </select>
          <button className={styles.addButton} onClick={handleAddCollaborator}>
            Add Collaborator
          </button>
        </section>
      </div>
    </div>
  );
}

export default CollaboratorModal;
