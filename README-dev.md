# Dev Notes – DocuQuery

### Current Focus
- Allow the users to remove files from their account.
- Once all upload has been implemented, correctly clear s3 and pinecone of user data on their account deletion

### Remember
- When you deploy add basic rate limiting for read and write. In the upload route specifically, rate limit users on upload count and the size of the documents
- When you deploy setup github actions.
- When you deploy install imagemagick binary on the vps, it is used in the image generation script
- When you deploy install poppler-utils, it is used in the pdf parsing to harvest the text from pdfs
- The about and terms and conditions pages are not a finished product yet and will change throughout the entire development phase
- Any time you add a new provider you need to update the account page to include it correctly
- When you add payment, deleting an account will need to be updated accordingly. The user will have to cancel their plan first or you auto-cancel for them.

### Next Steps
1. Implement necessary api(s) for /ask:
    - take user input, send it to pinecone for ONLY embedding and query db for similar results from docs that user owns
    - create the prompt following layout in notebook, combine the text of the relevant pdf chunks and the user's text question
    - send prompt to openai api
    - apply rate limits here, update wherever they are stored in (cache, db, etc)
    - return the response back to the user
2. Once you've created a working mvp, deploy to prod-> follow all generic first-time deploy steps on vps, copy .env vars over changing NEXT_AUTH url from local host to correct url, and get google oauth project published and out of "testing" via the cloud oauth api
3. Implement caching
4. Add rate limits (while in development, do not require payment, implement hard limits on both auth and unauthed users)
5. Implement stripe
6. Re-configure rate limits and make it a finished product

### Known Bugs
- None currently
