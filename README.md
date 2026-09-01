# Amazon Shopping Assistant

An AI-powered browser extension that helps users compare Amazon products quickly and make better purchasing decisions without manually opening multiple product pages.

## Overview

Shopping online often means comparing dozens of products based on price, ratings, specifications, reviews, and features. The **Amazon Shopping Assistant** simplifies this process by extracting relevant product information and presenting it in an easy-to-understand comparison.

The extension is designed to answer questions like:

* Which product offers the best value for money?
* Which product has better specifications?
* Is the more expensive product actually worth it?
* Which product has better customer ratings and reviews?
* What are the major differences between these products?
* Which product should I choose based on my requirements?

## Features

### Product Comparison

Compare multiple Amazon products side-by-side using important parameters such as:

* Price
* Rating
* Number of reviews
* Specifications
* Features
* Brand
* Warranty
* Availability
* Discounts

### AI-Powered Analysis

Instead of simply displaying raw specifications, the assistant can analyze the products and provide a concise comparison.

Example:

> **Product A** is cheaper and has a better rating, while **Product B** offers more storage and better performance. For everyday use, Product A provides better value for money.

### Smart Recommendations

Users can provide requirements such as:

> "I need a laptop under ₹60,000 for programming and college."

The assistant can evaluate available products and identify the options that best match those requirements.

### Review Analysis

The extension can analyze customer reviews to identify common opinions and potential problems, such as:

* Frequently reported defects
* Battery problems
* Build-quality complaints
* Positive features
* Long-term reliability concerns

### Side-by-Side Comparison

Products can be displayed in a structured comparison table:

| Feature   | Product A | Product B | Product C |
| --------- | --------- | --------- | --------- |
| Price     | ₹XX,XXX   | ₹XX,XXX   | ₹XX,XXX   |
| Rating    | 4.4       | 4.2       | 4.5       |
| Reviews   | X,XXX     | X,XXX     | X,XXX     |
| Processor | ...       | ...       | ...       |
| RAM       | ...       | ...       | ...       |
| Storage   | ...       | ...       | ...       |

### Quick Access

The assistant works directly alongside the shopping experience, reducing the need to repeatedly switch between tabs.

---

## How It Works

```text
Amazon Product Pages
        ↓
Product Data Extraction
        ↓
Data Cleaning & Normalization
        ↓
Product Comparison Engine
        ↓
AI Analysis
        ↓
Recommendation
        ↓
User
```

### 1. Detect Products

The extension identifies Amazon product pages and extracts relevant information.

### 2. Extract Product Data

Important information such as price, ratings, specifications, and reviews is collected.

### 3. Normalize Information

Different products often describe the same specification differently.

For example:

```text
8 GB RAM
8GB RAM
RAM: 8 GB
8 GB DDR4
```

The system can normalize these values to make comparisons easier.

### 4. Compare Products

The comparison engine evaluates products across multiple attributes.

### 5. AI Analysis

An AI model can summarize the differences and explain the advantages and disadvantages of each product.

### 6. Recommendation

The assistant provides a recommendation based on the user's requirements rather than simply selecting the product with the highest rating.

---

## Tech Stack

### Frontend

* JavaScript / TypeScript
* HTML
* CSS
* Chrome Extension APIs

### Backend

* Node.js
* Express.js

### AI

* LLM API
* Prompt-based product analysis
* Structured product comparison

### Data Processing

* Product information extraction
* Data normalization
* Review analysis
* Feature comparison

---

## Project Structure

```text
amazon-shopping-assistant/
│
├── extension/
│   ├── manifest.json
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   │
│   ├── content/
│   │   └── amazon.js
│   │
│   ├── background/
│   │   └── background.js
│   │
│   └── assets/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── README.md
└── package.json
```

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/amazon-shopping-assistant.git
cd amazon-shopping-assistant
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file:

```env
AI_API_KEY=your_api_key
```

### Load the extension

1. Open Chrome.
2. Navigate to `chrome://extensions`.
3. Enable **Developer Mode**.
4. Select **Load unpacked**.
5. Select the `extension` directory.

---

## Example Usage

Open an Amazon product page and launch the extension.

Select additional products to compare and the assistant can generate a comparison such as:

```text
PRODUCT COMPARISON

Best Overall:
Product A

Best Value:
Product B

Best Performance:
Product C

Why?

Product A provides the best balance between
price, performance and customer ratings.

Product B is cheaper but compromises on
some specifications.

Product C has the highest performance but
may not justify its additional cost for
casual users.
```

---

## Future Improvements

* [ ] Multi-product comparison
* [ ] AI-powered review summarization
* [ ] Personalized recommendations
* [ ] Price history tracking
* [ ] Price-drop notifications
* [ ] Product quality scoring
* [ ] Fake/suspicious review detection
* [ ] Cross-store comparison
* [ ] Natural-language product search
* [ ] Budget-based recommendations
* [ ] User preference profiles
* [ ] Product recommendation explanations
* [ ] Historical price analysis

## Research Potential

The project can be extended beyond a simple browser extension into a research-oriented system.

Potential research areas include:

### Explainable Product Recommendation

Instead of only recommending a product, the system explains **why** it was selected and which factors influenced the decision.

### Review Intelligence

Analyze large volumes of reviews to identify recurring problems and product-specific trends.

### Personalized Ranking

Different users have different priorities. A programmer, gamer, student, and photographer may rank the same products differently.

The system could therefore generate:

```text
Product Score =
Price Weight
+ Performance Weight
+ Reliability Weight
+ Reviews Weight
+ User Preference Weight
```

### Multi-Criteria Decision Making

Products can be evaluated using multiple criteria rather than relying on a single metric such as rating or price.

This makes the project suitable for further development into a **research paper, recommendation system, or intelligent shopping platform**.

---

## Disclaimer

This project is intended for educational and research purposes. Product information, prices, availability, ratings, and reviews may change over time and should be verified on the retailer's website before making a purchase.

## License

This project is licensed under the MIT License.
