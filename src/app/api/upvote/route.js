import { prisma } from "@/lib/db";

export async function POST(req) {
    try {
        const { userId, postId } = await req.json();

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "User ID is required" }),
                { status: 400 }
            );
        }
        if (!postId) {
            return new Response(
                JSON.stringify({ error: "Post ID is required" }),
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

        const existingUpvote = await prisma.upvote.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: postId,
                },
            },
        });

        if (existingUpvote) {
            return new Response(
                JSON.stringify({ error: "You have already upvoted this post" }),
                { status: 400 }
            );
        }
        await prisma.upvote.create({
            data: {
                user: {
                    connect: { id: userId },
                },
                post: {
                    connect: { id: postId },
                },
            },
        });

        const actualUpvoteCount = await prisma.upvote.count({
            where: {
                postId: postId
            }
        });

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                upvotes: actualUpvoteCount
            },
            include:{
                upvotedBy: true
            }
        });

        return new Response(
            JSON.stringify({ message: "Post upvoted successfully"}),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error upvoting the post:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
