// Wait for the DOM content to be fully loaded before executing the code
document.addEventListener("DOMContentLoaded", function () {
  // Function to check if a cookie exists

  function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  // Check if the 'userToken' cookie exists
  const userToken = getCookie("userToken");

  // Get the login button element
  const loginButton = document.getElementById("loginButton");

  // Change the color of the login button text based on the existence of the 'userToken' cookie
  if (userToken) {
    // User is logged in
    loginButton.style.color = "green";
    loginButton.innerText = "Log out";
  } else {
    // User is not logged in
    loginButton.style.color = "red";
    loginButton.innerText = "Log In";
    // trigger logout callback
  }
  loginButton.addEventListener("click", function () {
    const possibleUrl = window.location.href;
    const url = possibleUrl.includes("localhost")
      ? "/logout"
      : "https://www.doc.gold.ac.uk/usr/454/logout";
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
