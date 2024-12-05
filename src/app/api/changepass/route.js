import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, currentPassword, newPassword, confirmNewPassword } = body;

        // Validate input
        if (!email || !currentPassword || !newPassword || !confirmNewPassword) {
            return new Response(JSON.stringify({ error: 'All fields are required.' }), {
                status: 400,
            });
        }

        if (newPassword !== confirmNewPassword) {
            return new Response(
                JSON.stringify({ error: 'New password and confirm password do not match.' }),
                { status: 400 }
            );
        }

        // Fetch user from database
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found.' }), {
                status: 404,
            });
        }

        // Verify current password
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return new Response(JSON.stringify({ error: 'Incorrect current password.' }), {
                status: 400,
            });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in the database
        await prisma.user.update({
            where: { email },
            data: { password: hashedNewPassword },
        });

        return new Response(JSON.stringify({ message: 'Password changed successfully.' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error changing password:', error);
        return new Response(JSON.stringify({ error: 'Internal server error.' }), {
            status: 500,
        });
    }
}
