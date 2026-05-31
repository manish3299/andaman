import './globals.css';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOption } from './api/auth/[...nextauth]/options';
import SessionSetter from '@/src/lib/SessionSeter';
import WalletProviders from '@/src/providers/WalletProviders';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
    title: 'Sarvric',
    description:
        'Sarvric is an AI-powered platform for building and deploying Solana smart contracts with Anchor, end-to-end.',
    metadataBase: new URL('https://sarvric.com'),
    openGraph: {
        title: 'Sarvric',
        description:
            'Sarvric is an AI-powered platform for building and deploying Solana smart contracts with Anchor, end-to-end.',
        url: 'https://sarvric.com',
        siteName: 'Sarvric',
        images: [
            {
                url: '/images/winterfell-dashboard.png',
                width: 1200,
                height: 630,
                alt: ' Preview',
            },
        ],
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Sarvric | Smart Contract Generator',
        description:
            'Sarvric is an AI-powered platform for building and deploying Solana smart contracts with Anchor, end-to-end.',
        images: ['/images/winterfell-dashboard.png'],
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOption);

    return (
        <html lang="en">
            <body className={`antialiased bg-darkest`} suppressHydrationWarning>
                <Toaster
                    theme="dark"
                    closeButton
                    visibleToasts={4}
                    toastOptions={{
                        style: {
                            background: '#121314',
                            color: '#ababab',
                            border: '1px solid #2C2C2E',
                            borderRadius: '12px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
                        },
                        classNames: {
                            title: 'text-white font-semibold',
                            description: 'text-gray-300',
                            actionButton: 'bg-indigo-600 text-white hover:bg-indigo-700',
                            cancelButton: 'bg-[#121314] text-light/70 hover:bg-gray-800',
                        },
                    }}
                />
                <WalletProviders>{children}</WalletProviders>
                <SessionSetter session={session} />
            </body>
        </html>
    );
}
