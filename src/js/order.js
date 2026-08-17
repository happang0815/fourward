const API_BASE = "http://teacherdev09.kro.kr:10002/endpoint";
let productList = [];

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
    document.getElementById("loginRequiredMsg").innerText =
      "로그인이 필요합니다.";
  }

  loadProducts();
});

async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/api/products?page=0&size=100`);
    const result = await response.json();

    if (!response.ok || result.success === false) {
      document.getElementById("orderMsg").innerText =
        result.message || "상품을 불러오지 못했습니다.";
      return;
    }

    const data = result.data || result;
    productList = data.contents || data.content || data || [];
    const select = document.getElementById("productSelect");

    productList.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id;
      option.text = p.name;
      select.appendChild(option);
    });

    select.addEventListener("change", updateProductInfo);
    document
      .getElementById("quantity")
      .addEventListener("input", updateTotalPrice);

    updateProductInfo();
  } catch (error) {
    console.error("에러 발생:", error);
    document.getElementById("orderMsg").innerText =
      "상품을 불러오는 중 오류가 발생했습니다.";
  }
}

function updateProductInfo() {
  const select = document.getElementById("productSelect");
  const product = productList.find(
    (p) => String(p.id) === String(select.value),
  );

  if (!product) return;

  document.getElementById("selectedPrice").innerText = product.price;
  document.getElementById("selectedCategory").innerText = product.category;
  document.getElementById("selectedStock").innerText = product.stockQuantity;

  updateTotalPrice();
}

function updateTotalPrice() {
  const select = document.getElementById("productSelect");
  const product = productList.find(
    (p) => String(p.id) === String(select.value),
  );
  const quantity = Number(document.getElementById("quantity").value) || 0;

  const total = product ? product.price * quantity : 0;
  document.getElementById("totalPrice").innerText = total;
}

document.getElementById("orderBtn").addEventListener("click", async () => {
  const loginToken = sessionStorage.getItem("loginToken");

  if (!loginToken) {
    document.getElementById("loginRequiredMsg").innerText =
      "로그인이 필요합니다.";
    return;
  }

  const select = document.getElementById("productSelect");
  const productId = select.value;
  const productName = select.options[select.selectedIndex].text;
  const quantity = Number(document.getElementById("quantity").value);

  try {
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginToken}`,
      },
      body: JSON.stringify({
        items: [{ productId: productId, quantity: quantity }],
      }),
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      document.getElementById("orderMsg").innerText =
        result.message || "주문에 실패했습니다.";
      return;
    }

    const order = result.data;

    document.getElementById("orderMsg").innerText = "주문이 완료되었습니다.";
    document.getElementById("confirmOrderId").innerText = order.id;
    document.getElementById("confirmProductName").innerText = productName;
    document.getElementById("confirmQuantity").innerText = quantity;
    document.getElementById("confirmTotalPrice").innerText = order.totalPrice;
  } catch (error) {
    console.error("에러 발생:", error);
    document.getElementById("orderMsg").innerText =
      "주문 중 오류가 발생했습니다.";
  }
});
