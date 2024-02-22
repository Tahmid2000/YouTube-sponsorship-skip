const videoPlayerSelector = "video";
let currentVideoId = "";
let buttonDisplayed = false;

// Function to extract video ID from URL
function extractVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

// Function to call your API
async function fetchTimeSegments(videoId) {
  const response = await fetch("http://localhost:8000/ad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_id: videoId }),
  });
  if (!response.ok) {
    console.log(`API call failed: ${response.statusText}`);
  }
  const data = response.json();
  return data.response.segments; // Assuming the structure is as described
}

// Function to create and manage the button
function createButton() {
  if (buttonDisplayed) return; // Prevent multiple buttons
  const button = document.createElement("button");
  button.textContent = "Special Action";
  button.style.position = "fixed";
  button.style.right = "20px";
  button.style.bottom = "20px";
  button.style.zIndex = 1000;
  document.body.appendChild(button);
  buttonDisplayed = true;

  button.addEventListener("click", () => {
    console.log("Button clicked!");
    // Add button click functionality here
  });

  // Hide button initially
  button.style.display = "none";

  // Show or hide the button based on time segments
  document
    .querySelector(videoPlayerSelector)
    .addEventListener("timeupdate", (e) => {
      const currentTime = e.target.currentTime;
      // Assuming timeSegments is available here, adjust scope as necessary
      const shouldShow = timeSegments.some(
        ({ start, end }) => currentTime >= start && currentTime <= end
      );
      button.style.display = shouldShow ? "block" : "none";
    });
}

// Main function to initialize functionality
async function init() {
  const newVideoId = extractVideoId();
  if (newVideoId !== currentVideoId) {
    currentVideoId = newVideoId;
    const timeSegments = await fetchTimeSegments(currentVideoId);
    if (timeSegments) {
      createButton();
      // Consider storing timeSegments in a wider scope if needed for the button display logic
    }
  }
}

// Listener for URL changes without page reloads
new MutationObserver(() => {
  const newVideoId = extractVideoId();
  if (newVideoId && newVideoId !== currentVideoId) {
    init();
  }
}).observe(document.body, { childList: true, subtree: true });

// Initial check in case the script loads after navigation
init();
