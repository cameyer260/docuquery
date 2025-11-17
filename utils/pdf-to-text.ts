import { spawn } from "child_process";

/**
 * method for converting a pdf buffer to text.
 * uses the imagemagick binary.
 */
export async function getPdfText(pdfBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('pdftotext', [
      '-',
      '-',
    ]);

    const chunks: Buffer[] = [];
    const errors: Buffer[] = [];

    child.stdout.on('data', (chunk) => chunks.push(chunk));
    child.stderr.on('data', (chunk) => errors.push(chunk));

    child.on('close', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks).toString());
      } else {
        reject(new Error(`Poppler failed: ${Buffer.concat(errors).toString()}`));
      }
    });

    child.on('error', (err) => {
      reject(new Error(`Poppler not found. Install with: brew install poppler`));
    });

    child.stdin.write(pdfBuffer);
    child.stdin.end();
  });
}
