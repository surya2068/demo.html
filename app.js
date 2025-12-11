/**
 * Task 7 — Dynamic Book List with Bootstrap Layouts
 * -------------------------------------------------
 * What this script demonstrates (as required):
 * 1) JavaScript loops + functions to dynamically build the DOM.
 * 2) Bootstrap 5 grid & utilities for layout and spacing.
 * 3) Fully responsive card gallery with proper alignment.
 */

// ----- Data store (in-memory for the demo) -----
const books = [];

// Sample data to load (shows loop-based rendering)
const sampleBooks = [
  { title: "Clean Code", author: "Robert C. Martin", price: 589.00, rating: 4.7, category: "Programming" },
  { title: "Atomic Habits", author: "James Clear", price: 399.00, rating: 4.6, category: "Self-help" },
  { title: "Deep Work", author: "Cal Newport", price: 449.00, rating: 4.4, category: "Productivity" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 675.00, rating: 4.8, category: "Programming" },
  { title: "Sapiens", author: "Yuval Noah Harari", price: 529.00, rating: 4.5, category: "History" },
  { title: "Hooked", author: "Nir Eyal", price: 349.00, rating: 4.2, category: "Business" },
  { title: "The Alchemist", author: "Paulo Coelho", price: 299.00, rating: 4.3, category: "Fiction" },
  { title: "Ikigai", author: "Héctor García", price: 279.00, rating: 4.1, category: "Wellness" }
];

// ----- Element refs -----
const grid = document.getElementById('bookGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const loadBtn = document.getElementById('loadBtn');

// Add form refs
const form = document.getElementById('bookForm');
const fTitle = document.getElementById('title');
const fAuthor = document.getElementById('author');
const fPrice = document.getElementById('price');
const fRating = document.getElementById('rating');
const fCategory = document.getElementById('category');
const fCover = document.getElementById('cover');

// ---------- Utility: cover generator (SVG data URL) ----------
/**
 * createCoverSVG(title)
 * Generates a soft gradient SVG with the first letter of the title.
 * Returns a data URL usable in <img src="..."> (no external files).
 */
function createCoverSVG(title = "Book") {
  const letter = (title.trim()[0] || "B").toUpperCase();
  const colors = [
    ["#2563eb", "#00c2ff"],
    ["#6a5cff", "#ff7ad9"],
    ["#00c896", "#82eaff"],
    ["#ff7a7a", "#ffd6a5"],
    ["#ffa500", "#ffed4a"]
  ];
  const [c1, c2] = colors[letter.charCodeAt(0) % colors.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1066">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c1}"/>
          <stop offset="1" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
            font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial"
            font-size="320" fill="rgba(255,255,255,.92)" font-weight="800">
        ${letter}
      </text>
    </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// ---------- Utility: star rating (★) ----------
function renderStars(rating) {
  const max = 5;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = max - full - half;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
}

// ---------- Rendering ----------
/**
 * renderBooks(list)
 * Clears the grid and appends Bootstrap card columns for each book.
 * Uses loops and DOM creation (no innerHTML concat logic bombs).
 */
function renderBooks(list) {
  grid.innerHTML = "";
  if (!list.length) {
    emptyState.classList.remove('d-none');
    return;
  }
  emptyState.classList.add('d-none');

  // Create columns via loop
  for (const book of list) {
    const col = document.createElement('div');
    col.className = "col";

    const card = document.createElement('div');
    card.className = "card h-100 shadow-sm";

    const img = document.createElement('img');
    img.className = "card-img-top";
    img.alt = `${book.title} cover`;
    img.src = book.cover || createCoverSVG(book.title);

    const body = document.createElement('div');
    body.className = "card-body";

    const title = document.createElement('h5');
    title.className = "card-title";
    title.textContent = book.title;

    const author = document.createElement('p');
    author.className = "card-text text-muted mb-1";
    author.textContent = book.author;

    const badge = document.createElement('span');
    badge.className = "badge rounded-pill badge-category mb-2";
    badge.textContent = book.category || "General";

    const rating = document.createElement('div');
    rating.className = "rating text-warning fw-semibold";
    rating.textContent = renderStars(book.rating) + `  ${book.rating.toFixed(1)}`;

    const footer = document.createElement('div');
    footer.className = "card-footer d-flex justify-content-between align-items-center";

    const price = document.createElement('span');
    price.className = "price";
    price.textContent = `₹${Number(book.price).toFixed(2)}`;

    const btn = document.createElement('button');
    btn.className = "btn btn-sm btn-outline-primary";
    btn.textContent = "Details";
    btn.addEventListener('click', () => {
      // For lab purposes, a simple alert. Could be a Bootstrap modal.
      alert(`${book.title}\nby ${book.author}\n\nCategory: ${book.category || "General"}\nPrice: ₹${book.price}\nRating: ${book.rating}`);
    });

    // Assemble
    footer.append(price, btn);
    body.append(title, author, badge, rating);
    card.append(img, body, footer);
    col.append(card);
    grid.append(col);
  }
}

// ---------- Filtering & Sorting ----------
function getFilteredSorted() {
  const query = (searchInput.value || "").toLowerCase().trim();
  let list = books.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.author.toLowerCase().includes(query)
  );

  switch (sortSelect.value) {
    case "price-asc":  list.sort((a,b) => a.price - b.price); break;
    case "price-desc": list.sort((a,b) => b.price - a.price); break;
    case "rating-asc": list.sort((a,b) => a.rating - b.rating); break;
    case "rating-desc":list.sort((a,b) => b.rating - a.rating); break;
    default: /* leave order as inserted */ break;
  }
  return list;
}

function refresh() {
  renderBooks(getFilteredSorted());
}

// ---------- Events ----------
loadBtn.addEventListener('click', () => {
  // Push copies so "load" can be clicked multiple times without duplication
  for (const item of sampleBooks) {
    books.push({ ...item, cover: createCoverSVG(item.title) });
  }
  refresh();
});

searchInput.addEventListener('input', refresh);
sortSelect.addEventListener('change', refresh);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = fTitle.value.trim();
  const author = fAuthor.value.trim();
  const price = Number(fPrice.value);
  const rating = Number(fRating.value);
  const category = fCategory.value.trim();
  const cover = fCover.value.trim();

  if (!title || !author || isNaN(price) || isNaN(rating)) return;

  books.push({
    title, author, price, rating,
    category: category || "General",
    cover: cover || createCoverSVG(title)
  });

  form.reset();
  refresh();
});

// Initial state
refresh();
