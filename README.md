📘 DocuQuery

DocuQuery is an AI-powered document question-and-answer chatbot built with Retrieval-Augmented Generation (RAG).
It allows users to upload PDF files and ask questions directly about their contents. The system uses OpenAI’s GPT-5-mini model and is designed to ensure answers are grounded in the provided documents — not fabricated.

🚀 Overview

DocuQuery follows a standard RAG pipeline:

Users upload one or more PDF documents.

The system extracts and embeds text segments for semantic search.

When a question is asked, relevant chunks are retrieved from the PDF and passed to the GPT-5-mini model as context.

The chatbot responds only using information found in the document.

If the answer is not present, DocuQuery explicitly states that no answer was found rather than generating a “best guess.”

If the answer is found, the response includes citations referencing where in the document the information was located.

🎓 Purpose

DocuQuery is built for students and academic users who work with small to medium-sized documents such as:

Homework assignments

Short readings

Sections of textbooks

Research papers or notes

It saves users time by eliminating the need to manually search through PDFs for specific answers or explanations.

💡 Why DocuQuery?

Traditional chatbots often produce hallucinated or uncertain responses.
DocuQuery solves this problem by:

Restricting the model’s context to the uploaded document.

Returning “no answer found” when the requested information isn’t in the file.

Providing verifiable citations when it is.

This makes it a more trustworthy tool for studying and academic reference.

🧠 Tech Stack (In Development)

Framework: Next.js (App Router)

Styling: Tailwind CSS

LLM: OpenAI GPT-5-mini

Vector Database: Pinecone (for document embeddings & retrieval)

Storage: Supabase / AWS S3 (for PDF uploads)

🏗️ Development Status

DocuQuery is currently under active development.
Future updates will include:

User authentication and document history

Multi-PDF querying

Exportable answer citations

Improved UI for reading and referencing source documents

⚖️ License & Attribution

This project is proprietary and currently under development.
Attributions for icons and third-party resources will be listed in the About or Credits section once the project is publicly released.
