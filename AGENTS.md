# Agent Instructions

## Code Design Guidelines
- Adhere to SOLID principles.
- Prefer dependency injection over global singletons.
- Emphasize single responsibility for classes/modules.

## Documentation Guidelines
- Include Windows-specific examples alongside Unix commands.
- Update files in `docs/` whenever relevant documentation changes are made elsewhere.

## Required Checks
Before marking any code task as complete, ensure the following commands are run and pass:

```
npm run build
npm run lint
npm run test
```

If any command fails, fix the issues before completing the task.
