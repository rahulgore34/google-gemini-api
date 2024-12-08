// Function to preview image
document.getElementById("image").addEventListener("change", function () {
  const previewDiv = document.getElementById("preview");
  const file = this.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewDiv.innerHTML = `<img src="${e.target.result}" alt="Image Preview">`;
    };
    reader.readAsDataURL(file); // Read file as data URL for image preview
  } else {
    previewDiv.innerHTML = "<p>No image selected</p>";
  }
});

document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    // Show spinner while uploading
    showSpinner();
    const formData = new FormData();
    const imageFile = document.getElementById("image").files[0];
    const comment = document.getElementById("comment").value;
    formData.append("image", imageFile);
    formData.append("promt", comment);
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      // document.getElementById('status').innerHTML = result?.answer;
      typeWriter(result?.answer, "status", 20); // Display text in typewriter effect
    } catch (error) {
      document.getElementById("status").textContent = "Error uploading image.";
    } finally {
      hideSpinner();
    }
  });

// Function for typewriter effect
function typeWriter(text, elementId, speed) {
  let i = 0;
  const element = document.getElementById(elementId);
  element.innerHTML = ""; // Clear any previous text

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      element.style.borderRight = "none"; // Remove blinking cursor effect when done
    }
  }

  type(); // Start typing
}

// Reset form function
document.getElementById("resetButton").addEventListener("click", () => {
  // Clear file input
  document.getElementById("image").value = "";

  // Clear image preview
  document.getElementById("preview").innerHTML = "<p>No image selected</p>";

  // Clear comment box
  document.getElementById("comment").value = "";

  // Clear status message
  document.getElementById("status").textContent = "";
});

// Function to show the spinner and mask
function showSpinner() {
  document.getElementById("mask").style.display = "block";
}

// Function to hide the spinner and mask
function hideSpinner() {
  document.getElementById("mask").style.display = "none";
}
