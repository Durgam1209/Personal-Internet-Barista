export default function Hero() {
    return (
        <section className="border-b border-zinc-800">

            <div className="max-w-5xl mx-auto px-6 py-20">

                <p className="text-zinc-400 uppercase tracking-[6px]">
                    personal.cafe
                </p>

                <h1 className="text-5xl md:text-7xl font-bold mt-4 leading-tight">
                    Your Personal
                    <br />
                    AI Barista ☕
                </h1>

                <p className="text-zinc-400 text-xl mt-8 max-w-3xl">
                    Brews the internet's most important engineering and AI
                    news into one beautiful daily digest.
                </p>

                <div className="flex gap-4 mt-10">

                    <div className="bg-zinc-900 px-5 py-3 rounded-xl">
                        GitHub
                    </div>

                    <div className="bg-zinc-900 px-5 py-3 rounded-xl">
                        ArXiv
                    </div>

                    <div className="bg-zinc-900 px-5 py-3 rounded-xl">
                        AI News
                    </div>

                </div>

            </div>

        </section>
    );
}