## Description

<!-- Provide a clear and concise description of what this PR does -->

## Type of Change

<!-- Check all that apply -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Performance improvement
- [ ] Code refactoring (no functional changes)
- [ ] Documentation update
- [ ] Dependency update
- [ ] Other (please describe):

## Related Issues

<!-- Link to related issues using keywords: Fixes #123, Closes #456, Relates to #789 -->

Fixes #

## Motivation and Context

<!-- Why is this change required? What problem does it solve? -->

## Changes Made

<!-- Provide a detailed list of changes -->

-
-
-

## Testing

<!-- Describe the testing you've performed -->

### Test Environment

- **Browser(s)**:
- **OS**:
- **Device**: Desktop / Mobile / Tablet

### Test Cases

<!-- Describe specific scenarios you tested -->

- [ ] Manual testing completed
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Tested with slow/metered connections (if relevant)
- [ ] Tested database loading and caching (if relevant)

### Test Results

<!-- Describe what you verified works correctly -->

-
-

## Database Impact

<!-- Check all that apply -->

- [ ] No database changes
- [ ] New queries added
- [ ] Query optimization/changes
- [ ] Database schema understanding updated
- [ ] Requires new database version or migration

## Performance Impact

<!-- Consider the 207MB database and client-side execution -->

- [ ] No performance impact expected
- [ ] Performance improvement (describe below)
- [ ] Potential performance regression (describe mitigation below)

**Performance notes:**

## UI/UX Changes

<!-- If this PR affects the user interface -->

### Screenshots

<!-- Add screenshots showing before/after if applicable -->

**Before:**

**After:**

### Responsive Design

- [ ] Tested on desktop (1920x1080+)
- [ ] Tested on tablet (768px-1024px)
- [ ] Tested on mobile (320px-767px)
- [ ] Dark mode tested
- [ ] Light mode tested

## Documentation

<!-- Check all that apply -->

- [ ] Code is self-documenting with clear variable/function names
- [ ] Added/updated code comments for complex logic
- [ ] Updated CLAUDE.md (if architecture/patterns changed)
- [ ] Updated README.md (if user-facing changes)
- [ ] Added JSDoc comments for new functions/components

## Code Quality

<!-- Ensure code quality standards -->

- [ ] Code follows the existing style and patterns
- [ ] TypeScript types are properly defined (no `any` unless necessary)
- [ ] No console.log or debugging code left in
- [ ] Removed unused imports and variables
- [ ] `npm run lint` passes without errors
- [ ] `npm run build` completes successfully

## Deployment Checklist

<!-- For production deployments -->

- [ ] Tested in production build (`npm run build && npm run preview`)
- [ ] No hardcoded development URLs or API keys
- [ ] Asset paths are correct for CloudFront/S3 deployment
- [ ] Analytics/privacy features work correctly

## Breaking Changes

<!-- If this is a breaking change, describe the impact and migration path -->

**Does this PR introduce breaking changes?** No / Yes

<!-- If yes, describe: -->
- What breaks:
- Migration path:
- Deprecation warnings added:

## Rollback Plan

<!-- How can this change be reverted if needed? -->

- [ ] Simple git revert
- [ ] Requires database rollback (describe):
- [ ] Requires cache clearing (localStorage/IndexedDB)

## Additional Notes

<!-- Any additional information, context, or screenshots -->

---

## Reviewer Checklist

<!-- For reviewers -->

- [ ] Code changes align with LENR Academy's mission and architecture
- [ ] Changes are well-tested and reproducible
- [ ] No obvious performance regressions
- [ ] UI changes are consistent with existing design
- [ ] Documentation is adequate
- [ ] No security concerns (XSS, data leaks, etc.)
- [ ] AGPL-3.0 license compliance maintained
