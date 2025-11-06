import { spawn } from "child_process";

export async function getPdfPreview(pdfBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const child = spawn('convert', [
      '-density', '150',
      'pdf:-[0]',           // Read PDF from stdin, first page only
      '-quality', '90',
      '-resize', '120x120',
      'png:-'               // Write PNG to stdout
    ]);

    const chunks: Buffer[] = [];
    const errors: Buffer[] = [];

    child.stdout.on('data', (chunk) => chunks.push(chunk));
    child.stderr.on('data', (chunk) => errors.push(chunk));

    child.on('close', (code) => {
      if (code === 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`ImageMagick failed: ${Buffer.concat(errors).toString()}`));
      }
    });

    child.on('error', (err) => {
      reject(new Error(`ImageMagick not found. Install with: brew install imagemagick`));
    });

    child.stdin.write(pdfBuffer);
    child.stdin.end();
  });
}
