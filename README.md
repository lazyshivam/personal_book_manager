
### Frontend README (`README.md`)

```markdown
# Library App - Frontend

A modern, responsive personal book manager web application built with Next.js, React, Tailwind CSS, and Axios.

## Features

- **Modern UI/UX:** Built with Tailwind CSS, clean grid layouts, interactive modals, and responsive navigation.
- **Route Protection & Security:** Server-side route boundary checks (via Next.js proxy) and Axios interceptors for automatic token lifecycle management.
- **Seamless Token Refresh:** Background Axios response interceptors that silently refresh expired access tokens using HTTP-Only cookies without disrupting the user.
- **Collection Insights & Filtering:** Instant filtering by reading status, case-insensitive tag searches, and dynamic counts of absolute vs. filtered books.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Data Fetching & Interceptors:** Axios
- **Language:** TypeScript

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Running instance of the Library Backend API

### Installation

1. Clone the repository and install dependencies:
   ```bash
   git clone <your-frontend-repo-url>
   cd frontend
   npm install