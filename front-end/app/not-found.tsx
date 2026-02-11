
import Image from "next/image";

export default function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
				<Image src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
				<h1 className="mt-8 text-3xl font-semibold text-black dark:text-zinc-50">Page not found</h1>
				<p className="mt-4 text-zinc-600 dark:text-zinc-400">The page you're looking for doesn't exist.</p>
			</main>
		</div>
	);
}
