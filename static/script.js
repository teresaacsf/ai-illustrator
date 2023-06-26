// DOM elements
const generateButton = [
  document.getElementById('generateButton1'),
  document.getElementById('generateButton2'),
  document.getElementById('generateButton3')
];
const extractButton = [
  document.getElementById('extractButton1'),
  document.getElementById('extractButton2'),
  document.getElementById('extractButton3')
];
const imageContainers = [
  document.getElementById('imageContainer1'),
  document.getElementById('imageContainer2'),
  document.getElementById('imageContainer3')
];
const promptInputs = [
  document.getElementById('selectedWords1'),
  document.getElementById('selectedWords2'),
  document.getElementById('selectedWords3')
];
const storyTexts = [
  document.getElementById('storyInput1'),
  document.getElementById('storyInput2'),
  document.getElementById('storyInput3')
];

// Generate image function
function generateImage(imageContainerIndex) {
  // Disable the button
  generateButton[imageContainerIndex].disabled = true;
  extractButton[imageContainerIndex].disabled = true;


  const prompt = promptInputs[imageContainerIndex].value;
  const height = 128;
  const width = 128;
  const steps = 50;

  console.log(imageContainerIndex);

  fetch('/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: prompt,
      height: height,
      width: width,
      steps: steps,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to generate image');
        console.log(response)
      }
      return response.blob();
    })
    .then((blob) => {
      const imageURL = URL.createObjectURL(blob);
      const imageElement = document.createElement('img');
      imageElement.src = imageURL;
      imageContainers[imageContainerIndex].innerHTML = '';
      imageContainers[imageContainerIndex].appendChild(imageElement);
    })
 .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      // Re-enable the button
      generateButton[imageContainerIndex].disabled = false;
      extractButton[imageContainerIndex].disabled = false;

    });
}

// Attach event listener to the generate button
generateButton[0].addEventListener('click', () => generateImage(0));
generateButton[1].addEventListener('click', () => generateImage(1));
generateButton[2].addEventListener('click', () => generateImage(2));

const extractKeywords = (storyTextIndex) => {
  const doc = storyTexts[storyTextIndex].value;
  

  fetch('/extract_keywords', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `doc=${encodeURIComponent(doc)}`,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to extract keywords');
      }
      return response.json();
    })
    .then((data) => {
      const keywords = data.keywords.join(', ');
      promptInputs[storyTextIndex].value = keywords;
      generateImage(storyTextIndex);

    })
    .catch((error) => {
      console.error(error);
    });

};


function getSelectedText1() {
  var selectedText = "";
  if (window.getSelection) {
      selectedText = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      selectedText = document.selection.createRange().text;
  }
  
  document.getElementById("selectedWords1").value = selectedText;
}

function getSelectedText2() {
  var selectedText = "";
  if (window.getSelection) {
      selectedText = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      selectedText = document.selection.createRange().text;
  }
  
  document.getElementById("selectedWords2").value = selectedText;
}

function getSelectedText3() {
  var selectedText = "";
  if (window.getSelection) {
      selectedText = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
      selectedText = document.selection.createRange().text;
  }
  
  document.getElementById("selectedWords3").value = selectedText;
}


  
