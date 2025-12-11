
const books = [];

const sampleBooks = [
  { title: "Clean Code", author: "Robert C. Martin", price: 589, rating: 4.7 },
  { title: "Atomic Habits", author: "James Clear", price: 399, rating: 4.6 },
  { title: "Deep Work", author: "Cal Newport", price: 449, rating: 4.4 },
];

// ------------------ Element References ------------------
const grid = document.getElementById("bookGrid");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const loadBtn = document.getElementById("loadBtn");

const form = document.getElementById("bookForm");
const fTitle = document.getElementById("title");
const fAuthor = document.getElementById("author");
const fPrice = document.getElementById("price");
const fRating = document.getElementById("rating");

// ------------------ SVG Cover Generator ------------------
function makeCover(title) {
  const letter = title[0]?.toUpperCase() || "B";
  return `data:image/svg+xml;utf8,
    <svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'>
      <rect width='100%' height='100%' fill='#3b82f6'/>
      <text x='50%' y='55%' font-size='260' text-anchor='middle'
            fill='white' font-family='Arial' dominant-baseline='middle'
            font-weight='700'>${letter}</text>
    </svg>`;
}

// ------------------ Render Function ------------------
function render(list) {
  grid.innerHTML = "";

  if (!list.length) {
    emptyState.classList.remove("d-none");
    return;
  }

  emptyState.classList.add("d-none");

  for (const book of list) {
    const col = document.createElement("div");
    col.className = "col";

    const card = document.createElement("div");
    card.className = "card h-100 shadow-sm";

    const img = document.createElement("img");
    img.className = "card-img-top";
    img.src = book.cover || makeCover(book.title);
    img.alt = "Book Cover";

    const body = document.createElement("div");
    body.className = "card-body";

    const t = document.createElement("h5");
    t.className = "card-title";
    t.textContent = book.title;

    const a = document.createElement("p");
    a.className = "text-muted mb-1";
    a.textContent = book.author;

    const r = document.createElement("p");
    r.className = "fw-semibold text-warning";
    r.textContent = "★ " + book.rating.toFixed(1);

    const price = document.createElement("p");
    price.className = "fw-bold";
    price.textContent = "₹" + book.price.toFixed(2);

    body.append(t, a, r, price);
    card.append(img, body);
    col.append(card);
    grid.append(col);
  }
}

// ------------------ Filter + Sort ------------------
function getProcessedList() {
  let list = [...books];
  const q = searchInput.value.toLowerCase().trim();

  if (q) {
    list = list.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q)
    );
  }

  switch (sortSelect.value) {
    case "price-low":
      list.sort((a, b) => a.price - b.price); break;
    case "price-high":
      list.sort((a, b) => b.price - a.price); break;
    case "rating-high":
      list.sort((a, b) => b.rating - a.rating); break;
  }

  return list;
}

function refresh() {
  render(getProcessedList());
}

// ------------------ Events ------------------
loadBtn.addEventListener("click", () => {
  for (const b of sampleBooks) {
    books.push({ ...b, cover: makeCover(b.title) });
  }
  refresh();
});

searchInput.addEventListener("input", refresh);
sortSelect.addEventListener("change", refresh);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = fTitle.value.trim();
  const author = fAuthor.value.trim();
  const price = Number(fPrice.value);
  const rating = Number(fRating.value);

  if (!title || !author || !price || !rating) return;

  books.push({
    title,
    author,
    price,
    rating,
    cover: makeCover(title)
  });

  form.reset();
  refresh();
});

// ------------------ Initial Render ------------------
refresh();
