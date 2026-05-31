'use client';
import { ForwardedRef, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/button';
import { RiCodeSSlashFill } from 'react-icons/ri';
import City from './City';
import ActionTickers from '../tickers/ActionTickers';
import WaitListForm from './WaitListForm';
import HighlighterTicker from '../tickers/HighlighterTicker';
import { useRouter } from 'next/navigation';

interface HeroProps {
    inputRef: ForwardedRef<HTMLTextAreaElement>;
}

export default function Hero({ inputRef }: HeroProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(heroRef, { once: true });
    const controls = useAnimation();
    const router = useRouter();

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    const { scrollY } = useScroll();
    const fadeOpacity = useTransform(scrollY, [0, 800], [0, 1]);

    return (
        <motion.div className="flex-1 flex justify-center items-center px-4 sticky top-0 md:top-0 z-0">
            <motion.div
                className="absolute inset-0 bg-black pointer-events-none z-30"
                style={{ opacity: fadeOpacity }}
            />
            <City className="absolute inset-0 z-0" />

            <main
                ref={heroRef}
                className="relative flex flex-col justify-center items-center h-screen w-full overflow-visible"
            >
                <motion.div
                    className="relative z-10 w-full max-w-2xl"
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.8 } },
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mb-3"
                    >
                        <h1 className="text-[28px] md:text-[60px] font-bold leading-tight bg-gradient-to-t flex flex-col from-neutral-700 via-neutral-300 to-neutral-200 bg-clip-text text-transparent">
                            <span>Ship Solana Contracts</span>
                            <span>in Minutes not Months</span>
                        </h1>
                    </motion.div>

                    <HighlighterTicker />
                    <WaitListForm />
                    <ActionTickers />
                </motion.div>

               
            </main>
        </motion.div>
    );
}
