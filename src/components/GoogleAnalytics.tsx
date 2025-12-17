import Script from 'next/script'
import React from 'react'

export default function GoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS
    const [shouldLoad, setShouldLoad] = React.useState(false)

    React.useEffect(() => {
        const handleInteraction = () => {
            setShouldLoad(true)
        }

        // Wait for interaction
        window.addEventListener('scroll', handleInteraction, { once: true })
        window.addEventListener('click', handleInteraction, { once: true })
        window.addEventListener('mousemove', handleInteraction, { once: true })
        window.addEventListener('touchstart', handleInteraction, { once: true })

        // Fallback timeout after 5 seconds
        const timer = setTimeout(() => {
            setShouldLoad(true)
        }, 5000)

        return () => {
            window.removeEventListener('scroll', handleInteraction)
            window.removeEventListener('click', handleInteraction)
            window.removeEventListener('mousemove', handleInteraction)
            window.removeEventListener('touchstart', handleInteraction)
            clearTimeout(timer)
        }
    }, [])

    if (!gaId || !shouldLoad) {
        return null
    }

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${gaId}');
        `}
            </Script>
        </>
    )
}
