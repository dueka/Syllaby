"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book, SectionInterface } from "../interface/book";
import styles from "./book.module.css";
import { Section } from "./Section";
import { useAuth } from "../auth/auth";
import CollaboratorModal from "./components/modal";
import ViewCollaboratorModal from "./components/ViewCollaboratorModal";

function Book() {
  const localStorageKey = "bookData";
  const { authenticated, logout } = useAuth();
  const userRole = window.localStorage.getItem("role");
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [newBookData, setNewBookData] = useState({
    title: "",
    description: "",
  });
  const [newSectionData, setNewSectionData] = useState({ title: "" });
  const [isBookFormVisible, setIsBookFormVisible] = useState(true);
  const [isSectionAdded, setIsSectionAdded] = useState(false);
  const [users, setUsers] = useState<{
    [key: string]: { id: number; username: string; role: string };
  }>({});

  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [isViewCollaboratorModalOpen, setIsViewCollaboratorModalOpen] =
    useState(false);

  // Function to open the "View Collaborators" modal
  const openCollaboratorModal = () => {
    setIsViewCollaboratorModalOpen(true);
  };

  // Function to close the modal
  const closeCollaboratorModal = () => {
    setIsViewCollaboratorModalOpen(false);
  };

  const openCreateCollaboratorModal = () => {
    setIsCollaboratorModalOpen(true);
  };

  // Function to close the modal
  const closeCreateCollaboratorModal = () => {
    setIsCollaboratorModalOpen(false);
  };

  const toggleCollaboratorModal = () => {
    setIsCollaboratorModalOpen(!isCollaboratorModalOpen);
  };

  useEffect(() => {
    if (!authenticated) {
      router.push("/login");
    }
  }, [authenticated, router]);
  const updateLocalStorage = (updatedBooks: any) => {
    const savedData = localStorage.getItem(localStorageKey);
    const savedDataObj = savedData ? JSON.parse(savedData) : {};
    savedDataObj.books = updatedBooks;
    localStorage.setItem(localStorageKey, JSON.stringify(savedDataObj));
  };

  useEffect(() => {
    // Fetch the list of users when the component mounts
    fetch("/api/users")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data?.users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const addCollaborator = (selectedUsername: string) => {
    if (currentBook && selectedUsername) {
      // Find the user object based on the selected username
      const selectedUser = Object.values(users).find(
        (user) => user.username === selectedUsername
      );

      if (selectedUser) {
        const collaboratorId = selectedUser.id;
        const updatedBook = {
          ...currentBook,
          collaborators: [
            ...currentBook.collaborators,
            {
              id: collaboratorId,
              username: selectedUser.username,
              role: "Collaborator",
            },
          ],
        };
        setCurrentBook(updatedBook);
        // Update the book data in local storage and/or send a request to update the server
        // ...
      }
    }
  };

  const removeCollaborator = (collaboratorId: any) => {
    // Make an API request to remove the collaborator from the book's collaborators
    if (currentBook) {
      const updatedcollaborators = currentBook.collaborators.filter(
        (collaborator: any) => collaborator.id !== collaboratorId
      );
      const updatedBook = {
        ...currentBook,
        collaborators: updatedcollaborators,
      };
      setCurrentBook(updatedBook);
      // Update the book data in local storage and/or send requests to update the server
      // ...
    }
  };

  const handleLogout = () => {
    console.log("clicied");
    try {
      logout();
      router.push("/login");
    } catch (error) {
      console.log("Error", error);
    }
  };

  const createBook = () => {
    const newBook: Book = {
      id: Date.now(),
      title: newBookData.title,
      description: newBookData.description,
      sections: [],
      collaborators: [],
    };
    setBooks([...books, newBook]);
    setCurrentBook(newBook);
    setNewBookData({ title: "", description: "" });
    setIsBookFormVisible(false);
    updateLocalStorage([...books, newBook]);
  };

  const addSection = () => {
    if (!currentBook) return;
    const newSection: SectionInterface = {
      id: Date.now(),
      title:
        newSectionData.title || `Section ${currentBook.sections.length + 1}`,
      subsections: [],
    };
    setCurrentBook((prevBook) => {
      if (!prevBook) return null;
      setIsSectionAdded(true);
      return { ...prevBook, sections: [...prevBook.sections, newSection] };
    });
    setNewSectionData({ title: "" });

    const updatedBooks = books.map((book) =>
      book.id === currentBook.id
        ? { ...book, sections: [...book.sections, newSection] }
        : book
    );
    setBooks(updatedBooks);
    updateLocalStorage(updatedBooks);
  };

  const addSubsection = (parentId: number, title: string) => {
    if (!currentBook) return;
    setCurrentBook((prevBook) => {
      if (!prevBook) return null;
      const updatedSections = addSubsectionToSections(
        prevBook.sections,
        parentId,
        title
      );
      return { ...prevBook, sections: updatedSections };
    });

    const updatedBooks = books.map((book) =>
      book.id === currentBook.id
        ? { ...book, sections: currentBook.sections }
        : book
    );
    setBooks(updatedBooks);
    updateLocalStorage(updatedBooks);
  };

  const addSubsectionToSections = (
    sections: SectionInterface[],
    parentId: number,
    title: string
  ): SectionInterface[] => {
    return sections.map((section) => {
      if (section.id === parentId) {
        return {
          ...section,
          subsections: [
            ...section.subsections,
            {
              id: Date.now(),
              title: title || `Subsection ${section.subsections.length + 1}`,
              subsections: [],
            },
          ],
        };
      } else if (section.subsections.length > 0) {
        return {
          ...section,
          subsections: addSubsectionToSections(
            section.subsections,
            parentId,
            title
          ),
        };
      }
      return section;
    });
  };

  const handleDelete = (id: number) => {
    if (!currentBook) return;
    setCurrentBook((prevBook) => {
      if (!prevBook) return null;
      const updatedSections = deleteSectionFromSections(prevBook.sections, id);
      const hasSections = updatedSections.some(
        (section) => section.subsections.length > 0
      );
      setIsSectionAdded(hasSections);
      return { ...prevBook, sections: updatedSections };
    });
  };

  const deleteSectionFromSections = (
    sections: SectionInterface[],
    id: number
  ): SectionInterface[] => {
    return sections.filter((section) => {
      if (section.id === id) {
        return false;
      } else if (section.subsections.length > 0) {
        section.subsections = deleteSectionFromSections(
          section.subsections,
          id
        );
        return true;
      }
      return true;
    });
  };

  return (
    <>
      <div id={styles.wrapper}>
        <div id={styles.container}>
          <section className={styles.openBook}>
            <header>
              <h1>Book and Sections</h1>
              <button
                className={styles.addSectionButton}
                style={{
                  backgroundColor: "red",
                }}
                onClick={() => handleLogout()}
              >
                Logout
              </button>
            </header>

            <article>
              {isBookFormVisible ? (
                <>
                  <h2 className={styles.chapterTitle}>Syllaby Book</h2>
                  {userRole === "Author" && (
                    <form className={styles.form}>
                      <label>
                        Book Name:
                        <input
                          type="text"
                          value={newBookData.title}
                          onChange={(e) =>
                            setNewBookData({
                              ...newBookData,
                              title: e.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Book Description:
                        <textarea
                          value={newBookData.description}
                          onChange={(e) =>
                            setNewBookData({
                              ...newBookData,
                              description: e.target.value,
                            })
                          }
                        />
                      </label>
                      <button
                        type="button"
                        onClick={createBook}
                        disabled={newBookData.title.trim() === ""}
                      >
                        Create Book
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <>
                  <h2 className={styles.chapterTitle}>{currentBook?.title}</h2>
                  <p>
                    {currentBook && (
                      <div className={styles.book}>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                          }}
                        >
                          {userRole === "Author" && !isSectionAdded && (
                            <button
                              onClick={addSection}
                              className={styles.addSectionButton}
                            >
                              Add Section +
                            </button>
                          )}
                          {userRole === "Author" && (
                            <div>
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
                                onAddCollaborator={addCollaborator}
                              />
                            </div>
                          )}
                          {userRole === "Author" && (
                            <div>
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
                          )}
                        </div>
                        {currentBook.sections.map((section) => (
                          <Section
                            key={section.id}
                            section={section}
                            onAddSubsection={addSubsection}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    )}
                  </p>
                </>
              )}
            </article>
          </section>
        </div>
      </div>
    </>
  );
}

export default Book;
