import { createEmotionCache } from '@mantine/core';
import { createStylesServer, ServerStyles } from '@mantine/next';
import Document, { type DocumentContext, Head, Html, Main, NextScript } from 'next/document';

const customCache = createEmotionCache({
    key: 'mantine'
});

const stylesServer = createStylesServer(customCache);

export default class _Document extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: [
                initialProps.styles,
                <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />,
            ],
        };
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}