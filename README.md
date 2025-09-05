# 📺 [Demo Video](https://drive.google.com/file/d/1TTCRI2KkjPfDJWvOVwb8yiDJLLHkvUKF/view?usp=sharing)

# FinBoard Dashboard

FinBoard is a modern, responsive dashboard for financial widgets, built with Next.js and TypeScript. It allows users to add, edit, and manage custom widgets for financial data, including charts and tables, with drag-and-drop and dark mode support.

## Features

- **Add/Edit Widgets:** Easily add new widgets with custom API endpoints, keys, intervals, and layouts (table, chart, card).
- **Drag-and-Drop:** Rearrange widgets using a simple drag handle.
- **Responsive Design:** Widgets and layout adapt to all screen sizes.
- **Uniform Widgets:** Widgets maintain uniform height and wrap to new rows as needed.
- **Dark/Light Theme:** Toggle between dark and light modes for optimal viewing.
- **Sticky Header:** Prominent, sticky dashboard header for easy navigation.
- **Modern UI:** Sleek buttons, cards, and modals for a professional look.

## Technologies Used

- **Next.js** (App Router)
- **TypeScript**
- **React**
- **@dnd-kit/core** (drag-and-drop)
- **Recharts** (charts)
- **Lucide React** (icons)
- **ESLint** (with strict TypeScript rules)

## Folder Structure

```
app/
  components/
	 AddWidgetModal.tsx      # Modal for adding widgets
	 EditWidgetModal.tsx     # Modal for editing widgets
	 WidgetCard.tsx          # Individual widget card
	 WidgetManager.tsx       # Manages widget grid and drag/drop
	 ThemeToggle.tsx         # Theme switcher
	 dnd/                    # Drag-and-drop helpers
  store/
	 widgetStore.ts          # Zustand store for widget state
public/                     # Static assets
README.md                   # Project documentation
```

## How It Works

1. **Add Widget:** Click "+ Add Widget" to open the modal. Enter API details, choose layout, and save.
2. **Edit Widget:** Click the settings icon on any widget to edit its configuration.
3. **Delete Widget:** Click the trash icon to remove a widget.
4. **Drag & Drop:** Use the handle at the top of each widget to rearrange.
5. **Theme Toggle:** Switch between dark and light modes using the toggle beside the Add Widget button.
6. **Responsive Grid:** Widgets automatically wrap to new rows and maintain consistent sizing.

## Customization

- **Widget Layouts:** Supports table, chart, and card layouts for flexible data display.
- **API Integration:** Widgets fetch data from user-provided API endpoints with optional headers and keys.
- **Strict TypeScript:** Codebase enforces strict typing for reliability and maintainability.

## Setup & Deployment

1. **Install dependencies:**
	```bash
	npm install
	```
2. **Run locally:**
	```bash
	npm run dev
	```
3. **Lint:**
	```bash
	npm run lint
	```
4. **Deploy:**
	- Push to GitHub and connect to Vercel for instant deployment.

## ESLint & TypeScript

- The codebase enforces `@typescript-eslint/no-explicit-any` globally for type safety.
- All components are strictly typed and checked for unused variables and other best practices.

## Contributing

Pull requests and suggestions are welcome! Please follow the code style and add tests for new features.

## License

MIT

---

**FinBoard** is designed for flexibility, clarity, and a great user experience. For questions or support, contact the maintainer or open an issue on GitHub.
