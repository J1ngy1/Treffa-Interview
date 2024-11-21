declare module 'color-namer' {
    const namer: (hex: string) => {
        [key: string]: Array<{ name: string; hex: string }>;
    };
    export = namer;
}
