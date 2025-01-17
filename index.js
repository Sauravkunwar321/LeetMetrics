document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-button");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");

  //validate and return true or false based on regex(regular expression)
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch the user details");
      }
      const parsedData = await response.json();
      console.log("logging data:", parsedData);

      displayUserData(parsedData);
    } catch (error) {
      statsContainer.innerHTML = "<p>No data found</p>";
      console.error("Error fetching user details", error);
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
    console.log(`Updated progress: ${progressDegree}% for`, circle);
  }

  function displayUserData(parsedData) {
    const totalQues = parsedData.totalQuestions;
    const totalEasyQues = parsedData.totalEasy || 0;
    const totalMediumQues = parsedData.totalMedium || 0;
    const totalHardQues = parsedData.totalHard || 0;

    const solvedTotalQues = parsedData.totalSolved;
    const solvedTotalEasyQues = parsedData.easySolved || 0;
    const solvedTotalMediumQues = parsedData.mediumSolved || 0;
    const solvedTotalHardQues = parsedData.hardSolved || 0;

    updateProgress(
      solvedTotalEasyQues,
      totalEasyQues,
      easyLabel,
      easyProgressCircle
    );

    updateProgress(
      solvedTotalMediumQues,
      totalMediumQues,
      mediumLabel,
      mediumProgressCircle
    );

    updateProgress(
      solvedTotalHardQues,
      totalHardQues,
      hardLabel,
      hardProgressCircle
    );
  

  const cardData = [
    {
      label: "Overall Submissions",
      value: parsedData.totalSolved,
    },
    {
      label: "Overall Easy Submissions",
      value: parsedData.easySolved,
    },
    {
      label: "Overall Medium Submissions",
      value: parsedData.mediumSolved,
    },
    {
      label: "Overall Hard Submissions",
      value: parsedData.hardSolved,
    },
  ];
  console.log("card ko data", cardData);

}

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value.trim();
    console.log("Logging username: ", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
