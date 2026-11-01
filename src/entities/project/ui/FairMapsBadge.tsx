/**
 * The Fair Maps crest, embedded exactly as the badge page hands it out: a plain
 * image linking back, no script. The badge endpoint notes the embedding page's
 * address, so it stays a raw <img> rather than a proxied next/image.
 */
const FAIR_MAPS = "https://fairmaps.melson.us";

export function FairMapsBadge() {
    return (
        <aside
            aria-label="Fair Maps"
            className="not-prose mt-12 flex flex-col sm:flex-row items-center gap-6 rounded-lg border border-border bg-surface/30 p-6 font-sans"
        >
            <a href={`${FAIR_MAPS}/`} className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={`${FAIR_MAPS}/api/badge?badge=crest`}
                    srcSet={`${FAIR_MAPS}/api/badge?badge=crest&scale=2 2x`}
                    width={160}
                    height={190}
                    alt="Fair Maps: districts drawn by a rule"
                    loading="lazy"
                />
            </a>
            <div className="text-center sm:text-left">
                <p className="font-display font-bold text-lg leading-snug">See the map for your address</p>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                    Fair Maps draws every U.S. House, State House and State Senate district from population and
                    geography alone. Look up your district and compare it with the lines in use today.
                </p>
                <a
                    href={`${FAIR_MAPS}/`}
                    className="mt-3 inline-block text-sm font-bold text-blue-700 hover:text-blue-900 underline underline-offset-4"
                >
                    Open Fair Maps
                </a>
            </div>
        </aside>
    );
}
