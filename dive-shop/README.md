# Dive Shop - SvelteKit Website

A modern, Apple-inspired website for dive training courses and gear, built with SvelteKit and custom CSS.

## Features

- **Two Main Categories**: Dive Training and Dive Gear
- **Interactive Navigation**: Click on category cards to view products
- **Apple-Inspired Design**: Clean, minimal aesthetic with smooth animations
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **TypeScript Support**: Fully typed components for better development experience
- **Easy Customization**: CSS variables and modular structure

## Project Structure

```
dive-shop/
├── src/
│   ├── routes/
│   │   └── +page.svelte          # Main page with category selection and products
│   ├── styles/
│   │   └── main.css               # Apple-inspired styles (can be customized)
│   └── app.html                   # HTML template
├── static/
│   └── images/                    # Product images (placeholder directory)
└── package.json
```

## Getting Started

### Installation

```bash
cd dive-shop
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Customization

### Styling

The main CSS file is located at `src/styles/main.css`. You can customize:

- **CSS Variables** (at the top of the file):
  - Colors (backgrounds, text, accent colors)
  - Shadows and border radius
  - Transitions and animations

- **Component Styles**:
  - Hero section
  - Category cards
  - Product grid and cards
  - Buttons and interactions

### Products

Products are defined in `src/routes/+page.svelte`:

- `trainingProducts`: Array of training courses
- `gearProducts`: Array of diving equipment

Each product has:
- `id`: Unique identifier
- `name`: Product name
- `price`: Display price
- `image`: Image path (relative to `/static/`)
- `description`: Product description

### Adding Images

Place product images in the `static/images/` directory and reference them in the product data:

```typescript
{
  id: 1,
  name: 'Your Product',
  image: '/images/your-product.jpg',
  // ...
}
```

## Design Philosophy

This website follows Apple's design principles:

1. **Simplicity**: Clean, uncluttered interface
2. **Clarity**: Clear typography and hierarchy
3. **Depth**: Subtle shadows and elevation
4. **Motion**: Smooth, purposeful animations
5. **Consistency**: Uniform spacing and styling

## Technologies

- **SvelteKit**: Fast, modern web framework
- **TypeScript**: Type-safe development
- **CSS3**: Custom styling with animations
- **Responsive Design**: Mobile-first approach

## Next Steps

- Add product images to `/static/images/`
- Customize colors in `main.css`
- Add more products or categories
- Implement shopping cart functionality
- Add product detail pages
- Connect to a backend API

## License

This project is provided as-is for customization and use.
