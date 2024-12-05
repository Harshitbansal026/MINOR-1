import { prisma } from "@/lib/db";

export async function POST(req) {
    try {
        const { postId, userId, comment } = await req.json();

        if (!postId || !comment) {
            return new Response(
                JSON.stringify({ error: "Post ID and comment are required" }),
                { status: 400 }
            );
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return new Response(
                JSON.stringify({ error: "Post not found" }),
                { status: 404 }
            );
        }

        const user = userId
            ? await prisma.user.findUnique({ where: { id: userId } })
            : null;

        // Create a new comment
        const newComment = await prisma.comment.create({
            data: {
                name: user ? user.name : "Anonymous",
                comment,
                post: {
                    connect: { id: postId },
                },
                User: userId
                    ? {
                        connect: { id: userId },
                    }
                    : undefined,
            },
        });

        const actualUpvoteCount = await prisma.comment.count({
            where: {
                postId: postId
            }
        });
        await prisma.post.update({
            where: { id: postId },
            data: {
                comment: actualUpvoteCount
            }
        });


        return new Response(
            JSON.stringify({ message: "Comment added successfully", newComment }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error adding comment:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}