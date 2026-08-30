# 🏛️ DREV — LUXURY FASHION E-COMMERCE
## Complete Business Owner & Client Handover Guide

Welcome to your **DREV Cinematic Luxury Fashion Website**. This project is built as a complete, high-performance, autonomous luxury e-commerce experience. 

You can **manage products, edit prices, update photography, and run your entire store without writing a single line of code**.

---

## ⚡ Quick Start: Accessing Your Store & Admin Studio

### 1. Run the Website Locally
To start the website on your computer:
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your web browser.

---

### 2. Accessing the Owner Management Studio (`/admin`)
Visit **[http://localhost:3000/admin](http://localhost:3000/admin)** (or click **"OWNER STUDIO"** in the footer of the website).

* **Default Master Passcode**: `drev2026`
* Once logged in, your session remains active for easy management.

---

## 🛍️ What You Can Do in the Owner Studio

### 1. Add New Products
1. Click the **`+ ADD NEW PRODUCT`** tab in the top bar.
2. Enter the **Garment Name**, **Category** (*Outerwear, Tailoring, Tops, Trousers, Footwear, Accessories*), **Price (USD)**, and **Color**.
3. Provide the **Image URL** (or path like `/products/your_image.jpg`).
4. Write your editorial **Description**, **Fabric & Material Details**, and **Fit & Proportions**.
5. Click **`PUBLISH GARMENT TO STORE →`**. The product is immediately live on the runway grid, lookbook stream, search archive, and checkout modal!

### 2. Edit Existing Products
1. Go to the **`GARMENT CATALOGUE`** tab.
2. Use the live search bar or category filters to find any piece.
3. Click **`EDIT`** on any card to update the price, title, descriptions, or badge.
4. Click **`SAVE CHANGES →`** to update the live store immediately.

### 3. Toggle Stock Status (*In Stock* vs *Sold Out*)
* Each product card features a 1-click **`IN STOCK` / `SOLD OUT`** badge.
* Clicking it immediately switches inventory availability on the live store.

### 4. Delete or Remove Products
* Click the trash icon on any product card to permanently remove it from the catalog.

### 5. Data Backup & Export (1-Click)
* Go to the **`DATA BACKUP & EXPORT`** tab.
* Click **`EXPORT FILE`** to download a full snapshot backup of all products (`.json`).
* If you ever want to reset to the original runway collection, click **`RESTORE DEFAULTS`**.

---

## 📸 Adding Your Own Garment Photography

### Method A: Using Any Web Image URL
Paste any high-resolution image URL (from Cloudinary, Imgur, Shopify, or your CDN) into the **Primary Image** field in the Admin Studio.

### Method B: Adding Local Images
1. Save your photos into the folder:
   ```
   public/products/
   ```
   *(e.g., `public/products/silk_trench.jpg`)*
2. In the Admin Studio, enter the image path:
   ```
   /products/silk_trench.jpg
   ```
3. Done! The image will load instantly with high-fashion hover zoom effects.

---

## 📐 Official DREV Size Chart

The store comes pre-configured with the official **DREV Size Chart**:

| SIZE | CHEST | SHOULDER | LENGTH | SLEEVE L |
| :--- | :--- | :--- | :--- | :--- |
| **M** | 41" *(104.1 cm)* | 18" *(45.7 cm)* | 26" *(66.0 cm)* | 22.5" *(57.2 cm)* |
| **L** | 43" *(109.2 cm)* | 18.5" *(47.0 cm)* | 26.5" *(67.3 cm)* | 24" *(61.0 cm)* |
| **XL** | 45" *(114.3 cm)* | 19.5" *(49.5 cm)* | 27.5" *(69.9 cm)* | 25.5" *(64.8 cm)* |

Customers can toggle between **INCHES** and **CM**, view the **Atelier Velvet Card Graphic**, and click any row to instantly pick their size.

---

## 🚀 1-Click Free Production Deployment (Vercel)

You can launch your store worldwide on custom domains (e.g. `yourbrand.com`) for free using **Vercel**:

1. Upload this codebase to GitHub.
2. Go to **[vercel.com](https://vercel.com)** and click **"Add New Project"**.
3. Select your repository and click **"Deploy"**.
4. *(Optional Database)*: If you want PostgreSQL storage, create a free database on **Neon** (`neon.tech`) or **Supabase** (`supabase.com`) and paste your `DATABASE_URL` in Vercel Environment Variables. If not provided, the website runs 100% autonomously with built-in zero-config memory persistence!

---

## 💼 Selling & Handing Over to the Client

When selling this site to your client:
1. Provide them with this `CLIENT_HANDOVER_GUIDE.md` file.
2. Give them their admin passcode: `drev2026`.
3. Show them how to visit `/admin` to add their real inventory and change prices.
