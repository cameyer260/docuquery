import Upload from "./upload";
import Process from "./process";
import Ask from "./ask";

export default function GetStarted() {
  return (
    <div className="grid grid-cols-[repeat(3,minmax(0,180))] gap-8">
      <Upload />
      <Process />
      <Ask />
    </div>
  );
}
