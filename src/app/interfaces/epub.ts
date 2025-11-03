export interface IEpubContents {
    window: Window;
}
// cfi: Canonical Fragment Identifier (Identificador de Fragmento Canónico)
export interface IEpubEventMap {
    selected: (cfiRange: string, contents: IEpubContents) => void;
}

export interface IEpubRendition {
    display(location?: string): void;
    destroy(): void;
    
    on: {
        (event: 'selected', callback: IEpubEventMap['selected']): void
        (event: string, callback: (...args: unknown[]) => void): void
    };

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