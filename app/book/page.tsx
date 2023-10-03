"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book, SectionInterface } from "../interface/book";
import styles from "./book.module.css";
import { Section } from "./Section";
import { useAuth } from "../auth/auth";
import BookForm from "./form/BookForm";
import CollaboratorSection from "./Collaboration";

function Book() {
  const localStorageKey = "bookData";
  const { authenticated, logout } = useAuth();
  const userRole = window.localStorage.getItem("role");
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [newSectionData, setNewSectionData] = useState({ title: "" });
  const [isBookFormVisible, setIsBookFormVisible] = useState(true);
  const [isSectionAdded, setIsSectionAdded] = useState(false);
  const [users, setUsers] = useState<{
    [key: string]: { id: number; username: string; role: string };
  }>({});

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
      }
    }
  };

  const removeCollaborator = (collaboratorId: any) => {
    if (currentBook) {
      const updatedcollaborators = currentBook.collaborators.filter(
        (collaborator: any) => collaborator.id !== collaboratorId
      );
      const updatedBook = {
        ...currentBook,
        collaborators: updatedcollaborators,
      };
      setCurrentBook(updatedBook);
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

  const createBook = (newBookData: any) => {
    console.log("clicked");
    const newBook: Book = {
      id: Date.now(),
      title: newBookData.title,
      description: newBookData.description,
      sections: [],
      collaborators: [],
    };
    setBooks([...books, newBook]);
    setCurrentBook(newBook);
    setIsBookFormVisible(false);
    updateLocalStorage([...books, newBook]);
  };
  console.log(books);

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
                  <BookForm onSubmit={createBook} />
                </>
              ) : (
                <>
                  <h2 className={styles.chapterTitle}>{currentBook?.title}</h2>
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
                        <CollaboratorSection
                          users={users}
                          currentBook={currentBook}
                          onAddCollaborator={addCollaborator}
                          removeCollaborator={removeCollaborator}
                        />
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
