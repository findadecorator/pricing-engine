## Release vX.Y-dashboard-complete

### Summary
- Dashboard read-model builder implemented
- Dashboard endpoints and route wiring added
- Node-based smoke tests for pro, customer, realtime added and validated
- Session plan artifact replaced with finalized checklist (plan.md)

### Validation
- npm run build:dashboard succeeded
- npm run build succeeded
- Node smoke tests passed for:
  - GET /api/dashboard/pro
  - GET /api/dashboard/customer
  - GET /api/dashboard/realtime

### Post-merge actions
- Run migrations in staging and deploy
- Run full E2E smoke tests
- Schedule production deploy and monitor first 24 hours
- Clean up or archive locked folder on Windows machine

### Notes
- Node-based smoke tests are canonical for Windows environments.
- If any migration exists, run `npx prisma migrate deploy` in staging before deploy.
