import { Html, Head, Main, NextScript } from 'next/document';

export const metadata = {
  karma: {
    card: 'Karmic voting',
    title: 'Karma',
    description: 'Your opinion counts',
  },
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content={metadata.karma.description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jura:wght@300..700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Major+Mono+Display&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Reenie+Beanie&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="w-full h-[100vh]">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
