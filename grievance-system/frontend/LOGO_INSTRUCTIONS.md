# How to Add Your JanSamadhan.ai Logo

## Option 1: Using `frontend/logo/` folder (recommended)

1. Locate your logo file (e.g. `logo.png` or `logo.jpg`).
2. Copy it into:
   ```
   frontend/logo/logo.png
   ```
   If the `logo` folder doesn’t exist, create it inside the `frontend` folder.
3. Name the file `logo.png` (or `logo.jpg` if you prefer).
4. Restart the frontend dev server so it picks up the new file.

## Option 2: Using `frontend/public/logo/` folder

1. Copy your logo file into:
   ```
   frontend/public/logo/logo.png
   ```
   If `public/logo` doesn’t exist, create it.
2. Name the file `logo.png`.
3. Restart the frontend dev server.

## File path summary

```
grievance-system/
└── frontend/
    ├── logo/           ← Option 1: put logo.png here
    │   └── logo.png
    └── public/
        └── logo/       ← Option 2: or put logo.png here
            └── logo.png
```

Either location works; the app looks for `logo.png` in both places.
