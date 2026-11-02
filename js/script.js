// NASA Space Explorer: project JavaScript
// The original dateRange.js handles the date pickers. Leave it unchanged.
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
setupDateInputs(startInput, endInput);

// NASA moved APOD to this endpoint in September 2026.
// The old api.nasa.gov/planetary/apod endpoint retires December 1, 2026.
const API_URL = "https://science.nasa.gov/wp-json/wp/v2/apod-basic/";
const searchForm = document.getElementById("searchForm");
const searchButton = document.getElementById("searchButton");
const gallery = document.getElementById("gallery");
const resultsLabel = document.getElementById("resultsLabel");
const modal = document.getElementById("photoModal");
const modalMedia = document.getElementById("modalMedia");
const modalLink = document.getElementById("modalLink");
const galleryToolbar = document.getElementById("galleryToolbar");
const filterButtons = document.querySelectorAll(".filter-button");
const quickButtons = document.querySelectorAll(".quick-button");
let allEntries = [];
let displayedEntries = [];
let activeFilter = "all";
let currentModalIndex = 0;

// Extra credit: choose a random fact whenever the page reloads.
const spaceFacts = [
  "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.",
  "A day on Venus is longer than a year on Venus.",
  "Jupiter is the largest planet in our solar system.",
  "Saturn's average density is lower than the density of water.",
  "The Moon is moving away from Earth by about 3.8 centimeters each year.",
  "Neptune takes about 165 Earth years to orbit the Sun once.",
  "Our Milky Way galaxy contains billions of stars.",
  "Mars is home to Olympus Mons, the largest known volcano in our solar system.",
  "A single day on Mercury lasts about 176 Earth days from sunrise to sunrise.",
  "Sunlight takes over four hours to reach Neptune."
];
// Show a different random fact when the visitor requests another one.
let lastFactIndex = -1;
function showRandomFact() {
  let index = Math.floor(Math.random() * spaceFacts.length);
  if (index === lastFactIndex) index = (index + 1) % spaceFacts.length;
  lastFactIndex = index;
  document.getElementById("factText").textContent = spaceFacts[index];
}
showRandomFact();
document.getElementById("anotherFact").addEventListener("click", showRandomFact);

// The rubric requires NINE consecutive dates, including both endpoints.
// Keep dateRange.js exactly as provided. This code works with its date inputs.
const REQUIRED_DAYS = 9;
const DAY_MS = 24 * 60 * 60 * 1000;
function dateAtUTC(value) {
  return new Date(value + "T00:00:00Z");
}
function dateString(date) {
  return date.toISOString().slice(0, 10);
}
function moveDate(value, days) {
  const date = dateAtUTC(value);
  date.setUTCDate(date.getUTCDate() + days);
  return dateString(date);
}

// Adjust the other date when someone changes either field.
// At the archive boundaries, shift the entire 9-day window.
function setNineDayRange(value, startingFromFirstDate) {
  if (!value || Number.isNaN(dateAtUTC(value).getTime())) return;
  let start = startingFromFirstDate ? value : moveDate(value, -(REQUIRED_DAYS - 1));
  let end = startingFromFirstDate ? moveDate(value, REQUIRED_DAYS - 1) : value;
  if (end > endInput.max) {
    end = endInput.max;
    start = moveDate(end, -(REQUIRED_DAYS - 1));
  }
  if (start < startInput.min) {
    start = startInput.min;
    end = moveDate(start, REQUIRED_DAYS - 1);
  }
  startInput.value = start;
  endInput.value = end;
}
startInput.addEventListener("change", () => setNineDayRange(startInput.value, true));
endInput.addEventListener("change", () => setNineDayRange(endInput.value, false));
// Confirm the starter defaults to nine dates, even near a boundary.
setNineDayRange(endInput.value, false);

// Presets are also nine days long, not arbitrary seven/14/30-day ranges.
quickButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (searchButton.disabled) return;
    if (button.dataset.first === "true") {
      setNineDayRange(startInput.min, true);
    } else {
      const daysBack = Number(button.dataset.offset || 0);
      setNineDayRange(moveDate(endInput.max, -daysBack), false);
    }
    searchForm.requestSubmit();
  });
});

// Safely convert NASA's explanation/credit HTML into plain readable text.
// We never insert API-supplied HTML directly into the visible page.
function plainText(value) {
  if (!value) return "";
  const doc = new DOMParser().parseFromString(String(value), "text/html");
  return doc.body.textContent.trim().replace(/\s+/g, " ");
}

// Only use safe HTTPS URLs from NASA's API in links and image elements.
function safeUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

// Create an accessible decorative outline icon from the SVG sprite in index.html.
function makeIcon(name, className = "ui-icon") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", className);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("viewBox", "0 0 24 24");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", "#icon-" + name);
  svg.append(use);
  return svg;
}

// Use visually meaningful artwork for non-image entries or broken images.
function makeMediaFallback(item) {
  const fallback = document.createElement("span");
  fallback.className = "fallback-icon";
  fallback.setAttribute("aria-hidden", "true");
  fallback.append(makeIcon(item.media_type === "video" ? "video" : "image", "ui-icon fallback-svg"));
  return fallback;
}

// The updated APOD API uses 'hdurl' for the featured picture.
// 'url' now points to the NASA article, NOT directly to its image.
function pictureUrl(item) {
  return safeUrl(item.hdurl);
}
function featureUrl(item) {
  return safeUrl(item.permalink || item.url) ||
    "https://apod.nasa.gov/apod/astropix.html";
}
function formattedDate(value) {
  const date = new Date(value + "T00:00:00Z");
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric", timeZone: "UTC"
      });
}

// Show a loading, empty, or error message instead of the gallery.
function showStatus(title, details, isError = false, isLoading = false) {
  gallery.replaceChildren();
  const status = document.createElement("div");
  status.className = "status-message" + (isError ? " error" : "");
  if (isLoading) {
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    spinner.setAttribute("aria-hidden", "true");
    status.append(spinner);
  }
  const heading = document.createElement("h3");
  heading.textContent = title;
  const paragraph = document.createElement("p");
  paragraph.textContent = details;
  status.append(heading, paragraph);
  gallery.append(status);
  // Loading skeletons make the gallery feel responsive while NASA responds.
  if (isLoading) {
    for (let i = 0; i < 3; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "loading-skeleton";
      skeleton.setAttribute("aria-hidden", "true");
      gallery.append(skeleton);
    }
  }
}

// Create a featured image or a fallback symbol for videos/no image.
function createMedia(item, fullSize = false) {
  const source = pictureUrl(item);
  const wrapper = document.createElement("div");
  wrapper.className = fullSize ? "modal-picture" : "image-frame";

  if (source) {
    const image = document.createElement("img");
    image.src = source;
    image.alt = plainText(item.alt) || item.title || "NASA astronomy photograph";
    image.loading = fullSize ? "eager" : "lazy";
    image.addEventListener("error", () => {
      image.remove();
      wrapper.append(makeMediaFallback(item));
    }, { once: true });
    wrapper.append(image);
  } else {
    wrapper.append(makeMediaFallback(item));
  }

  if (!fullSize) {
    const badge = document.createElement("span");
    badge.className = "media-badge";
    badge.textContent = item.media_type === "image" ? "PHOTO" : "VIDEO / MEDIA";
    wrapper.append(badge);
  }
  return wrapper;
}

// Display an enlarged picture or a video poster with a link to NASA.
function openDetails(item) {
  currentModalIndex = displayedEntries.indexOf(item);
  const position = currentModalIndex + 1;
  document.getElementById("modalPosition").textContent =
    "DISCOVERY " + position + " / " + displayedEntries.length;
  const onlyOne = displayedEntries.length < 2;
  document.getElementById("previousPhoto").disabled = onlyOne;
  document.getElementById("nextPhoto").disabled = onlyOne;
  modalMedia.replaceChildren(createMedia(item, true));
  document.getElementById("modalTitle").textContent = plainText(item.title) || "Untitled discovery";
  const dateElement = document.getElementById("modalDate");
  dateElement.textContent = formattedDate(item.date);
  dateElement.dateTime = item.date;
  document.getElementById("modalDescription").textContent =
    plainText(item.explanation) || "NASA has not provided an explanation for this entry.";

  const credit = plainText(item.credit || item.copyright);
  document.getElementById("modalCredit").textContent = credit ? "Image credit: " + credit : "";

  modalLink.href = featureUrl(item);
  modalLink.replaceChildren(
    document.createTextNode(item.media_type === "image"
      ? "View original NASA feature"
      : "Watch or view this feature on NASA"),
    makeIcon("arrow-up-right")
  );
  if (!modal.open) modal.showModal();
  modal.scrollTop = 0;
}

// Browse between the displayed discoveries without closing the dialog.
function movePhoto(direction) {
  if (displayedEntries.length < 2) return;
  currentModalIndex = (currentModalIndex + direction + displayedEntries.length) %
    displayedEntries.length;
  openDetails(displayedEntries[currentModalIndex]);
}
document.getElementById("previousPhoto").addEventListener("click", () => movePhoto(-1));
document.getElementById("nextPhoto").addEventListener("click", () => movePhoto(1));
modal.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") { event.preventDefault(); movePhoto(-1); }
  if (event.key === "ArrowRight") { event.preventDefault(); movePhoto(1); }
});

// Render the gallery from the current filter: all, photos, or videos.
function renderGallery() {
  displayedEntries = allEntries.filter(item => {
    if (activeFilter === "all") return true;
    if (activeFilter === "image") return item.media_type === "image";
    return item.media_type !== "image";
  });
  gallery.replaceChildren();

  filterButtons.forEach(button => {
    const selected = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  resultsLabel.textContent = displayedEntries.length +
    (displayedEntries.length === 1 ? " discovery" : " discoveries") +
    (activeFilter === "all" ? "" : " shown");

  if (displayedEntries.length === 0) {
    showStatus("Nothing in this category", "Try a different filter or date range.");
    return;
  }

  for (const [index, item] of displayedEntries.entries()) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "gallery-card";
    card.setAttribute("aria-label", "View details: " + plainText(item.title || "NASA feature"));
    card.append(createMedia(item));

    // Editorial image-number overlay, e.g., 01 / 09.
    const number = document.createElement("span");
    number.className = "card-index";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(index + 1).padStart(2, "0") +
      " / " + String(displayedEntries.length).padStart(2, "0");
    card.append(number);

    const body = document.createElement("div");
    body.className = "card-body";
    const date = document.createElement("time");
    date.className = "card-date";
    date.dateTime = item.date;
    date.textContent = formattedDate(item.date);
    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = plainText(item.title) || "Untitled discovery";
    const action = document.createElement("span");
    action.className = "card-action";
    action.append(
      document.createTextNode(item.media_type === "image" ? "Explore photo" : "View video details"),
      makeIcon("arrow-up-right")
    );
    body.append(date, title, action);
    card.append(body);
    card.addEventListener("click", () => openDetails(item));
    gallery.append(card);
  }
}

// Filter only changes the cards on screen, without making another API request.
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    renderGallery();
  });
});

// Keep nine distinct APOD entries, one for every selected date.
// Some API responses include duplicate entries or may omit an unpublished day.
function showGallery(items) {
  const datesByDay = new Map();
  for (const item of items) {
    if (item && typeof item.date === "string" &&
        item.date >= startInput.value && item.date <= endInput.value &&
        !datesByDay.has(item.date)) {
      datesByDay.set(item.date, item);
    }
  }
  const expectedDates = [];
  for (let day = 0; day < REQUIRED_DAYS; day++) {
    expectedDates.push(moveDate(startInput.value, day));
  }
  const missingDates = expectedDates.filter(date => !datesByDay.has(date));
  if (missingDates.length > 0) {
    allEntries = [];
    displayedEntries = [];
    galleryToolbar.hidden = true;
    resultsLabel.textContent = datesByDay.size + " of 9 entries received";
    showStatus("NASA did not return all 9 days",
      "Missing: " + missingDates.join(", ") +
      ". Try a nine-day range ending yesterday or choose older dates.", true);
    return;
  }

  allEntries = expectedDates.map(date => datesByDay.get(date))
    .sort((a, b) => b.date.localeCompare(a.date));
  activeFilter = "all";
  galleryToolbar.hidden = false;
  document.getElementById("allCount").textContent = allEntries.length;
  document.getElementById("photoCount").textContent =
    allEntries.filter(item => item.media_type === "image").length;
  document.getElementById("videoCount").textContent =
    allEntries.filter(item => item.media_type !== "image").length;
  document.getElementById("rangeLabel").textContent =
    formattedDate(startInput.value) + " – " + formattedDate(endInput.value);
  renderGallery();
}

// Fetch NASA data using the selected date range whenever the button is clicked.
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const startDate = startInput.value;
  const endDate = endInput.value;

  // YYYY-MM-DD strings are safe to compare in chronological order.
  if (!startDate || !endDate || startDate > endDate) {
    showStatus("Check your dates", "Choose a start date that is on or before the end date.", true);
    return;
  }
  if (startDate < startInput.min || endDate > endInput.max) {
    showStatus("Dates out of range", "Select dates between June 16, 1995 and today.", true);
    return;
  }
  const difference = (dateAtUTC(endDate) - dateAtUTC(startDate)) / DAY_MS;
  if (difference !== REQUIRED_DAYS - 1) {
    showStatus("Select exactly 9 consecutive days",
      "Adjust either date; the other date will automatically follow.", true);
    resultsLabel.textContent = "9-day range required";
    return;
  }

  // The direct NASA WordPress endpoint is different from the legacy APOD
  // API gateway: it expects date_from/date_to as YYMMDD, not start_date/end_date.
  // NASA's open-source gateway converts YYYY-MM-DD into these exact parameters.
  function toWordPressDate(isoDate) {
    return isoDate.replaceAll("-", "").slice(2);
  }
  const params = new URLSearchParams({
    date_from: toWordPressDate(startDate),
    date_to: toWordPressDate(endDate),
    api_key: document.getElementById("apiKey").value.trim() || "DEMO_KEY"
  });
  searchButton.disabled = true;
  quickButtons.forEach(button => { button.disabled = true; });
  galleryToolbar.hidden = true;
  gallery.setAttribute("aria-busy", "true");
  resultsLabel.textContent = "Searching the cosmos…";
  showStatus("Loading space photos…", "Connecting to NASA's Astronomy Picture of the Day archive.", false, true);

  try {
    const response = await fetch(API_URL + "?" + params.toString());
    if (!response.ok) {
      if (response.status === 429 || response.status === 403) {
        throw new Error("NASA's request limit may have been reached. Try your free personal API key in the settings above.");
      }
      throw new Error("NASA returned an error (" + response.status + "). Please try again.");
    }
    const data = await response.json();
    // Single-day results may arrive as an object rather than an array.
    if (Array.isArray(data)) {
      showGallery(data);
    } else if (data && data.date) {
      showGallery([data]);
    } else {
      throw new Error("NASA returned an unexpected response. Try again shortly.");
    }
  } catch (error) {
    const message = error instanceof TypeError
      ? "Could not connect to NASA. Check your internet connection and try again."
      : error.message;
    showStatus("We couldn't load the photos", message, true);
    resultsLabel.textContent = "Search unsuccessful";
  } finally {
    searchButton.disabled = false;
    quickButtons.forEach(button => { button.disabled = false; });
    gallery.setAttribute("aria-busy", "false");
  }
});

// Close button, Escape key, and backdrop clicks.
document.getElementById("closeModal").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});
