document.addEventListener("DOMContentLoaded", () => {
  const authLink = document.getElementById("auth-link");
  const loginToken = sessionStorage.getItem("loginToken");

  if (loginToken) {
    authLink.textContent = "로그아웃";
    authLink.href = "#";
    authLink.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("loginToken");
      alert("로그아웃 되었습니다.");
      window.location.href = "login.html";
    });
  } else {
    authLink.textContent = "로그인";
    authLink.href = "login.html";
  }
});
