import { prisma } from '@/lib/db'

export async function POST(req) {
    try {
        const { title, content, department, userEmail,imageUrl } = await req.json();

        if (!title || !content || !department || !userEmail) {
            return new Response(
                JSON.stringify({ error: 'All fields (title, content, department, userEmail, postType) are required' }),
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        });
        const postType = user.role === 'FACULTY' ? 'OFFICIAL' : 'UNOFFICIAL';

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404 }
            );
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                department,
                postType, 
                imageUrl,
                postedBy: { connect: { id: user.id } }
            }
        });

        return new Response(JSON.stringify(post), { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal Server Error' }),
            { status: 500 }
        );
    }
}