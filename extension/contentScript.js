let globalSegments = []; // Store segments globally
let apiCalled = false;
let currentVideoId = "";

// Function to create and style the button
async function fetchVideoSegments(videoId) {
  const response = await fetch("http://localhost:8000/ad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ video_id: videoId }),
  });
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  const data = await response.json();
  return data.response.segments; // Assuming the structure is as described
}

function getCurrentYouTubeVideoId() {
  const url = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("v");
  return videoId;
}

function createMyButton(videoPlayer, startTime, endTime) {
  const myButton = document.createElement("button");
  myButton.textContent = "Skip to End of Segment";
  myButton.style.position = "fixed";
  myButton.style.right = "20px";
  myButton.style.bottom = "20px";
  myButton.style.zIndex = "10000";
  myButton.style.display = "none"; // Start with the button hidden
  document.body.appendChild(myButton);

  // Event listener to skip to the end time of the current segment
  myButton.addEventListener("click", () => {
    videoPlayer.currentTime = endTime;
  });

  document.querySelector(videoPlayer).addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    // Assuming timeSegments is available here, adjust scope as necessary
    const shouldShow = timeSegments.some(
      ({ start, end }) => currentTime >= start && currentTime <= end
    );
    button.style.display = shouldShow ? "block" : "none";
  });

  return myButton;
}

// Function to determine if the current time is within the desired segments
// and get the end time of the current segment
function getSegmentInfo(videoPlayer) {
  const currentTime = videoPlayer.currentTime; // Current playback time in seconds
  for (let { start, end } of globalSegments) {
    if (currentTime >= start && currentTime < end) {
      return { showButton: true, endTime: end };
    }
  }
  return { showButton: false };
}

async function initialVideoPlayback() {
  setInterval(async () => {
    const videoId = getCurrentYouTubeVideoId();
    if (videoId && videoId !== currentVideoId) {
      currentVideoId = videoId;
      try {
        globalSegments = await fetchVideoSegments(getCurrentYouTubeVideoId()); // Fetch and store segments
        apiCalled = true;
      } catch (error) {
        apiCalled = true;
        alert("Failed to fetch video segments:");
        return; // Exit if segments can't be fetched
      }
    }
  }, 1000);
}

// Main function to monitor video playback and show/hide the button
function monitorVideoPlayback() {
  const videoPlayer = document.querySelector("video");
  let myButton = null;
  let lastEndTime = 0; // Cache the last end time to avoid recreating the button unnecessarily

  if (videoPlayer) {
    setInterval(() => {
      const { showButton, endTime } = getSegmentInfo(videoPlayer);
      if (showButton) {
        if (!myButton || lastEndTime !== endTime) {
          if (myButton) {
            myButton.remove(); // Remove the old button if it exists
          }
          myButton = createMyButton(videoPlayer, endTime);
          lastEndTime = endTime;
        }
        myButton.style.display = "block"; // Show the button
      } else if (myButton) {
        myButton.style.display = "none"; // Hide the button
      }
    }, 1000); // Check every second
  }
}

new MutationObserver(() => {
  const newVideoId = getCurrentYouTubeVideoId();
  if (newVideoId && newVideoId !== currentVideoId) {
    console.log("new video");
    currentVideoId = newVideoId;
  }
}).observe(document.body, { childList: true, subtree: true });

// initialVideoPlayback();
// monitorVideoPlayback();
