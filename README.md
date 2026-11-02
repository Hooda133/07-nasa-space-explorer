# Project 7: NASA Space Explorer

An interactive, responsive gallery for NASA's Astronomy Picture of the Day (APOD).

## What it does

**Space-specific iconography:** Replaces generic sparkle/star/emoji graphics and text arrows with a coherent custom SVG sprite (orbital diagrams, telescope, ringed planet, launch rocket, photo, video, calendar and navigation). Icons are decorative and screen-reader-hidden; all actual controls retain accessible labels. SVG symbols are included directly in `index.html` without a package or external icon library.

**Curated NASA Image Gallery (decoration):** A responsive three-image editorial section uses real NASA/partner imagery: a Webb Telescope artist's illustration, Webb's Pillars of Creation (NIRCam), and Cassini's view of Saturn's rings. Each image links to an official NASA detail page and displays the contributing organizations' image credits. This gallery is a *separate visual feature* and is **not** part of the nine real APOD records the assignment fetches.

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
3. Select a date range and click **Get Space Images**.
4. Click any card to open its details. Close the modal using **×**, **Escape**, or the background.
5. Try the date shortcuts and the photo/video filters. In the modal, use the arrow buttons or the keyboard's left/right arrow keys to browse.
6. Refresh for a different space fact, or click **Another fact**.

## Quick test checklist

- Select nine consecutive historical dates and confirm the gallery displays **exactly nine cards** (including video entries). Both date inputs stay synchronized automatically.
- Confirm a photo card opens a larger image with its title, date, and NASA explanation.
- Try a date range including a video: **Videos** should show a card linking to the NASA feature.
- Test loading, a nine-day window with missing APOD entries, an invalid date range, and network errors.
- Try the mobile layout and keyboard controls.

The HTML/CSS and client-side behavior have been tested with mocked NASA responses. **A live browser request to NASA must still be checked in your Codespaces preview before submission.**

The default date range is populated by the provided `js/dateRange.js` file, which remains unchanged. All custom JavaScript is in `js/script.js`. Additional code keeps the start and end dates exactly eight days apart and validates that one unique NASA result exists for each of the nine days. If NASA has not yet published one of the entries, the app names the missing date instead of inventing a result.

## NASA API

NASA moved APOD to a new WordPress endpoint in September 2026. The former `api.nasa.gov/planetary/apod` endpoint is scheduled for retirement on **December 1, 2026**.

This project uses:

```text
https://science.nasa.gov/wp-json/wp/v2/apod-basic/
```

For a date range, NASA's current APOD endpoint documents `start_date` and `end_date` in `YYYY-MM-DD` format. The app constructs those parameters from the synchronized nine-day date pickers. Unlike the old endpoint, the returned `url` is the NASA article page; the image is in `hdurl` when available.

The app starts with `DEMO_KEY`. To use your own key, open **NASA API key settings** on the page. The key is not saved in the code or browser storage. NASA API information: https://api.nasa.gov/

## Curated NASA image sources

These are decorative editorial images; the nine-day APOD search remains live API-driven.

- [James Webb telescope front view](https://science.nasa.gov/asset/webb/james-webb-space-telescope-front-view/) — illustration; NASA / ESA / CSA / Northrop Grumman
- [Pillars of Creation (NIRCam)](https://science.nasa.gov/asset/webb/pillars-of-creation-nircam-image/) — NASA / ESA / CSA / STScI; processing: Joseph DePasquale, Anton Koekemoer, Alyssa Pagan (STScI)
- [Saturn's Finale Ringscape](https://science.nasa.gov/resource/finale-ringscape/) — NASA / JPL-Caltech / Space Science Institute

Images are loaded from official NASA science asset URLs; the UI provides visual gradient fallbacks if the external images are unavailable. See [NASA's media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/). The site is unofficial and not endorsed by NASA.

## Credits and usage

The hero image is NASA Webb's Carina Nebula from `https://science.nasa.gov/image-detail/web-first-images-release/` (credit: NASA, ESA, CSA, STScI). It is not an APOD gallery result; the nine gallery items are still loaded live from APOD.

This is an **unofficial educational project** using NASA APOD data and NASA-provided starter assets, not a NASA website or an endorsement. NASA retains its own brand and imagery usage rules. Additional images in APOD may carry creator credits; the gallery modal displays the credit when supplied.

- NASA APOD: https://apod.nasa.gov/apod/astropix.html
- NASA brand guidance: https://www.nasa.gov/nasa-brand-center/brand-guidelines/
- NASA media guidance: https://www.nasa.gov/nasa-brand-center/images-and-media/
