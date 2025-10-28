import * as React from "react";
import { Textarea } from "@/components/ui/textarea";

export function AutoResizeTextarea(
  props: React.ComponentProps<typeof Textarea>
) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = ref.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
    props.onChange?.(e);
  };

  React.useEffect(() => {
    const el = ref.current;
    if (el) el.style.height = `${el.scrollHeight}px`;
  }, []);

  return (
    <Textarea
      {...props}
      ref={ref}
      onChange={handleInput}
      className="w-[400px] min-h-[20px] overflow-hidden resize-none"
    />
  );
}
