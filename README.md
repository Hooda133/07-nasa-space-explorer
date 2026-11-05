# Project 7: NASA Space Explorer

An interactive, responsive gallery for NASA's Astronomy Picture of the Day (APOD).

## What it does

**Final quality and performance pass:** APOD gallery cards request ~960px versions of supported NASA dynamic images while modal images retain the full-resolution NASA URL. The search has a 20-second timeout, a retry button for recoverable failures, and clearer error messages for missing archive dates, blocked requests, or NASA server errors. The responsive CSS tightens hero artwork and modal layouts on small screens, and consolidates the theme's duplicate root color definitions. There is no new image article section and no external dependency.

**New 3D-style space illustrations:** Three original, self-contained vector assets in `img/` add a floating ringed planet to the hero, a metallic launch rocket on the search button, and a shaded professional telescope to the gallery's initial state. A small ringed planet also appears in the fact panel. These illustrations use SVG gradients, shadows, and layered paths, rather than emoji or external icons, and are responsive with reduced-motion support. No additional articles or image gallery cards were added.

**Space-specific iconography:** Replaces generic sparkle/star/emoji graphics and text arrows with a coherent custom SVG sprite (orbital diagrams, telescope, ringed planet, launch rocket, photo, video, calendar and navigation). Icons are decorative and screen-reader-hidden; all actual controls retain accessible labels. SVG symbols are included directly in `index.html` without a package or external icon library.

**Visual design (cinematic refresh):** Webb's Carina Nebula hero image, floating mission panel, editorial bento gallery with larger photos, responsive layouts, modern NASA-aligned fonts, luminous controls, and an immersive photo-details dialog. All key UI functionality remains in HTML/CSS and vanilla JavaScript.


- Fetches real NASA APOD entries for **exactly 9 consecutive dates** between the selected start and end, using a valid `DEMO_KEY` or your own NASA API key.
- Displays image cards with title and date.
- Opens an accessible, closable modal with the larger picture and NASA's full explanation.
- Provides links to NASA's original feature for videos and other non-image entries.
- Shows a loading state, helpful errors, and a no-results message.
- Picks a random **Did You Know?** space fact on every page refresh.
- Adds a smooth **hover zoom** effect for gallery photos.
- Uses a NASA-inspired color palette and responsive design for desktop and mobile, including the agency's current Inter, Public Sans, and DM Mono font families.
- Includes one-click **Latest 9 days**, **9 days ending yesterday**, and **First 9 days** search shortcuts.
- Provides **All / Photos / Videos** gallery filters without extra API requests.
- Supports next/previous discovery buttons and left/right arrow keys inside the modal.
- Lets visitors request another random space fact without reloading.
- Adds subtle motion with a reduced-motion accessibility fallback.

## Run the project

1. Open this repository in **VS Code**.
2. Open `index.html` with a local preview extension such as Live Server or Live Preview.
3. Select a date range and click **Launch discovery**.
4. Click any card to open its details. Close the modal using **×**, **Escape**, or the background.
5. Try the date shortcuts and the photo/video filters. In the modal, use the arrow buttons or the keyboard's left/right arrow keys to browse.
6. Refresh for a different space fact, or click **Another fact**.

## Quick test checklist

- Select nine consecutive historical dates and confirm the gallery displays **exactly nine cards** (including video entries). Both date inputs stay synchronized automatically.
- Verify historical queries such as **June 16–24, 1995** or **January 1–9, 2000** use WordPress `date_from`/`date_to` and are not silently replaced with the latest nine days.
- Confirm a photo card opens a larger image with its title, date, and NASA explanation.
- Try a date range including a video: **Videos** should show a card linking to the NASA feature.
- Test loading, a nine-day window with missing APOD entries, an invalid date range, and network errors.
- Check older nine-day windows (e.g., June 16–24, 1995, January 1–9, 2000) using the direct WordPress `date_from`/`date_to` parameters; verify the API returns the exact requested dates.
- Verify that responsive cards use smaller NASA dynamic image sizes (when supported), while clicking opens the original full-resolution image; links and alt text should still work.
- Temporarily block the NASA endpoint in browser developer tools and confirm the retry button and error notice appear; test a narrow phone viewport and reduced-motion mode.
- Try the mobile layout and keyboard controls.

The HTML/CSS and client-side behavior have been tested with mocked NASA responses and static checks. A final 39-check simulated audit verified archive date requests, exactly nine cards, image/video modals, fallback/error cases, retry handling, and overlapping-request prevention. Search dates are now locked while NASA responds and each response is validated against the original submitted window. **Real NASA responses and the live website appearance must still be checked in Codespaces before submission.** An API record with no image uses a labeled illustration fallback and a link to the NASA article rather than inventing a photo.

The default date range is populated by the provided `js/dateRange.js` file, which remains unchanged. All custom JavaScript is in `js/script.js`. Additional code keeps the start and end dates exactly eight days apart and validates that one unique NASA result exists for each of the nine days. If NASA has not yet published one of the entries, the app names the missing date instead of inventing a result.

## Final submission verification (in Codespaces)

These are essential manual browser checks — the simulated tests cannot replace live API verification:

1. Run the site on its normal forwarded port (e.g. `python3 -m http.server 3000 --bind 0.0.0.0`) and open **port 3000 in a new browser tab** if the embedded Live Preview prompts for GitHub sign-in.
2. Try an older nine-day range such as **January 1–9, 2000** and a more recent *fully published* nine-day range. Expect nine real APOD records, not nine placeholder photos.
3. Click a photo, confirm the full-resolution image and explanation open, navigate next/previous and close the dialog.
4. Confirm video entries show their NASA article link, the Did You Know fact changes, and the hover effect does not prevent keyboard/touch use.
5. At mobile width check that the hero, 3D decorations, dates, search panel and lightbox do not overlap. If NASA is unavailable, verify the error/retry notice instead of submitting a broken page.
6. Leave `js/dateRange.js` unchanged and **do not commit a personal API key**. `DEMO_KEY` is acceptable for light testing but is subject to usage limits.

## NASA API

NASA moved APOD to a new WordPress endpoint in September 2026. The former `api.nasa.gov/planetary/apod` endpoint is scheduled for retirement on **December 1, 2026**.

This project uses:

```text
https://science.nasa.gov/wp-json/wp/v2/apod-basic/
```

**Important: the direct WordPress endpoint and NASA's older API gateway use different date-range parameters.** The WordPress endpoint in this project expects `date_from` and `date_to` in `YYMMDD` format (for example, June 16–24, 1995 becomes `date_from=950616&date_to=950624`). The older `/planetary/apod` gateway accepts `start_date` and `end_date` in `YYYY-MM-DD`, but its backend converts them to `date_from` / `date_to` before calling WordPress. The app now sends the WordPress parameters directly. Unlike the old endpoint, the returned `url` is the NASA article page; the image is in `hdurl` when available. Source: [NASA APOD API gateway source code](https://github.com/nasa/apod-api/blob/master/application.py).

The app starts with `DEMO_KEY`. To use your own key, open **NASA API key settings** on the page. The key is not saved in the code or browser storage. NASA API information: https://api.nasa.gov/

## Credits and usage

The hero image is NASA Webb's Carina Nebula from `https://science.nasa.gov/image-detail/web-first-images-release/` (credit: NASA, ESA, CSA, STScI). It is not an APOD gallery result; the nine gallery items are still loaded live from APOD.

This is an **unofficial educational project** using NASA APOD data and NASA-provided starter assets, not a NASA website or an endorsement. NASA retains its own brand and imagery usage rules. Additional images in APOD may carry creator credits; the gallery modal displays the credit when supplied.

- NASA APOD: https://apod.nasa.gov/apod/astropix.html
- NASA brand guidance: https://www.nasa.gov/nasa-brand-center/brand-guidelines/
- NASA media guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/
