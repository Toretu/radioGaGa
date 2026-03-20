# GitHub Copilot Instructions for MyRadio Project

## Project Context
This is an Electron-based desktop radio player application for Windows, built with React and TypeScript. The app streams Norwegian NRK radio channels and is designed for incremental releases with CI/CD automation.

## Core Development Principles

### 1. Code Quality & Best Practices
- **Always write TypeScript** with proper type definitions - no `any` types unless absolutely necessary
- **Follow React best practices**: Use hooks properly, avoid unnecessary re-renders, implement proper cleanup
- **Component structure**: Keep components small, focused, and reusable
- **Error handling**: Always implement proper error handling for network requests and audio operations
- **Clean code**: Write self-documenting code with clear variable/function names
- **Comments**: Add JSDoc comments for complex functions and business logic
- **Consistent formatting**: Follow the existing code style in the project
- **No console.logs in production**: Use proper logging or remove debug statements before committing

### 2. Testing & Quality Assurance
- **Test before committing**: Always verify code changes work locally with `npm start`
- **Build verification**: Run `npm run build` to ensure no build errors
- **No breaking changes**: Ensure existing functionality continues to work
- **Progressive enhancement**: Add features incrementally without breaking current features
- **Cross-file impact**: Check if changes affect other components or services

### 3. Documentation & Project Tracking

#### MANDATORY: Update PROJECT_PLAN.md
**Every time you complete a task or feature, you MUST update PROJECT_PLAN.md:**

- [ ] Mark completed tasks with `[x]` in the Development Phases Timeline
- [ ] Update the "Current Implementation Status" section
- [ ] Update the "Project Status Dashboard" with current phase and progress
- [ ] Add notes to "Recent Updates" section with date and description
- [ ] Update version number when making releases

**Example workflow:**
1. Implement feature (e.g., add custom channel)
2. Test and verify it works
3. Update PROJECT_PLAN.md to mark the task complete
4. Commit both code changes and PROJECT_PLAN.md together

#### Code Documentation
- Update README.md when adding new features visible to users
- Add inline comments for complex business logic
- Update TypeScript interfaces when data structures change

### 4. Release-Ready Development

#### Each Iteration Must Be Releasable
- **No broken builds**: Code must compile without errors
- **No runtime errors**: Test critical paths before committing
- **Graceful degradation**: Handle missing data or network failures gracefully
- **User experience**: Ensure UI remains responsive and intuitive

#### Before Committing Any Code:
1. ✅ Run `npm start` and verify the app launches
2. ✅ Test the feature you implemented
3. ✅ Test existing features to ensure nothing broke
4. ✅ Run `npm run build` to verify production build works
5. ✅ Update PROJECT_PLAN.md with completed tasks
6. ✅ Write clear, descriptive commit messages

#### Commit Message Guidelines
Follow conventional commits format:
- `feat: add custom channel management feature`
- `fix: resolve audio playback stuttering issue`
- `docs: update PROJECT_PLAN.md with Week 3 progress`
- `refactor: simplify audioService error handling`
- `chore: update dependencies`

### 5. Architecture & Patterns

#### State Management
- Use Zustand store (`useStore.ts`) for global state
- Keep component state local when possible
- Don't duplicate state between store and components

#### Service Pattern
- **audioService.ts**: All audio playback logic
- **channelService.ts**: Channel CRUD operations (when implemented)
- Keep services pure and testable

#### Component Organization
- **Components**: UI components in `src/renderer/components/`
- **Data**: Static data in `src/renderer/data/`
- **Types**: TypeScript definitions in `src/renderer/types/`
- **Store**: State management in `src/renderer/store/`

#### IPC Communication (Main ↔ Renderer)
- Use proper IPC patterns for Electron main/renderer communication
- Handle IPC errors gracefully
- Document IPC channels clearly

### 6. Specific Project Rules

#### Audio Playback
- Always handle stream loading failures
- Implement proper cleanup on component unmount
- Handle network interruptions gracefully

#### Channel Management
- Validate channel URLs before saving
- Handle missing or invalid stream URLs
- Preserve user data across app restarts

#### UI/UX Requirements
- Keep the UI simple and intuitive
- Provide feedback for user actions (loading states, error messages)
- Ensure keyboard navigation works
- Maintain consistent styling with existing components

### 7. CI/CD & Releases

#### GitHub Actions Workflows
- Don't modify workflows unless necessary
- Test workflow changes carefully
- Keep `npm install` (not `npm ci`) as we don't use package-lock.json

#### Version Bumping
- Use semantic versioning (patch/minor/major)
- Trigger releases via GitHub Actions "Bump Version" workflow
- Ensure `package.json` version stays in sync

#### Release Checklist
Before triggering a release:
1. ✅ All planned features for the version are complete
2. ✅ PROJECT_PLAN.md is up to date
3. ✅ App runs without errors
4. ✅ No console errors in production build
5. ✅ README.md reflects current features

## Quick Reference

### Common Tasks

**Starting Development:**
```bash
npm start  # Launch dev mode with hot reload
```

**Building for Production:**
```bash
npm run build      # Build renderer
npm run build:main # Build main process
npm run dist:win   # Create Windows installer
```

**Triggering a Release:**
1. Go to GitHub Actions → "Bump Version"
2. Select version bump type (patch/minor/major)
3. Workflow creates release automatically

### File Structure Reminders
- Main process: `src/main/main.ts`
- Renderer entry: `src/renderer/index.tsx`
- Main component: `src/renderer/App.tsx`
- Store: `src/renderer/store/useStore.ts`
- Audio logic: `src/renderer/services/audioService.ts`

## When You Make Changes

### ✅ DO:
- Test thoroughly before committing
- Update PROJECT_PLAN.md with completed tasks
- Write clear commit messages
- Keep code clean and maintainable
- Handle errors gracefully
- Maintain backward compatibility
- Follow existing code patterns

### ❌ DON'T:
- Commit broken code
- Skip testing
- Forget to update PROJECT_PLAN.md
- Use `any` types unnecessarily
- Leave debug console.logs
- Break existing functionality
- Commit without verifying the build works

## Priority Order
1. **Working code** - Nothing broken, app runs
2. **Documentation** - PROJECT_PLAN.md updated
3. **Code quality** - Clean, maintainable code
4. **Features** - New functionality

Remember: **A smaller working feature is better than a larger broken one.**

## Questions?
Refer to:
- PROJECT_PLAN.md for project roadmap and progress
- README.md for user-facing documentation
- Existing code for patterns and conventions
