# PerfectExpress V2 Integration Guide

## Option 1: Automated Setup (Recommended)
We have included a `setup.sh` script to automate the process.

1. Open your terminal in this folder.
2. Run:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
3. Follow the on-screen instructions to push your changes.

## Option 2: Manual Integration
If you prefer to do this manually, follow these steps:

1.  **Clone the existing repository**
    ```bash
    git clone https://github.com/ZZYXX-CC/perfectexpress-courier.git
    cd perfectexpress-courier
    ```

2.  **Create a new branch**
    ```bash
    git checkout -b feature/frontend-v2
    ```

3.  **Create the V2 directory**
    ```bash
    mkdir frontend-v2
    ```

4.  **Copy Files**
    Copy all files from this project (excluding `.git` and `perfectexpress-courier` folder) into the `frontend-v2` folder.

5.  **Commit and Push**
    ```bash
    git add frontend-v2
    git commit -m "feat: add perfect-express-v2 frontend implementation"
    git push origin feature/frontend-v2
    ```

## Notes on Architecture
The `index.html` is configured to use relative paths (`./index.tsx`). This ensures the app runs correctly inside the `/frontend-v2/` subdirectory without needing root-level access on the domain.
