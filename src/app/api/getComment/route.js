import { prisma } from "@/lib/db";

export async function POST(req) {
    try {
        const { postId } = await req.json();

        if (!postId) {
            return new Response(
                JSON.stringify({ error: "Post ID is required to fetch comments" }),
                { status: 400 }
            );
        }

        const comments = await prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                comment: true,
                createdAt: true,
                User: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        const formattedComments = comments.map((comment) => ({
            id: comment.id,
            name: comment.name,
            comment: comment.comment,
            createdAt: comment.createdAt,
            username: comment.User?.name || "Anonymous",
        }));

        

        return new Response(JSON.stringify(formattedComments), { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
