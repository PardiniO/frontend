export interface IEpubContents {
    window: Window;
}

export interface IEpubEventMap {
    selected: (cfiRange: string, contents: IEpubContents) => void;
}

export interface IEpubRendition {
    display(location?: string): void;
    destroy(): void;
    
    on<T extends keyof IEpubEventMap>(
        event: T, 
        callback: IEpubEventMap[T]
    ): void;    

    annotations: {
        add(
            type: 'highlight',
            cfiRange: string,
            callback: () => void,
            options: Record<string, string>
        ): void;    
        remove:(cfiRange: string) => void;
    };    
}    

export interface IEpub {
    renderTo:(element: HTMLElement, options: { width: string, height: string }) => IEpubRendition;
}