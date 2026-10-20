# AGENTS.md

## 1. Core Engineering Principles

Follow these principles for every codebase task:

1. **Understand before modifying.**
2. **Reuse before creating.**
3. **Extend before duplicating.**
4. **Make the smallest safe change.**
5. **Preserve existing behavior.**
6. **Follow existing project patterns.**
7. **Verify every code change.**
8. **Do not modify unrelated code.**

The existing codebase is the primary source of truth for architecture, conventions, and implementation patterns.

---

## 2. Graphify — Primary Code Navigation

This project uses Graphify for code navigation.

If `graphify-out/graph.json` exists, Graphify MUST be used before manually exploring the repository.

### For general codebase questions

Run:

```bash
graphify query "<user question>"
```

### For relationship/dependency tracing

Run:

```bash
graphify path "<A>" "<B>"
```

Use this when understanding relationships such as:

* Component → Service
* Service → API
* API → Model
* Function → Caller
* Feature → Dependency

### For subsystem understanding

Run:

```bash
graphify explain "<concept>"
```

Use this when understanding an existing subsystem or feature.

---

## 3. Graphify Token-Saving Rules

* Never scan the repository before attempting Graphify.
* Never grep the entire repository unless Graphify cannot answer the question.
* Never read `GRAPH_REPORT.md` unless explicitly requested for an architecture overview.
* Prefer `graphify query`, `graphify path`, and `graphify explain`.
* If `graphify-out/wiki/index.md` exists, use it for navigation before browsing files manually.
* Open only files identified as relevant by Graphify or the wiki.
* Read only the relevant functions, classes, types, or sections.
* Do not read entire large files when only a small section is required.

### Graphify limitation

Do not blindly trust incomplete Graphify results.

If Graphify does not provide enough information to safely implement the requirement, perform targeted manual inspection of the smallest relevant set of files.

Correctness takes priority over token savings.

---

## 4. Search for Existing Functionality First

Before creating new code, determine whether the required functionality already exists.

Search for existing:

* Functions
* Components
* Hooks
* Services
* Utilities/helpers
* API clients
* Types/interfaces/models
* Validation
* Error handling
* Constants
* Configuration
* State-management logic
* UI patterns
* Tests

Follow this priority:

```text
Existing suitable functionality
        ↓
Reuse it
        ↓
If insufficient, extend it
        ↓
If no suitable functionality exists, create new code
```

**Never create duplicate functionality when suitable existing functionality can safely be reused.**

---

## 5. Existing Code Is the Primary Reference

When implementing a feature, inspect similar working implementations and follow their established patterns.

Use existing code to determine:

* Naming conventions
* Architecture
* Data flow
* API interaction
* Error handling
* Validation
* State management
* Component structure
* Styling
* Testing approach
* Dependency usage

Do not introduce a new pattern when an established project pattern already solves the problem.

### Important

Existing code is a reference, **not something to copy blindly**.

If an existing implementation contains an obvious bug, unsafe behavior, unnecessary duplication, or clearly outdated approach, do not reproduce the problem. Prefer the safest solution consistent with the project.

---

## 6. Minimal Code Changes

Make the smallest change that completely satisfies the requirement.

Do NOT:

* Refactor unrelated code
* Rename unrelated variables
* Reformat unrelated files
* Rearrange unrelated code
* Change architecture unnecessarily
* Replace existing libraries unnecessarily
* Upgrade dependencies unless required
* Add abstractions without a real need
* Fix unrelated bugs
* Modify unrelated files

### Golden Rule

> If a piece of code does not need to change to satisfy the requirement, leave it unchanged.

Optimize for **minimal necessary diff**, not simply minimum number of lines.

---

## 7. Reuse Before Duplication

Before adding new logic, check whether an existing implementation can be reused.

Prefer:

```text
Reuse existing function
        >
Extend existing function
        >
Extract genuinely shared logic
        >
Create new functionality
```

Do not create:

* Duplicate utilities
* Duplicate API calls
* Duplicate components
* Duplicate validation
* Duplicate business logic
* Duplicate types
* Duplicate error handling

Only extract shared functionality when it provides a clear benefit and does not create unnecessary complexity.

---

## 8. Preserve Existing Behavior

Existing functionality must continue working unless the requirement explicitly requests a behavior change.

Before modifying shared code:

1. Identify important callers/usages.
2. Understand dependencies.
3. Consider backward compatibility.
4. Check relevant tests.
5. Consider possible side effects.

Do not break existing consumers to make the implementation cleaner.

---

## 9. Simplicity Over Cleverness

Prefer code that is:

* Simple
* Readable
* Maintainable
* Efficient
* Consistent with the existing codebase

Avoid unnecessary:

* Abstraction layers
* Wrapper functions
* Classes
* State
* Configuration
* Dependencies
* Design patterns
* Comments explaining obvious code

Do not over-engineer a requirement.

---

## 10. Dependencies

Before adding a dependency:

1. Check whether the project already has a dependency that solves the problem.
2. Check whether existing project utilities can solve it.
3. Prefer existing dependencies and utilities.
4. Add a new dependency only when genuinely necessary.

Do not introduce a library for a problem that can reasonably be solved using existing project capabilities.

---

## 11. Types and Data Models

Reuse existing types/interfaces/models whenever possible.

Do not create duplicate representations of the same data.

Avoid unsafe typing such as:

```text
any
```

unless there is a legitimate technical reason and the existing project convention supports it.

If an existing type needs additional information, prefer extending it when safe rather than creating a duplicate type.

---

## 12. Error Handling

Follow the project's existing error-handling pattern.

Do not introduce a new error-handling architecture when an existing approach is already appropriate.

Handle realistic failure cases without adding excessive defensive code or unnecessary complexity.

---

## 13. Testing and Verification

After making code changes:

1. Run relevant tests.
2. Run type checking if available.
3. Run linting if available.
4. Run the build if appropriate.
5. Fix errors caused by the implementation.
6. Re-run validation after fixes.

Do not consider a task complete merely because the code compiles locally.

Use the project's existing validation commands and conventions.

---

## 14. Review the Final Diff

Before completing the task, inspect the final diff.

Verify:

* Only necessary files were changed.
* Existing functionality was reused where appropriate.
* No duplicate functionality was introduced.
* No unrelated refactoring was performed.
* No unnecessary formatting changes were made.
* Existing behavior was preserved.
* No unnecessary dependency was added.
* The implementation follows existing project patterns.
* Tests/build/lint/type checks were performed where applicable.

If unnecessary changes are found, remove them.

---

## 15. Code Change Workflow

For every implementation task, follow this workflow:

```text
1. Understand requirement
        ↓
2. Check Graphify/wiki
        ↓
3. Find existing functionality
        ↓
4. Inspect relevant implementation
        ↓
5. Identify the smallest safe change
        ↓
6. Implement
        ↓
7. Verify tests/typecheck/lint/build
        ↓
8. Review final diff
        ↓
9. Remove unnecessary changes
        ↓
10. Run Graphify update
        ↓
11. Report concise result
```

---

## 16. Graphify Maintenance

After modifying code, run:

```bash
graphify update .
```

Do not rebuild the entire graph unless explicitly requested.

---

## 17. Communication

Keep responses concise.

When completing a task, report:

* What was changed
* Files changed
* Verification performed
* Any important limitation or remaining issue

Do not summarize unchanged code.

---

## 18. Planning for Non-Trivial Changes

For non-trivial changes:

1. Investigate using Graphify.
2. Identify existing functionality and dependencies.
3. Prepare a concise implementation plan.
4. If approval is required by the user's workflow, present the plan before modifying source code.
5. After approval, implement only the agreed scope.

Do not expand the scope without a clear reason.

---

# Final Priority Order

When making implementation decisions, use this priority:

```text
1. Correctness
2. Preserve existing behavior
3. Reuse existing functionality
4. Follow existing architecture/patterns
5. Minimal necessary changes
6. Simplicity and maintainability
7. Performance optimization when justified
8. Token efficiency
```

Never sacrifice correctness merely to reduce tokens or the number of changed lines.

## Final Rule

> **Search → Understand → Reuse → Extend → Implement only what is missing → Verify → Review diff → Minimize changes → Update Graphify.**

The goal is not to write the most code or the fewest lines.

**The goal is to make the smallest correct change using as much existing functionality as reasonably possible.**

