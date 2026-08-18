const API_BASE = "http://teacherdev09.kro.kr:10002/endpoint";

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
      window.location.href = "index.html";
    });
  } else {
    authLink.textContent = "로그인";
    authLink.href = "login.html";
    document.getElementById("orderListLoginMsg").innerText =
      "로그인이 필요합니다.";
  }
});

document.getElementById("loadOrdersBtn").addEventListener("click", async () => {
  const loginToken = sessionStorage.getItem("loginToken");

  if (!loginToken) {
    document.getElementById("orderListLoginMsg").innerText =
      "로그인이 필요합니다.";
    return;
  }

  document.getElementById("orderListLoading").style.display = "block";
  document.getElementById("orderTableBody").innerHTML = "";
  document.getElementById("orderListEmpty").innerText = "";
  document.getElementById("listMsg").innerText = "";

  try {
    const response = await fetch(`${API_BASE}/api/orders/my`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });

    const result = await response.json();

    document.getElementById("orderListLoading").style.display = "none";

    if (!response.ok || result.success === false) {
      document.getElementById("listMsg").innerText =
        result.message || "주문내역을 불러오지 못했습니다.";
      return;
    }

    const orders = result.data || [];

    if (orders.length === 0) {
      document.getElementById("orderListEmpty").innerText =
        "주문 내역이 없습니다.";
      return;
    }

    const tbody = document.getElementById("orderTableBody");

    orders.forEach((order) => {
      const items = order.items || [];
      const productName = items.map((it) => it.productName).join(", ");
      const price = items.map((it) => it.orderPrice).join(", ");
      const quantity = items.map((it) => it.quantity).join(", ");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${productName}</td>
        <td>${price}</td>
        <td>${quantity}</td>
        <td>${order.totalPrice}</td>
        <td>${order.status}</td>
        <td>${order.orderDate}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error("에러 발생:", error);
    document.getElementById("orderListLoading").style.display = "none";
    document.getElementById("listMsg").innerText =
      "주문내역을 불러오는 중 오류가 발생했습니다.";
  }
});
