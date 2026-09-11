# Going Live — squareartconstruction.com

Everything in this folder is the finished website. It is a plain static site (HTML/CSS/JS),
so it can be hosted free on GitHub Pages.

- **Repo:** https://github.com/surinder-oss/Square-Art-Construction-Ltd.
- **Domain:** squareartconstruction.com (registered at Porkbun)
- **Host:** GitHub Pages (free, HTTPS included)

---

## Step 1 — Put the files in GitHub

Upload **everything in this folder** to the root of the repository (not inside a subfolder).

Easiest way, no command line:

1. Go to https://github.com/surinder-oss/Square-Art-Construction-Ltd.
2. Click **Add file → Upload files**
3. Drag in every file from this folder, including the hidden ones:
   `index.html`, `services.html`, `process.html`, `projects.html`, `about.html`,
   `contact.html`, `404.html`, `site.css`, `site.js`, `CNAME`, `.nojekyll`,
   `robots.txt`, `sitemap.xml`, `site.webmanifest`, `favicon.svg`, `favicon.png`,
   `favicon.ico`, `apple-touch-icon.png`, `og.png`
4. Commit message: `Launch Square Art Construction website`
5. Click **Commit changes**

> `.nojekyll` and `CNAME` have no file extension — they still need to be uploaded.
> If drag-and-drop hides them, upload them last on their own.

With the command line instead:

```bash
cd "Square Art Construction Website 2.0"
git init -b main
git add -A
git commit -m "Launch Square Art Construction website"
git remote add origin https://github.com/surinder-oss/Square-Art-Construction-Ltd..git
git push -u origin main
```

---

## Step 2 — Turn on GitHub Pages

1. In the repo click **Settings** (top right)
2. Left sidebar → **Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main` · Folder: `/ (root)` → **Save**
5. Under **Custom domain**, type `squareartconstruction.com` → **Save**
6. Leave **Enforce HTTPS** unchecked for now — it becomes available after DNS resolves

The site will first appear at `https://surinder-oss.github.io/Square-Art-Construction-Ltd./`

---

## Step 3 — DNS records at Porkbun

Go to https://porkbun.com/account/domainsSpeedy → find **squareartconstruction.com** →
click **DNS**.

**First delete any existing records Porkbun created automatically** for `A`, `ALIAS`
or `CNAME` on the root (`@`) and `www` — Porkbun adds parking records by default and
they will conflict.

Then add these **nine** records exactly:

### Four A records (the apex domain)

| Type | Host / Name | Answer / Value   | TTL |
|------|-------------|------------------|-----|
| A    | *(leave blank)* | `185.199.108.153` | 600 |
| A    | *(leave blank)* | `185.199.109.153` | 600 |
| A    | *(leave blank)* | `185.199.110.153` | 600 |
| A    | *(leave blank)* | `185.199.111.153` | 600 |

### Four AAAA records (IPv6)

| Type | Host / Name | Answer / Value        | TTL |
|------|-------------|-----------------------|-----|
| AAAA | *(leave blank)* | `2606:50c0:8000::153` | 600 |
| AAAA | *(leave blank)* | `2606:50c0:8001::153` | 600 |
| AAAA | *(leave blank)* | `2606:50c0:8002::153` | 600 |
| AAAA | *(leave blank)* | `2606:50c0:8003::153` | 600 |

### One CNAME record (the www version)

| Type  | Host / Name | Answer / Value        | TTL |
|-------|-------------|-----------------------|-----|
| CNAME | `www`       | `surinder-oss.github.io` | 600 |

> In Porkbun, leaving the Host blank means the root domain (`@`).
> The CNAME value has **no** repository name and **no** trailing slash.

---

## Step 4 — Turn on HTTPS

DNS usually propagates in 15–60 minutes (can take up to 24 hours).

Once `https://squareartconstruction.com` loads:

1. Repo → **Settings → Pages**
2. Tick **Enforce HTTPS**

GitHub issues a free Let's Encrypt certificate automatically.

---

## Step 5 — After launch

- **Google Search Console:** https://search.google.com/search-console — add
  `squareartconstruction.com`, verify by DNS TXT record, then submit
  `https://squareartconstruction.com/sitemap.xml`
- **Google Business Profile:** https://business.google.com — this matters more than
  the website for local "contractor near me" searches. Use the same name, phone
  (403) 689-0756 and service area as the site.
- **Bing Webmaster Tools:** https://www.bing.com/webmasters — import from Search Console.

---

## How the quote form works

There is no server and no database. When someone submits the form on `contact.html`,
their own email app opens with a pre-filled message addressed to
**squareartltd@gmail.com** — name, phone, email, location, project type, target start
and details all laid out. They press send; it lands in the Gmail inbox like a normal
email, and replies go straight back to them.

Because it is a `mailto:` link, nothing can be lost in transit and there is no spam
form to maintain. If their device has no mail app configured, the confirmation box
shows a fallback link and the address in plain text.

---

## Making changes later

Edit the files in this folder, then upload the changed file(s) to GitHub again
(**Add file → Upload files**, same filename, commit). GitHub Pages redeploys in
about a minute.

Common edits:

| What | Where |
|------|-------|
| Phone number | search `689-0756` across all `.html` |
| Email | search `squareartltd@gmail.com` |
| Photos | search `images.unsplash.com` — swap the URL for your own photo file |
| Service areas | the `AREAS` pills near the bottom of `index.html`, `about.html`, `contact.html` |
| Testimonials | `index.html` and `projects.html`, class `quote` |
| Colours | top of `site.css`, the `:root` block |

### Swapping in real job photos

1. Put your photos in this folder (e.g. `photos/framing-01.jpg`)
2. Upload them to the repo the same way
3. Replace the long `https://images.unsplash.com/...` URL in the `src="..."` with
   `photos/framing-01.jpg`

Real site photos will outperform stock every time — especially on the home page band
and the nine service rows.
