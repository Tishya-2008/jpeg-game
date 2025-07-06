let currentScreen = 0;

const easyMemes = ['e1.jpg', 'e2.jpg', 'e3.jpg', 'e4.jpg'];
const mediumMemes = ['m1.jpg', 'm2.jpg', 'm3.jpg', 'm4.jpg'];
const hardMemes = ['h1.jpg', 'h2.jpg', 'h3.jpg', 'h4.jpg'];

let chosenEasyMeme = null;
let chosenMediumMeme = null;
let chosenHardMeme = null;

function showScreen(index) {
  for (let i = 0; i <= 10; i++) {
    const screen = document.getElementById("screen-" + i);
    if (screen) {
      screen.classList.remove("active");
    }
  }
  const targetScreen = document.getElementById("screen-" + index);
  if (targetScreen) {
    targetScreen.classList.add("active");
  }
  currentScreen = index;

  document.querySelectorAll(".next-arrow").forEach(arrow => {
    arrow.style.display = "none";
  });

  if (![6, 7, 8].includes(index)) {
    const nextArrow = targetScreen?.querySelector(".next-arrow");
    if (nextArrow) nextArrow.style.display = "inline";
  }

  if (index === 6 && !chosenEasyMeme) {
    chosenEasyMeme = easyMemes[Math.floor(Math.random() * easyMemes.length)];
    const img = document.getElementById("easy-meme");
    if (img) {
      img.src = "memes/" + chosenEasyMeme;
      console.log("Chosen Easy Meme (screen-6):", chosenEasyMeme);
    }
  }

  if (index === 7 && !chosenMediumMeme) {
    chosenMediumMeme = mediumMemes[Math.floor(Math.random() * mediumMemes.length)];
    const img = document.getElementById("medium-meme");
    if (img) {
      img.src = "memes/" + chosenMediumMeme;
      console.log("Chosen Medium Meme (screen-7):", chosenMediumMeme);
    }
  }

  if (index === 8 && !chosenHardMeme) {
    chosenHardMeme = hardMemes[Math.floor(Math.random() * hardMemes.length)];
    const img = document.getElementById("hard-meme");
    if (img) {
      img.src = "memes/" + chosenHardMeme;
      console.log("Chosen Hard Meme (screen-8):", chosenHardMeme);
    }
  }
}

document.querySelectorAll(".next-arrow").forEach(function (arrow) {
  arrow.addEventListener("click", function () {
    if (currentScreen < 10) {
      showScreen(currentScreen + 1);
    }
  });
});

document.querySelectorAll(".back-arrow").forEach(function (arrow) {
  arrow.addEventListener("click", function () {
    if (currentScreen > 0) {
      showScreen(currentScreen - 1);
    }
  });
});

function setupWebcam(videoId, canvasId, buttonId, resultId) {
  const video = document.getElementById(videoId);
  const canvas = document.getElementById(canvasId);
  const ctx = canvas?.getContext('2d');
  const btn = document.getElementById(buttonId);
  const similarityDiv = document.getElementById(resultId);

  if (video && canvas && ctx && btn && similarityDiv) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { video.srcObject = stream; })
      .catch(err => alert("Webcam error: " + err));

    btn.onclick = () => {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      const base64Image = canvas.toDataURL('image/jpeg');

      let memeName = "";
      if (videoId === "webcam") {
        memeName = chosenEasyMeme?.replace('.jpg', '');
      } else if (videoId === "webcam-7") {
        memeName = chosenMediumMeme?.replace('.jpg', '');
      } else if (videoId === "webcam-8") {
        memeName = chosenHardMeme?.replace('.jpg', '');
      } else if (videoId === "webcam-9") {
        memeName = "sigma";
      }

      similarityDiv.textContent = "Comparing...";
      btn.disabled = true;

      fetch('http://127.0.0.1:5000/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64Image,
          meme_name: memeName
        })
      })
        .then(res => res.json())
        .then(data => {
          btn.disabled = false;

          if (data.error) {
            similarityDiv.textContent = "Error: " + data.error;
          } else {
            const similarityPercent = (data.similarity * 100).toFixed(1);
            similarityDiv.textContent = "Similarity Score: " + similarityPercent + "%";

            if (similarityPercent >= 60) {
              const nextArrow = video.closest(".screen")?.querySelector(".next-arrow");
              if (nextArrow) nextArrow.style.display = "inline";
            }
          }
        })
        .catch(() => {
          similarityDiv.textContent = "Error comparing poses";
          btn.disabled = false;
        });
    };
  }
}

setupWebcam("webcam", "canvas", "captureBtn", "similarityScore");
setupWebcam("webcam-7", "canvas-7", "captureBtn-7", "similarityScore-7");
setupWebcam("webcam-8", "canvas-8", "captureBtn-8", "similarityScore-8");
setupWebcam("webcam-9", "canvas-9", "captureBtn-9", "similarityScore-9");

const texts = [
  "In a world where memes reign supreme and raccoons hoard pastries like priceless treasure... ",
  "Kyle was always the second pick. His brother Marvin? A coding prodigy.",
  "Now, trapped in a raccoon-infested meme simulation created by Marvin (for 'research purposes'), Kyle must prove he's more than just “the other brother.”",
  "To escape, he must master the ancient art of meme mimicry, survive the stages of digital chaos, and fulfill a sacred Tim Hortons order."
];

const elementIds = [
  "typing-text",
  "typing-text1",
  "typing-text2",
  "typing-text3"
];

let lineIndex = 0;
let charIndex = 0;

function typeLine() {
  if (lineIndex >= texts.length) return;

  const currentElement = document.getElementById(elementIds[lineIndex]);
  if (!currentElement) {
    console.warn(`Element with id ${elementIds[lineIndex]} not found.`);
    lineIndex++;
    charIndex = 0;
    setTimeout(typeLine, 500);
    return;
  }

  if (charIndex < texts[lineIndex].length) {
    currentElement.textContent += texts[lineIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeLine, 50);
  } else {
    lineIndex++;
    charIndex = 0;
    setTimeout(typeLine, 700);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  elementIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });

  typeLine();
});

function setupMemeTransition(screenId, imgId) {
  const screen = document.getElementById(screenId);
  const img = document.getElementById(imgId);

  if (!screen || !img) {
    console.warn(`Missing screen or image element for ${screenId}, ${imgId}`);
    return;
  }

  img.style.transition = "transform 1s ease, opacity 1s ease";
  img.style.transform = "scale(0.5)";
  img.style.opacity = "0";

  const observer = new MutationObserver(() => {
    if (screen.classList.contains("active")) {
      img.style.transform = "scale(1)";
      img.style.opacity = "1";
    } else {
      img.style.transform = "scale(0.5)";
      img.style.opacity = "0";
    }
  });

  observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
}

setupMemeTransition("screen-6", "easy-meme");
setupMemeTransition("screen-7", "medium-meme");
setupMemeTransition("screen-8", "hard-meme");