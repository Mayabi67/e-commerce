// random public compression socks video
// (you can replace with specific link later if you want)
// const videoContainer = document.getElementById("videoContainer");

// const videoID = "nNbmNuzIO98"; // chosen random helpful instructional video

// videoContainer.innerHTML = `
//   <iframe
//     src="https://www.youtube.com/embed/${videoID}"
//     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//     allowfullscreen
//   ></iframe>
// `;

// https://www.youtube.com/watch?v=nNbmNuzIO98

const videoContainer = document.getElementById("videoContainer");

videoContainer.innerHTML = `
  <video width="80%" height="400" controls>
    <source src="socks.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
`;
