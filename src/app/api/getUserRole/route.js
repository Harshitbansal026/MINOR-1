import {prisma} from '@/lib/db'

export async function POST(req) {
    try {
        const body = await req.json();
        const { email } = body;
        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), {
                status: 400,
            });
        }
        const user = await prisma.user.findUnique({
            where: { email },
            select: { role: true },
        });

        if (user) {
            return new Response(JSON.stringify({ role: user.role }), {
                status: 200,
            });
        } else {
            return new Response(
                JSON.stringify({ error: 'User not found' }),
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error fetching user role:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
}