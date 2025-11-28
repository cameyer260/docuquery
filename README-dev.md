# Dev Notes – DocuQuery

### Current Focus
- deploy, go through all remembers relevant to deployment

### Remember
- When you deploy add basic rate limiting for read and write. In the upload route specifically, rate limit users on upload count and the size of the documents
- When you deploy setup github actions.
- When you deploy install imagemagick binary on the vps, it is used in the image generation script
- When you deploy install poppler-utils, it is used in the pdf parsing to harvest the text from pdfs
- The about and terms and conditions pages are not a finished product yet and will change throughout the entire development phase
- Any time you add a new provider you need to update the account page to include it correctly
- When you add payment, deleting an account will need to be updated accordingly. The user will have to cancel their plan first or you auto-cancel for them.

### Next Steps
1. Once you've created a working mvp, deploy to prod-> follow all generic first-time deploy steps on vps, copy .env vars over changing NEXT_AUTH url from local host to correct url, and get google oauth project published and out of "testing" via the cloud oauth api
2. Implement caching
3. Add rate limits (while in development, do not require payment, implement hard limits on both auth and unauthed users)
4. Implement stripe
5. Re-configure rate limits and make it a finished product

### Known Bugs
- None currently
