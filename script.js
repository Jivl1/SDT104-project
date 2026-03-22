// Product catalog — single source of truth for all product data.
// Stock values are fixed per drop (not randomized) so counts stay consistent.
const PRODUCTS = [
  { name: "DECONSTRUCTED JACKET", price: 420, cat: "jackets",     sizes: "S — XL",   stock: 4 },
  { name: "RAW DENIM 01",         price: 280, cat: "denim",       sizes: "28 — 36",  stock: 7 },
  { name: "CARGO TROUSERS JP",    price: 320, cat: "denim",       sizes: "28 — 38",  stock: 3 },
  { name: "LEATHER BELT 01",      price: 95,  cat: "belts",       sizes: "ONE SIZE", stock: 6 },
  { name: "SELVEDGE DENIM JP",    price: 360, cat: "denim",       sizes: "28 — 38",  stock: 2 },
  { name: "LEATHER JACKET 02",    price: 680, cat: "leather",     sizes: "S — XL",   stock: 5 },
  { name: "BUCKLE BOOTS 01",      price: 440, cat: "shoes",       sizes: "40 — 46",  stock: 4 },
  { name: "OVERSIZED CREWNECK",   price: 195, cat: "sweatshirts", sizes: "S — XXL",  stock: 8 },
  { name: "WAXED CANVAS JACKET",  price: 520, cat: "jackets",     sizes: "S — XL",   stock: 3 },
  { name: "ITALIAN DENIM 01",     price: 310, cat: "denim",       sizes: "28 — 36",  stock: 6 },
  { name: "LEATHER VEST 01",      price: 390, cat: "leather",     sizes: "S — XL",   stock: 4 },
  { name: "LOGO TEE ARCHIVE",     price: 85,  cat: "sweatshirts", sizes: "S — XXL",  stock: 7 },
];

// Cart state — array of { name, price, qty } objects
let cart = [];

// Reusable SVG placeholder blocks (avoids repetition in template strings)
const THUMB_SM = `<svg width="32" height="32" viewBox="0 0 32 32" class="ph"><rect width="32" height="32" fill="#555"/></svg>`;
const THUMB_XS = `<svg width="24" height="24" viewBox="0 0 24 24" class="ph"><rect width="24" height="24" fill="#000"/></svg>`;


/* ── NAVIGATION ─────────────────────────────────────────── */

// Switch the visible page and update the active nav link.
// This replaces browser routing since the whole site is a single HTML file.
function go(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");

  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  const activeLink = document.getElementById("nl-" + id);
  if (activeLink) activeLink.classList.add("active");

  window.scrollTo(0, 0);
  if (id === "shop") renderGrid("all");
}


/* ── SHOP GRID ──────────────────────────────────────────── */

// Build the product grid for a given category.
// Passing "all" skips filtering entirely.
function renderGrid(cat) {
  const list = cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  document.getElementById("pcount").textContent = list.length;

  document.getElementById("shop-grid").innerHTML = list.map(p => `
    <div class="sp" role="button" tabindex="0" onclick="addToCart('${p.name}', ${p.price})">
      <div class="sp-thumb">
        ${THUMB_SM}
        <div class="sp-quick">+ ADD TO CART</div>
      </div>
      <div class="sp-info">
        <div class="sp-row">
          <span class="sp-name">${p.name}</span>
          <span class="sp-price">€${p.price}</span>
        </div>
        <div class="sp-sub">
          <span class="sp-sizes">${p.sizes}</span>
          <span class="sp-left">${p.stock} left</span>
        </div>
      </div>
    </div>`).join("");
}

function filter(btn, cat) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderGrid(cat);
}


/* ── CART ───────────────────────────────────────────────── */

function toggleCart() {
  document.getElementById("cart-overlay").classList.toggle("open");
  renderCart();
}

// Add a product to the cart, or increment quantity if it's already there.
function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCount();
  renderCart();
  toast(name + " ADDED");
}

function updateCount() {
  document.getElementById("cart-count").textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
  const body = document.getElementById("cart-body");
  const foot = document.getElementById("cart-foot");

  if (!cart.length) {
    body.innerHTML = `<div class="c-empty">
      <p>Your cart is empty</p>
      <button class="btn btn-black" onclick="toggleCart(); go('shop')">SHOP NOW</button>
    </div>`;
    foot.style.display = "none";
    return;
  }

  body.innerHTML = cart.map((item, i) => `
    <div class="c-item">
      <div class="c-item-thumb">${THUMB_XS}</div>
      <div>
        <div class="c-item-name">${item.name}</div>
        <div class="c-item-size">SIZE M</div>
        <div class="c-qty">
          <button class="cq-btn" onclick="chQty(${i}, -1)">−</button>
          <span class="cq-val">${item.qty}</span>
          <button class="cq-btn" onclick="chQty(${i}, 1)">+</button>
        </div>
        <div class="c-remove" role="button" tabindex="0" onclick="rmItem(${i})">REMOVE</div>
      </div>
      <div class="c-item-price">€${item.price * item.qty}</div>
    </div>`).join("");

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("cart-total").textContent = "€" + total;
  foot.style.display = "block";
}

// Adjust quantity; remove item automatically if it drops to zero
function chQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  updateCount();
  renderCart();
}

function rmItem(i) {
  cart.splice(i, 1);
  updateCount();
  renderCart();
}

function checkout() {
  cart = [];
  updateCount();
  renderCart();
  toast("ORDER PLACED — THANK YOU");
  setTimeout(toggleCart, 1400);
}


/* ── FAQ ACCORDION ──────────────────────────────────────── */

// Toggle a single FAQ item open/closed.
// Closing all items first ensures only one is ever open at a time.
function faq(el) {
  const ans = el.querySelector(".faq-ans");
  const isOpen = el.classList.contains("open");

  document.querySelectorAll(".faq-item").forEach(item => {
    item.classList.remove("open");
    item.querySelector(".faq-ans").style.maxHeight = "0";
  });

  if (!isOpen) {
    el.classList.add("open");
    ans.style.maxHeight = ans.scrollHeight + "px";
  }
}


/* ── NEWSLETTER ─────────────────────────────────────────── */

function handleNL(e) {
  e.preventDefault();
  e.target.querySelector("input").value = "";
  toast("WELCOME TO THE ARCHIVE");
}


/* ── TOAST NOTIFICATION ─────────────────────────────────── */

// Show a short-lived notification at the bottom of the screen.
// Resets the timer if called again before the previous toast disappears.
let toastTmr;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTmr);
  toastTmr = setTimeout(() => t.classList.remove("show"), 2200);
}


/* ── INIT ───────────────────────────────────────────────── */

// Assign base64 hero images defined in data.js
document.getElementById("b64-img-1").src = IMAGE_1;
document.getElementById("b64-img-2").src = IMAGE_2;

// Latest strip is built once at load — it doesn't change with cart state
document.getElementById("latest-strip").innerHTML = PRODUCTS.slice(0, 6).map(p =>
  `<div class="c-litem" role="button" tabindex="0" onclick="addToCart('${p.name}', ${p.price})" title="${p.name}"></div>`
).join("");

renderGrid("all");
renderCart();
