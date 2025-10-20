import Form from "next/form";
import FileBlock from "./file-block";
import { Input } from "../ui/input";

export default function WithAccount() {
  const tempdev = [
    { imgUrl: "/upload/document.png", title: "file1" },
    { imgUrl: "/upload/document.png", title: "file2" },
    { imgUrl: "/upload/document.png", title: "file3" },
    { imgUrl: "/upload/document.png", title: "file4" },
    { imgUrl: "/upload/document.png", title: "file5" },
    { imgUrl: "/upload/document.png", title: "file6" },
    { imgUrl: "/upload/document.png", title: "file7" },
    { imgUrl: "/upload/document.png", title: "file8" },
  ];

  return (
    <div className="flex flex-col p-8 [&_h1]:text-4xl [&_h1]:font-bold gap-8 items-center">
      <div className="flex flex-col gap-4 items-center">
        <h1>Upload a PDF</h1>
        <Form
          action="/api/upload"
          className="flex flex-col gap-2 [&_input]:w-60 [&_input]:border [&_input]: border-foreground/30 [&_input]:rounded-lg [&_input]:px-2 [&_input]:text-lg"
        >
          <Input
            id="name"
            type="text"
            name="pdf"
            placeholder="name it"
            required
          />
          <Input id="pdf" type="file" accept=".pdf" name="pdf" required />
          <Input type="submit" value="Upload and Ingest" />
        </Form>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <h1>Your Documents</h1>
        <div className="grid grid-cols-[repeat(3,minmax(0,300))] gap-4">
          {tempdev.map((el, index) => (
            <FileBlock key={index} imgUrl={el.imgUrl} title={el.title} />
          ))}
        </div>
      </div>
    </div>
  );
}
