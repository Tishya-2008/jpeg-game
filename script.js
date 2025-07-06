let currentScreen = 0;

const easyMemes = ['e1.jpg', 'e2.jpg', 'e3.jpg', 'e4.jpg'];
const mediumMemes = ['m1.jpg', 'm2.jpg', 'm3.jpg', 'm4.jpg'];
const hardMemes = ['h1.jpg', 'h2.jpg', 'h3.jpg', 'h4.jpg'];

let chosenEasyMeme = null;
let chosenMediumMeme = null;
let chosenHardMeme = null;

function showScreen(index) {
  for (let i = 0; i <= 10; i++) {
    document.getElementById("screen-" + i).classList.remove("active");
  }
  document.getElementById("screen-" + index).classList.add("active");
  currentScreen = index;

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
  const ctx = canvas.getContext('2d');
  const btn = document.getElementById(buttonId);
  const similarityDiv = document.getElementById(resultId);

  if (video && canvas && btn && similarityDiv) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { video.srcObject = stream; })
      .catch(err => alert("Webcam error: " + err));

    btn.onclick = () => {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      ctx.restore();

      const base64Image = canvas.toDataURL('image/jpeg');

      // Determine meme name based on screen
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
          if (data.error) {
            similarityDiv.textContent = "Error: " + data.error;
          } else {
            similarityDiv.textContent = "Similarity Score: " + (data.similarity * 100).toFixed(1) + "%";
          }
        })
        .catch(() => {
          similarityDiv.textContent = "Error comparing poses";
        });
    };
  }
}

setupWebcam("webcam", "canvas", "captureBtn", "similarityScore");
setupWebcam("webcam-7", "canvas-7", "captureBtn-7", "similarityScore-7");
setupWebcam("webcam-8", "canvas-8", "captureBtn-8", "similarityScore-8");
setupWebcam("webcam-9", "canvas-9", "captureBtn-9", "similarityScore-9");
