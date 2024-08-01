// DOM elements
let generateButton = [document.getElementById("generateButton1")];

let extractButton = [document.getElementById("extractButton1")];

let imageContainers = [document.getElementById("imageContainer1")];

let promptInputs = [document.getElementById("selectedWords1")];

let storyTexts = [document.getElementById("storyInput1")];

let suggestionButtons = [document.getElementById("suggestionButton1")];

const downloadButton = document.getElementById("downloadButton");

let activeContainerIndex = -1; // Initialize with a default value

downloadButton.addEventListener("click", downloadStoryJSON);


function displayErrorMessage(message) {
  // Create a div element to display the error message
  const errorDiv = document.createElement("div");
  errorDiv.textContent = message;
  errorDiv.classList.add("error-message"); // You can define a CSS class for styling

  // Append the error message div to the body or a specific container
  document.body.appendChild(errorDiv);
  
  // Automatically remove the error message after a certain time
  setTimeout(() => {
    errorDiv.remove();
  }, 5000); // Remove the error message after 5 seconds
}

// Generate image function
function generateImage(imageContainerIndex) {
  // Disable the button
  generateButton[imageContainerIndex].disabled = true;
  extractButton[imageContainerIndex].disabled = true;

  const selectedStyle = chooseStyleButton.textContent.replace(
    "Choose Style: ",
    ""
  );
  let prompt = promptInputs[imageContainerIndex].value;
  if (selectedStyle !== "none" && prompt.trim() !== "") {
    prompt += ` in the style of ${selectedStyle}`;
  }

  const height = 512;
  const width = 512;
  const steps = 50;
  const loadingSpinner = document.createElement("div");
  loadingSpinner.classList.add("loading-spinner");
  imageContainers[imageContainerIndex].appendChild(loadingSpinner);

  fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: prompt,
      height: height,
      width: width,
      steps: steps
    })
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }
      return response.blob();
    })
    .then((blob) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageURL = reader.result;
        const imageElement = document.createElement("img");
        imageElement.src = imageURL;
        imageElement.classList.add("generated-image");
        imageContainers[imageContainerIndex].innerHTML = "";
        imageContainers[imageContainerIndex].appendChild(imageElement);
        saveImageToLocalStorage(imageURL, prompt, storyTexts[imageContainerIndex].value, imageContainerIndex + 1);
        const downloadButton = document.createElement("button");
        downloadButton.innerHTML = '<i class="uil uil-import"></i>';
        downloadButton.classList.add("download-button"); // Add class to the download button
        downloadButton.addEventListener("click", () =>
          downloadImage(imageURL, prompt)
        );
        imageContainers[imageContainerIndex].appendChild(downloadButton);
      };
      reader.readAsDataURL(blob);
    })
    .catch((error) => {
      console.error(error);
      let errorMessage = error
      if (error == "Error: Failed to generate image") {
        errorMessage = "Failed to generate the image. Please try a different prompt.";
      }
      alert(errorMessage);

    })
    .finally(() => {
      // Re-enable the button
      loadingSpinner.remove();
      generateButton[imageContainerIndex].disabled = false;
      extractButton[imageContainerIndex].disabled = false;
      displaySavedImages(imageContainerIndex + 1);
    });
}

// Attach event listener to the generate button
generateButton[0].addEventListener("click", () => generateImage(0));

const extractKeywords = (storyTextIndex, max_ngram_size) => {
  const doc = storyTexts[storyTextIndex].value;

  fetch("/extract_keywords", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `doc=${encodeURIComponent(doc)}&max_ngram_size=${max_ngram_size}`
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to extract keywords");
      }
      return response.json();
    })
    .then((data) => {
      const keywords = data.keywords.join(", ");
      promptInputs[storyTextIndex].value = keywords;
    })
    .catch((error) => {
      console.error(error);
    });
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSelectedText(selectedWordsIndex) {
  var selectedText = "";
  if (window.getSelection) {
    selectedText = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    selectedText = document.selection.createRange().text;
  }

  // Update the selectedWords textarea based on the provided index
  const selectedWordsTextarea = document.getElementById(
    `selectedWords${selectedWordsIndex}`
  );
  if (selectedWordsTextarea) {
    selectedWordsTextarea.value = selectedText;
  }
}
extractButton[0].addEventListener("click", () => {
  const storyTextIndex = 0;
  const max_ngram_size = getRandomInt(1, 3);
  console.log(max_ngram_size);
  extractKeywords(storyTextIndex, max_ngram_size);
});

let areaDispCounter = 1;

function addEventListenersToNewElements(
  generateButtonElem,
  extractButtonElem,
  storyTextArea,
  imageContainerIndex
) {
  generateButtonElem.addEventListener("click", () =>
    generateImage(imageContainerIndex)
  );
  extractButtonElem.addEventListener("click", () => {
    const max_ngram_size = getRandomInt(1, 10);
    extractKeywords(imageContainerIndex, max_ngram_size);
  });
  storyTextArea.addEventListener("mouseup", () =>
    getSelectedText(imageContainerIndex + 1)
  );
  storyTextArea.addEventListener("keyup", () =>
    getSelectedText(imageContainerIndex + 1)
  );
}

const addNewAreaButton = document.getElementById("addNewAreaButton");

function createNewArea() {
  // Increment the counter for each new "area-disp" section created
  areaDispCounter++;

  // Create the new elements
  const newAreaDiv = document.createElement("div");
  newAreaDiv.classList.add("area-disp");
  newAreaDiv.classList.add("margin-top");


  const labelsDiv = document.createElement("div");
  labelsDiv.classList.add("labels-disp");

  const savedImagesLabel = document.createElement("div");
  savedImagesLabel.classList.add("saved-images-label");
  savedImagesLabel.textContent = 'Click to see previous images';


  const partLabel = document.createElement("div");
  partLabel.classList.add("part-label");
  partLabel.textContent = `Part ${areaDispCounter}`;

  labelsDiv.appendChild(partLabel)
  labelsDiv.appendChild(savedImagesLabel)

  const storyDiv = document.createElement("div");

  const storyTextArea = document.createElement("textarea");
  storyTextArea.classList.add("story-text"); // Add the "story-text" class
  storyTextArea.id = `storyInput${areaDispCounter}`; // Assign a unique ID based on the counter
  storyTextArea.placeholder = "Write your story here";


  const extractButtonElem = document.createElement("button");
  extractButtonElem.textContent = "Automatically Generate Description";
  extractButtonElem.id = `extractButton${areaDispCounter}`;
  extractButtonElem.classList.add("automatic-button"); // Add the "automatic-button" class

  const automaticGenerateDiv = document.createElement("div");
  automaticGenerateDiv.classList.add("automatic-generate-disp");

  const generateText = document.createElement("div");
  generateText.textContent =
    "Click to generate image keywords";
  generateText.classList.add("generate-text");

  automaticGenerateDiv.appendChild(generateText);
  automaticGenerateDiv.appendChild(extractButtonElem);

  storyDiv.appendChild(storyTextArea);
  storyDiv.appendChild(automaticGenerateDiv);


  const generateButtonElem = document.createElement("button");
  generateButtonElem.textContent = "Generate Image";
  generateButtonElem.id = `generateButton${areaDispCounter}`;
  generateButtonElem.classList.add("generate-button"); // Add the "generate-button" class

  const illustrateDiv = document.createElement("div");
  illustrateDiv.classList.add("illustrate-disp");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("gen-image"); // Add the "gen-image" class
  imageContainer.id = `imageContainer${areaDispCounter}`;

  const illustrateBox = document.createElement("div");
  illustrateBox.classList.add("illustrate-box"); // Add the "illustrate-box" class

  const selectedWordsInput = document.createElement("textarea");
  selectedWordsInput.type = "text";
  selectedWordsInput.placeholder = "Write your own image description here";
  selectedWordsInput.classList.add("input-box"); // Add the "input-box" class
  selectedWordsInput.id = `selectedWords${areaDispCounter}`; // Assign a unique ID based on the counter



  const suggestionButtonElem = document.createElement("button");
  suggestionButtonElem.textContent = "Suggestions";
  suggestionButtonElem.id = `suggestionButton${areaDispCounter}`;
  suggestionButtonElem.classList.add("suggestion-button"); // Add the "suggestion-button" class

  // Add event listener to the "Suggestions" button to open the suggestion modal
  suggestionButtonElem.addEventListener("click", () =>
    openSuggestionModal(areaDispCounter)
  );

  illustrateBox.appendChild(selectedWordsInput);
  illustrateBox.appendChild(suggestionButtonElem);
  illustrateBox.appendChild(generateButtonElem);


  const imageContainerSaved = document.createElement("div");
  imageContainerSaved.id = `savedImagesContainer${areaDispCounter}`; // Assign a unique ID based on the counter

  illustrateDiv.appendChild(imageContainer);
  illustrateDiv.appendChild(illustrateBox);
  illustrateDiv.appendChild(imageContainerSaved);

  newAreaDiv.appendChild(labelsDiv);
  newAreaDiv.appendChild(storyDiv);
  newAreaDiv.appendChild(illustrateDiv);

  // Append the new "area-disp" section to the document
  const container = document.getElementById("container");
  container.appendChild(newAreaDiv);

  // Update the arrays with the newly created elements
  generateButton.push(generateButtonElem);
  extractButton.push(extractButtonElem);
  imageContainers.push(imageContainer);
  promptInputs.push(selectedWordsInput);
  storyTexts.push(storyTextArea);

  // Add event listeners to the newly created elements
  addEventListenersToNewElements(
    generateButtonElem,
    extractButtonElem,
    storyTextArea,
    areaDispCounter - 1
  );

  displaySavedImages(areaDispCounter);
}

function saveImageToLocalStorage(imageURL, prompt, storyText, partNumber) {
  try {
      const savedImages = JSON.parse(localStorage.getItem("savedImages")) || {};
      const savedImagesForPart = savedImages[partNumber] || [];
      
      savedImagesForPart.push({ imageURL, prompt, storyText });
      
      if (savedImagesForPart.length > 3) {
          savedImagesForPart.shift();
      }
      
      savedImages[partNumber] = savedImagesForPart;
      
      localStorage.setItem("savedImages", JSON.stringify(savedImages));
  } catch (error) {
      console.error("Error while saving image to localStorage:", error);
      // Handle the error gracefully, perhaps by notifying the user
  }
}



function getSavedImagesFromLocalStorage(partNumber) {
  let savedImages = JSON.parse(localStorage.getItem("savedImages")) || {};
  return savedImages[partNumber] || [];
}

function displaySavedImages(partNumber) {
  const savedImages = getSavedImagesFromLocalStorage(partNumber);
  const savedImagesContainer = document.getElementById(
    `savedImagesContainer${partNumber}`
  );

  // Check if the container exists before proceeding
  if (!savedImagesContainer) return;


  savedImagesContainer.innerHTML = "";

  if (Array.isArray(savedImages)) {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("saved-image-container");
    for (let i = savedImages.length - 1; i >= 0; i--) {
      const { imageURL, prompt, storyText } = savedImages[i];
      if (imageURL) {
        const imageElement = document.createElement("img");
        imageElement.src = imageURL;
        imageElement.classList.add("saved-image");
        imageElement.addEventListener("click", () =>
          openModalWithImage(imageURL, prompt, storyText)
        ); // Add event listener to open modal
        imageContainer.appendChild(imageElement);
      }
    }
    savedImagesContainer.appendChild(imageContainer);
  }
}

for (let i = 0; i < areaDispCounter; i++) {
  displaySavedImages(i + 1);
}

function openModalWithImage(imageURL, prompt, storyText) {
  // Create the modal container
  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");

  // Create the modal content
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Create the image element
  const imageElement = document.createElement("img");
  imageElement.src = imageURL;
  imageElement.classList.add("modal-image");

  // Create the prompt text element
  const promptText = document.createElement("p");
  promptText.textContent = `Keywords: ${prompt}`;

  const storyTextElement = document.createElement("p");
  storyTextElement.textContent = `Story Text: ${storyText}`;

  // Create the download button
  const downloadButton = document.createElement("button");
  downloadButton.innerHTML = '<i class="uil uil-import"></i>';
  downloadButton.addEventListener("click", () =>
    downloadImage(imageURL, prompt)
  );

  const storyAndKeywords = document.createElement("div");
  storyAndKeywords.classList.add("modal-story-keywords");
  storyAndKeywords.appendChild(storyTextElement);
  storyAndKeywords.appendChild(promptText);

  const imageAndDownload = document.createElement("div");
  imageAndDownload.appendChild(imageElement);
  imageAndDownload.appendChild(downloadButton);
  imageAndDownload.classList.add("modal-image-download");



  // Append elements to the modal content
  modalContent.appendChild(storyAndKeywords);
  modalContent.appendChild(imageAndDownload);



  // Append the modal content to the modal container
  modalContainer.appendChild(modalContent);

  // Append the modal container to the document body
  document.body.appendChild(modalContainer);

  // Add a click event listener to close the modal when clicked outside
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      modalContainer.remove();
    }
  });
}

function downloadImage(imageURL, prompt) {
  // Create a temporary anchor element
  const downloadLink = document.createElement("a");
  downloadLink.href = imageURL;
  downloadLink.download = `ai_image_${prompt}.png`; // Set the default download filename

  // Simulate a click on the anchor element to trigger the download
  downloadLink.click();
}


document.addEventListener("DOMContentLoaded", function() {
  const chooseStyleButton = document.getElementById("chooseStyleButton");
  const styleGalleryModal = document.getElementById("styleGalleryModal");

  // Event listener for the "Choose Style" button to open the modal
  chooseStyleButton.addEventListener("click", () => {
    styleGalleryModal.style.display = "block";
  });
});

styleGalleryModal.addEventListener("click", (event) => {
  if (event.target === styleGalleryModal) {
    styleGalleryModal.style.display = "none";
  }
});




// Get references to the close button and the style options in the modal
const styleOptions = document.querySelectorAll(".style-option img");

// // Event listener for the close button to close the modal
// closeStyleGalleryButton.addEventListener("click", () => {
//   styleGalleryModal.style.display = "none";
// });

styleOptions.forEach((styleOption) => {
  styleOption.addEventListener("click", (event) => {
    // Get the selected style from the data-style attribute
    const selectedStyle = styleOption.getAttribute("data-style");

    handleStyleSelection(event);

    // Apply the selected style to the image generation process (implement this part based on your image generation logic)
    console.log("Selected Style:", selectedStyle);

    // Update the "Choose Style" button text
    chooseStyleButton.textContent = `Choose Style: ${selectedStyle}`;

    // Close the style gallery modal
    styleGalleryModal.style.display = "none";
  });
});

styleGalleryModal.addEventListener("click", (event) => {
  if (event.target === styleGalleryModal) {
    styleGalleryModal.style.display = "none";
  }
});

function handleStyleSelection(event) {
  const selectedStyle = event.currentTarget.dataset.style; // Use currentTarget instead of target
  if (selectedStyle) {
    // Update the button text to reflect the selected style
    chooseStyleButton.textContent = `Choose Style: ${selectedStyle}`;

    styleGalleryModal.style.display = "none"; // Close the style gallery modal
  }
}

// Get references to the suggestion button, the suggestion modal, and the close button in the modal
const suggestionModal = document.getElementById("suggestionModal");

suggestionModal.addEventListener("click", (event) => {
  if (event.target === suggestionModal) {
    suggestionModal.style.display = "none";
  }
});

suggestionButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    suggestionModal.style.display = "block";
    activeContainerIndex = index; // Update the activeContainerIndex when the button is clicked
  });
});




function applySuggestion(suggestion) {
  console.log("activeContainerIndex:", activeContainerIndex);
  if (activeContainerIndex !== -1) {
    // Check if an active container index has been set
    const currentPrompt = promptInputs[activeContainerIndex].value;
    promptInputs[activeContainerIndex].value = `${currentPrompt} ${suggestion}`;
    suggestionModal.style.display = "none"; // Close the suggestion modal
  } else {
    console.error("No active container index set.");
  }
}

// Event listener for the suggestion button to open the suggestion modal and set the activeContainerIndex
suggestionButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    activeContainerIndex = index - 1;
    suggestionModal.style.display = "block"; // Show the suggestion modal for the corresponding section
  });
});

function openSuggestionModal(imageContainerIndex) {
  // Show the suggestion modal for the corresponding section
  suggestionModal.style.display = "block";
  activeContainerIndex = imageContainerIndex - 1;
}

suggestionButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    activeContainerIndex = index;
    suggestionModal.style.display = "block"; // Show the suggestion modal for the corresponding section
  });
});

function downloadStoryJSON() {
  const storyDataArray = [];

  // Loop through all the image containers
  for (let imageContainerIndex = 0; imageContainerIndex < imageContainers.length; imageContainerIndex++) {
    const imageURL = imageContainers[imageContainerIndex].querySelector("img").src;
    const prompt = promptInputs[imageContainerIndex].value;
    const storyText = storyTexts[imageContainerIndex].value;

    // Create a JSON object for the current container
    const storyData = {
      storyText: storyText,
      prompt: prompt,
      imageURL: imageURL,
    };

    storyDataArray.push(storyData);
  }

  // Convert the array of JSON objects to a JSON string
  const jsonString = JSON.stringify(storyDataArray, null, 2);

  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary anchor element to trigger the download
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "story.json"; // Set the download filename

  // Simulate a click on the anchor element to trigger the download
  downloadLink.click();
}

function clearCacheForAllParts() {
  try {
    const savedImages = JSON.parse(localStorage.getItem("savedImages")) || {};

    // Clear the cache for all parts
    for (const partNumber in savedImages) {
      savedImages[partNumber] = [];
    }

    localStorage.setItem("savedImages", JSON.stringify(savedImages));

    // Update the displayed images for all parts
    for (const partNumber in savedImages) {
      displaySavedImages(partNumber);
    }
  } catch (error) {
    console.error("Error while clearing cache:", error);
    // Handle the error gracefully, perhaps by notifying the user
  }
}
const clearCacheButton = document.getElementById("clearCacheButton");
  if (clearCacheButton) {
    clearCacheButton.addEventListener("click", () => {
      clearCacheForAllParts();
      alert("Cache cleared for all parts.");
    });
  }


// JavaScript function to open the image modal
function openImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const generatedImage = document.getElementById('imageContainer1'); // Update to the correct ID

    const { imageURL, prompt, storyText } = savedImages[0];
    if (imageURL) {
      const imageElement = document.createElement("img");
      imageElement.src = imageURL;
      imageElement.classList.add("saved-image");
      imageElement.addEventListener("click", () =>
        openModalWithImage(imageURL, prompt, storyText)
      ); // Add event listener to open modal
      imageContainer.appendChild(imageElement);
  


    // Show the modal
    modal.style.display = 'block';
  }
}

// Rest of your code remains the same


// JavaScript function to close the image modal
function closeImageModal() {
  const modal = document.getElementById('imageModal');

  // Hide the modal
  modal.style.display = 'none';
}

// Close the modal if the user clicks outside the modal content
window.onclick = function (event) {
  const modal = document.getElementById('imageModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};
