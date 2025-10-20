# Dev Notes – DocuQuery

### Current Focus
- Continue creating the UI for the entire site, pickup at /ask/[title] route, make the ui for a log WITH chat history
- Make the landing page look better, use more shadcn components and ai

### Remember
- The about and terms and conditions pages are not a finished product yet and will change throughout the entire development phase

### Next Steps
1. Finish UI for entire site
2. Add auth methods
3. Connect to db 
4. Implement uploading/digesting files with all necessary api routes (chunk pdf file up, then send to pinecone to be embedded and stored)
5. Implement necessary api(s) for /ask:
    - take user input, send it to pinecone for ONLY embedding and query db for similar results from docs that user owns
    - create the prompt following layout in notebook, combine the text of the relevant pdf chunks and the user's text question
    - send prompt to openai api
    - apply rate limits here, update wherever they are stored in (cache, db, etc)
    - return the response back to the user
5. Implement caching
6. Add rate limits (while in development, do not require payment, implement hard limits on both auth and unauthed users)
7. Implement stripe
8. Re-configure rate limits and make it a finished product

### Known Bugs
- None currently
