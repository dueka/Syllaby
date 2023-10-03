import React, { useState } from "react";
import styles from "../book.module.css";

function BookForm({ onSubmit }: any) {
  const [newBookData, setNewBookData] = useState({
    title: "",
    description: "",
  });

  const createBook = () => {
    onSubmit(newBookData);
    // setNewBookData({ title: "", description: "" });
  };
  return (
    <div className={styles.bookForm}>
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
    </div>
  );
}

export default BookForm;
