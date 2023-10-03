"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book, SectionInterface } from "../interface/book";
import styles from "./book.module.css";
import { Section } from "./Section";
import { useAuth } from "../auth/auth";

function Book() {
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
  const { authenticated } = useAuth();

  useEffect(() => {
    if (!authenticated) {
      router.push("/login");
    }
  }, [authenticated, router]);

  const createBook = () => {
    const newBook: Book = {
      id: Date.now(),
      title: newBookData.title,
      description: newBookData.description,
      sections: [],
    };
    setBooks([...books, newBook]);
    setCurrentBook(newBook);
    setNewBookData({ title: "", description: "" });
    setIsBookFormVisible(false);
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
            </header>
            <article>
              {isBookFormVisible ? (
                <>
                  <h2 className={styles.chapterTitle}>Syllaby Book</h2>
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
                </>
              ) : (
                <>
                  <h2 className={styles.chapterTitle}>{currentBook?.title}</h2>
                  <p>
                    {currentBook && (
                      <div className={styles.book}>
                        {!isSectionAdded && (
                          <button
                            onClick={addSection}
                            className={styles.addSectionButton}
                          >
                            Add Section +
                          </button>
                        )}
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
