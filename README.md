# Hierarchy Processor - Full Stack Engineering Challenge

A full-stack application built with Node.js/Express (Backend) and React/Vite (Frontend) that processes hierarchical node relationships, builds trees, detects cycles, and provides structured insights.

## Project Structure

```text
hierarchy-processor/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── controllers/
│       └── hierarchyController.js
└── frontend/
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        └── components/
            ├── TreeView.jsx
            └── ResultsCard.jsx
```

## Features

- **Validation Rules**: Ensures nodes are uppercase single letters, separated by `->`. Handles multi-character, invalid formats, and self-loops cleanly.
- **Duplicate Handling**: Ignores exact duplicates and exposes them in the `duplicate_edges` report array.
- **Cycle Detection**: Robustly uses DFS to identify cycles and appropriately flags invalid circular hierarchies.
- **Tree Construction**: Enforces the "First parent wins" rule, discarding complex multiple-parent graphs into well-defined distinct trees.
- **Depth Calculation**: Finds the largest overarching tree by calculating max node-depth. Tie breaks use the lexicographically smaller root.
- **Clean UI**: A "Notion-inspired" clean, minimalist, high-contrast typography interface. Responsive, visually impressive, with micro-animations.

## Quick Start Local Development

### 1. Backend Setup

Open a terminal in the root folder, navigate to the `backend` directory, install packages and start the dev server:
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:5000`.

### 2. Frontend Setup

Open a new, separate terminal. Navigate to the `frontend` directory, install dependencies, and run:
```bash
cd frontend
npm install
npm run dev
```
The frontend will typically run on `http://localhost:5173`. Open it in your browser.

## Sample Test Cases

**Test Case 1: Valid Tree**
- Input: `["A->B", "A->C", "B->D"]`
- Output: Valid overarching tree with root A, spanning a depth of 3. Total Trees: 1.

**Test Case 2: Multi-parent (Diamond Problem)**
- Input: `["A->B", "C->B"]`
- Output: Valid tree with root A. The `C->B` edge is proactively ignored due to the "First parent wins" rule.

**Test Case 3: Cycle Detection**
- Input: `["A->B", "B->C", "C->A"]`
- Output: Resolves to a loop. The backend returns `{ "tree": {}, "has_cycle": true }` specifically for this circular component. Total Cycles: 1.

**Test Case 4: Invalid Formats and Duplicates Combined**
- Input: `["A->B", "A->B", "hello", "1->2", "A-B"]`
- Output: `A->B` successfully processed into a tree. Duplicates populated: `["A->B"]`. Invalid payload: `["hello", "1->2", "A-B"]`.

## Deployment Steps

### Backend Deployment (Render or Railway)
1. Initialize a git repository and push the source code to GitHub.
2. In the target service (e.g., Render), create a new "Web Service".
3. Point to your repository branch and set the Root Directory to `backend`.
4. Configure Build Command: `npm install`
5. Configure Start Command: `npm start`
6. Click Deploy. Ensure CORS is correctly configured if necessary.

### Frontend Deployment (Vercel or Netlify)
1. In Vercel, create a new Project by importing the repository.
2. Ensure Vercel auto-detects the framework as `Vite`.
3. Set the Root Directory strictly to `frontend`.
4. Define Environment Variables if needed. Wait until your Backend URL is active, and update the raw `fetch` call in `App.jsx` to hit the production backend if it's no longer running locally.
5. Hit Deploy.
