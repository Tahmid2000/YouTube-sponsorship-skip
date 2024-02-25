let currentVideoId = "";
let globalSegments = []; // Store segments globally
let cleanUpFunction = null;

function getCurrentYouTubeVideoId() {
  const url = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("v");
  if (!videoId || videoId == null) {
    return "";
  }
  return videoId;
}

async function fetchVideoSegments(videoId) {
  try {
    const response = await fetch(
      "https://sponsorskip-api.azurewebsites.net/ad",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_id: videoId }),
      }
    );
    //   if (!response.ok) {
    //     throw new Error(`API call failed: ${response.statusText}`);
    //   }
    const data = await response.json();
    // return data.response.segments;
    return [
      {
        start: 289.72,
        end: 366.08,
      },
    ];
  } catch (error) {
    return [];
  }
}

function waitForVideoPlayer() {
  return new Promise((resolve, reject) => {
    // Check if the video player already exists
    let videoPlayer = document.querySelector("video");
    if (videoPlayer) {
      resolve(videoPlayer);
      return;
    }

    // Use MutationObserver to wait for the video player
    const observer = new MutationObserver((mutations, obs) => {
      videoPlayer = document.querySelector("video");
      if (videoPlayer) {
        resolve(videoPlayer);
        obs.disconnect(); // Stop observing once the video player is found
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Optional: Reject the promise after a timeout if the video player isn't found
    setTimeout(() => {
      obs.disconnect(); // Ensure to clean up the observer
      reject(new Error("Video player not found within the timeout period."));
    }, 10000); // Timeout after 10 seconds, for example
  });
}

function manageSegmentButtons(videoPlayer, segments) {
  const videoContainer = document.querySelector(".html5-video-player");
  const button = document.createElement("button");
  button.textContent = "Skip Ad";
  button.style.position = "absolute";
  button.style.right = "30px";
  button.style.bottom = "70px";
  button.style.zIndex = "3000";
  button.style.background = "rgba(0,0,0,.6)";
  button.style.color = "#fff";
  button.style.fontFamily = '"Roboto",Arial,sans-serif';
  button.style.fontSize = "14px";
  button.style.fontWeight = "500";
  button.style.height = "36px";
  button.style.lineHeight = "normal";
  button.style.minWidth = "0";
  button.style.padding = "0 16px 0 16px";
  button.style.width = "auto";
  button.style.borderRadius = "18px";
  button.style.border = "none";
  button.style.cursor = "pointer";

  button.style.display = "none"; // Hidden by default
  button.classList.add("sponsorskip-button");
  //   document.body.appendChild(button);
  videoContainer.appendChild(button);
  let currentSegment = null;

  // Function to check and update button visibility
  function updateButtonVisibility() {
    const currentTime = videoPlayer.currentTime;
    const relevantSegment = segments.find(
      (segment) => currentTime >= segment.start && currentTime < segment.end
    );

    if (relevantSegment && currentSegment !== relevantSegment) {
      button.style.display = "block";
      button.onclick = () => {
        videoPlayer.currentTime = relevantSegment.end;
      };
      currentSegment = relevantSegment;
    } else if (!relevantSegment) {
      button.style.display = "none";
      currentSegment = null;
    }
  }

  // Listen for time updates to show/hide the button
  videoPlayer.addEventListener("timeupdate", updateButtonVisibility);

  // Cleanup function to be called on video change
  function cleanup() {
    console.log("cleaned up buttons");
    videoPlayer.removeEventListener("timeupdate", updateButtonVisibility);
    button.remove();
  }

  return cleanup;
}

async function init(videoId) {
  let timeSegments = await fetchVideoSegments(videoId);
  console.log(timeSegments);
  try {
    const videoPlayer = await waitForVideoPlayer();
    console.log("video player found");
    // Now that you have the video player, call your function
    cleanUpFunction = manageSegmentButtons(videoPlayer, timeSegments);
  } catch (error) {
    console.error(error);
  }
}

new MutationObserver(() => {
  const newVideoId = getCurrentYouTubeVideoId();
  if (newVideoId && newVideoId !== currentVideoId) {
    console.log("new video");
    if (cleanUpFunction) {
      cleanUpFunction();
      cleanUpFunction = null;
    }
    currentVideoId = newVideoId;
    init(newVideoId);
  }
}).observe(document.body, { childList: true, subtree: true });
