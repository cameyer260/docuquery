import NotFoundImage from "@/components/not-found/not-found-image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center p-8 text-4xl font-bold gap-4">
      <h1>Sorry, this page does not exist.</h1>
      <h1 className="text-2xl font-normal">404 Error Not Found</h1>
      <NotFoundImage />
    </div>
  );
}
