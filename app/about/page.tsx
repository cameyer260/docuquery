export default function About() {
  return (
    <div className="flex flex-col p-8 gap-4">
      <div className="text-3xl font-bold w-fit border-b border-foreground/30 pr-2 py-2">
        <h1>About Docuquery</h1>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          DocuQuery is an AI-powered document question-and-answer platform built
          with Retrieval-Augmented Generation (RAG). It allows users to upload
          PDFs and ask a GPT model (specifically GPT-5-mini) questions about
          their content.
        </div>
        <div>
          Unlike traditional chatbots that generate best guesses, DocuQuery is
          designed for accuracy and transparency. The AI is instructed to only
          use the information found in the uploaded document. If no relevant
          answer is present, it will clearly state that no answer was found
          rather than providing an uncertain response. When an answer is found,
          DocuQuery cites the source within the document so users can verify it.
        </div>
        <div>
          This makes DocuQuery especially useful for students and academic users
          working with smaller documents—such as homework assignments, readings,
          research sections, or textbook chapters—where answers are known to
          exist in the text, but finding them manually is time-consuming.
        </div>
        <div>
          DocuQuery is currently in active development. Future updates will
          include multi-document querying, user accounts with saved history, and
          an enhanced citation interface.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-3xl font-bold w-fit border-b border-foreground/30 pr-2 py-2">
          <h1>Credits & Attribution</h1>
        </div>
        <ul>
          <li>
            Icons made by{" "}
            <a
              href="https://www.flaticon.com/authors/ilham-fitrotul-hayat"
              title="Ilham Fitrotul Hayat"
            >
              {" "}
              Ilham Fitrotul Hayat{" "}
            </a>
            ,{" "}
            <a
              href="https://www.flaticon.com/authors/kerismaker"
              title="kerismaker"
            >
              {" "}
              kerismaker{" "}
            </a>
            ,{" "}
            <a
              href="https://www.flaticon.com/authors/hidemaru"
              title="HideMaru"
            >
              {" "}
              HideMaru{" "}
            </a>
            , and{" "}
            <a href="https://www.freepik.com" title="Freepik">
              {" "}
              Freepik{" "}
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
            .
          </li>
        </ul>
      </div>
    </div>
  );
}
