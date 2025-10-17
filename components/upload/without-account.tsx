export default function WithoutAccount() {
  return (
    <div className="flex flex-col p-8 [&_h1]:text-3xl [&_h1]:font-bold">
      <div className="flex flex-col gap-2">
        <h1>Upload a PDF</h1>
      </div>
      <div>
        <h1>Your Document</h1>
      </div>
    </div>
  );
}
