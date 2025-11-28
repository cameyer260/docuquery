import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/prisma/client";
import { s3client } from "@/utils/s3/client";
import { pc } from "@/utils/pinecone/client";

export async function DELETE(req: NextRequest) {
  try {
    // handle auth up top
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json(
        { error: "User is not authorized to make the request." },
        { status: 401 },
      );
    const userId = session?.user?.id;
    const body = await req.json();

    // now try to delete the file
    // postgres before s3, preview goes first due to dependency on file parent (use delete many to prevent throwing an error if the record dne, could happen on previous deletion failures)
    await prisma.preview.deleteMany({
      where: {
        documentId: body.id,
      }
    });
    // then delete the log which also has a dependency on the file
    await prisma.log.deleteMany({
      where: {
        documentId: body.id
      }
    });
    // now delete postgres file 
    const file = await prisma.document.delete({
      where: {
        id: body.id,
      }
    });
    // now delete aws preview
    const previewName = `user-${userId}/previews/${file.name}.png`;
    const deletePreviewCommand = new DeleteObjectCommand({
      Bucket: "docuquery-files",
      Key: previewName,
    });
    await s3client.send(deletePreviewCommand);
    // now delete aws file 
    const filename = `user-${userId}/docs/${file.name}.pdf`;
    const deleteFileCommand = new DeleteObjectCommand({
      Bucket: "docuquery-files",
      Key: filename,
    });
    await s3client.send(deleteFileCommand);
    // now delete from pinecone
    const namespace = pc.index("docuquery", "https://docuquery-38emsw1.svc.aped-4627-b74a.pinecone.io").namespace(userId);
    await namespace.deleteMany({
      pdf_id: { $eq: body.id },
    });

    return NextResponse.json({ payload: "Successfully deleted the file." }, { status: 200 });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
