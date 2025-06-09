# Tiptap Editor Project

Thank you for installing the Tiptap Simple Editor template via the Tiptap CLI! This README will help you get started quickly.

## Getting Started
Before running the project, make sure to install the required Tiptap packages:

```bash
npm i @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-task-item @tiptap/extension-task-list @tiptap/extension-text-align @tiptap/extension-typography
```

### Run the project
Install dependencies (if you haven't already):

```bash
npm install
```
or use yarn or pnpm.

### Start the development server

```bash
npm run dev
```
or yarn or pnpm.

### Include Global Styles
To apply the correct styles to the editor, manually import these files into your main CSS/SCSS entry point:

```jsx
@import 'path-to/_variables.scss';
@import 'path-to/_keyframes-animations.scss';
```

Make sure the path matches your project structure.


### Access the template
Once the server is running, you can access the Tiptap Simple Editor template by visiting the /simple route in your application.

http://localhost:3000/simple

## Documentation
To learn more about the Tiptap Simple Editor and how to customize it, visit the official documentation:
[Tiptap Simple Editor Documentation](https://tiptap.dev/docs/ui-components/templates/simple-editor)
