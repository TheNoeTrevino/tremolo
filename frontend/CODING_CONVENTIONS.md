# Frontend Coding Conventions

This document outlines the coding standards and patterns used in the Tremolo frontend codebase.

## Styling

### No Inline Styles - Use Material UI's `sx` Prop

**Do not use inline `style` objects.** Instead, use Material UI's `sx` prop for all styling.

```tsx
// ❌ BAD - Don't do this
<Box style={{ display: "flex", marginTop: "2rem" }}>

// ✅ GOOD - Use sx prop
<Box sx={{ display: "flex", mt: "2rem" }}>
```

### Style Organization Patterns

There are three acceptable patterns for organizing styles:

#### 1. Centralized Styles File (`styles.tsx`)

For styles shared across multiple components or pages, define them in `src/styles.tsx`:

```tsx
import { SxProps } from "@mui/material";

const navbarStyles: Record<string, SxProps> = {
  musicNoteIcon: {
    display: { xs: "none", md: "flex" },
    mr: 1,
  },
  button: {
    my: 2,
    color: "white",
    display: "block",
  },
};

export { navbarStyles };
```

Usage:
```tsx
import { navbarStyles } from "../../styles";

<MusicNoteIcon sx={navbarStyles.musicNoteIcon} />
```

#### 2. Page-Specific Style Files

For complex pages with many styles, create a `[PageName]Styles.tsx` file in the same directory:

```tsx
// pages/note-game/NoteGameStyles.tsx
import { SxProps } from "@mui/system";

const noteGameStyles: Record<string, SxProps> = {
  mainDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  musicContainer: {
    flex: "2",
    width: "50%",
    borderRadius: "10px",
  },
};

export { noteGameStyles };
```

#### 3. Component-Local Styles

For simpler components with minimal styling, define styles as constants at the top of the file:

```tsx
import { SxProps } from "@mui/material";

const mainDiv: SxProps = {
  display: "flex",
  flexDirection: "column",
  p: "1rem",
};

const graphStyles: SxProps = {
  flex: "1",
};

const Dashboard = () => {
  return <Box sx={mainDiv}>...</Box>;
};
```

### Style Type Annotations

Always type your styles with `SxProps`:

```tsx
// Single style object
const myStyle: SxProps = { ... };

// Collection of styles
const myStyles: Record<string, SxProps> = { ... };
```

### Spreading Styles

When you need to combine or override styles, use the spread operator:

```tsx
<Button sx={{ ...noteGameStyles.answerButtons, color: "red" }} />
```

## Component Structure

### Functional Components with TypeScript

All components should be functional components using TypeScript:

```tsx
import { Box, Typography } from "@mui/material";
import { useState } from "react";

interface MyComponentProps {
  title: string;
  onSubmit: (value: string) => void;
}

const MyComponent = ({ title, onSubmit }: MyComponentProps) => {
  const [value, setValue] = useState<string>("");

  return (
    <Box>
      <Typography>{title}</Typography>
    </Box>
  );
};

export default MyComponent;
```

### Props Definition

Define props as interfaces:

```tsx
interface ButtonProps {
  text: string;
  handleClick: (event: MouseEvent<HTMLElement>) => void;
  options: { name: string; option: string }[];
  styles?: SxProps;
  startIcon?: React.ReactNode;
}
```

### Default Exports

Use default exports for components:

```tsx
export default MyComponent;
```

For constants and utilities, use named exports:

```tsx
export const scaleOptions = [...];
export const octaveOptions = [...];
```

## Material UI

### Import Patterns

Import Material UI components and their types:

```tsx
import { Box, Button, Typography, SxProps } from "@mui/material";
import { MouseEvent, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
```

### Component Usage

Prefer Material UI components over standard HTML elements:

```tsx
// ✅ GOOD
<Box>
  <Typography variant="h1">Title</Typography>
</Box>

// ❌ AVOID
<div>
  <h1>Title</h1>
</div>
```

### Responsive Design

Use Material UI's responsive syntax in `sx` props:

```tsx
<Box sx={{
  width: { xs: "100%", md: "50%" },
  display: { xs: "none", md: "flex" }
}}>
```

Where:
- `xs`: extra-small (mobile)
- `sm`: small (tablet)
- `md`: medium (desktop)
- `lg`: large
- `xl`: extra-large

### Spacing Shortcuts

Use Material UI's spacing shortcuts in `sx` props:

```tsx
// Margin
m: 1      // margin: theme.spacing(1)
mt: 2     // margin-top: theme.spacing(2)
mr: 1     // margin-right: theme.spacing(1)
mb: 2     // margin-bottom: theme.spacing(2)
ml: 1     // margin-left: theme.spacing(1)
mx: 2     // margin-left & margin-right
my: 2     // margin-top & margin-bottom

// Padding (same pattern)
p: 1
pt: 2
pr: 1
pb: 2
pl: 1
px: 2
py: 2
```

## File Organization

```
src/
├── components/          # Reusable components
│   ├── musical/        # Musical-specific components
│   ├── navbar/         # Navigation components
│   └── data-visualization/
├── pages/              # Page components (route handlers)
│   ├── note-game/
│   │   ├── NoteGame.tsx
│   │   ├── NoteGameStyles.tsx
│   │   └── NoteGameUtilities.tsx
│   └── users/
├── services/           # API services
├── models/             # TypeScript interfaces and types
└── styles.tsx          # Shared styles
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `NoteGame.tsx`, `MusicButton.tsx`)
- Style files: `[ComponentName]Styles.tsx` (e.g., `NoteGameStyles.tsx`)
- Utility files: `[Feature]Utilities.tsx` (e.g., `NoteGameUtilities.tsx`)
- Services: `[Feature]Service.tsx` (e.g., `MusicService.tsx`)
- Models: `models.tsx`

## TypeScript

### Type Annotations

Use explicit types for state and function parameters:

```tsx
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>("");
const [data, setData] = useState<noteGameProps | undefined>(undefined);

const handleClick = (event: MouseEvent<HTMLElement>): void => {
  // ...
};
```

### Interfaces

Define interfaces in `src/models/models.tsx`:

```tsx
export interface rhythmMusicProps {
  scale: string;
  octave: string;
  rhythmType: number;
  rhythm: string;
}
```

## State Management

### Local State Only

This project uses **local component state** only. No global state management library (Redux, Zustand, etc.) is used.

```tsx
const [scaleChoice, setScale] = useState<string>("C");
const [octaveChoice, setOctaveChoice] = useState<string>("4");
```

### Passing State

Use props to pass state between components:

```tsx
// Parent
const [value, setValue] = useState<string>("");
<ChildComponent value={value} onChange={setValue} />

// Child
interface ChildProps {
  value: string;
  onChange: (newValue: string) => void;
}
```

## Naming Conventions

### Variables and Functions
- Use `camelCase` for variables, functions, and props
- Use descriptive names

```tsx
const scaleChoice = "C";
const handleScaleClick = () => { ... };
const fetchNote = async () => { ... };
```

### Components
- Use `PascalCase` for component names

```tsx
const NoteGame = () => { ... };
const MusicButton = () => { ... };
```

### Constants
- Use `camelCase` for constant arrays/objects
- Export named constants

```tsx
export const scaleOptions = [...];
export const octaveOptions = [...];
```

## Animation

Use Material UI animation components for transitions:

```tsx
import { Fade, Slide } from "@mui/material";

// Fade in on mount
<Fade in={true} timeout={500}>
  <Box>Content</Box>
</Fade>

// Slide in on mount
<Slide in={true} timeout={500}>
  <AppBar>...</AppBar>
</Slide>
```

## Event Handlers

### Naming

Prefix event handlers with `handle`:

```tsx
const handleClick = () => { ... };
const handleScaleClose = () => { ... };
const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => { ... };
```

### Type Safety

Type event parameters:

```tsx
const handleClick = (event: MouseEvent<HTMLElement>) => {
  setAnchorEl(event.currentTarget);
};

const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
  // ...
};
```

## Services

### Service Pattern

Services should be organized as objects with async methods:

```tsx
// services/MusicService.tsx
export const MusicService = {
  async getMaryMusic({ scale, octave }: generatedMusicProps): Promise<void> {
    const response = await axios.post<string>(
      `${baseUrl}/mary`,
      { tonic: scale, octave: octave },
      { responseType: "text" }
    );
    // ... handle response
  },
};
```

### Usage

```tsx
import { MusicService } from "../../services/MusicService";

const fetchData = async () => {
  await MusicService.getMaryMusic({ scale: "C", octave: "4" });
};
```

## Summary

Key principles:
1. **No inline styles** - always use `sx` prop
2. **Type everything** - use TypeScript interfaces and type annotations
3. **Material UI first** - prefer MUI components over HTML
4. **Functional components** - use hooks for state and effects
5. **Local state only** - no global state management
6. **Organized styles** - use the three style organization patterns
7. **Descriptive naming** - clear, descriptive names for all identifiers
