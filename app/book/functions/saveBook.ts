export const saveBookToServer = async (bookData: any) => {
  try {
    const response = await fetch("/api/saveBook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      throw new Error("Error saving book");
    }

    // Handle success, e.g., show a success message to the user.
    console.log("Book saved successfully!");
  } catch (error) {
    // Handle errors, e.g., show an error message to the user.
    console.error("Error saving book:", error);
  }
};

export const saveSectionToServer = async (sectionData: any) => {
  try {
    const response = await fetch("/api/saveSection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sectionData),
    });

    if (!response.ok) {
      throw new Error("Error saving section");
    }

    // Handle success, e.g., show a success message to the user.
    console.log("Section saved successfully!");
  } catch (error) {
    // Handle errors, e.g., show an error message to the user.
    console.error("Error saving section:", error);
  }
};

export const saveSubsectionToServer = async (subsectionData: any) => {
  try {
    const response = await fetch("/api/saveSubsection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subsectionData),
    });

    if (!response.ok) {
      throw new Error("Error saving subsection");
    }

    // Handle success, e.g., show a success message to the user.
    console.log("Subsection saved successfully!");
  } catch (error) {
    // Handle errors, e.g., show an error message to the user.
    console.error("Error saving subsection:", error);
  }
};
