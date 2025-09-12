import React from 'react';
import Loading from './Loading';
import type { LoadingRef } from './Loading';

let loadingRef: LoadingRef | null = null;

export interface LoadingManagerInterface {
    setRef: (ref: LoadingRef | null) => void;
    show: (msg?: string) => void;
    hide: () => void;
}

export const LoadingManager: LoadingManagerInterface = {
    setRef: (ref: LoadingRef | null) => {
        loadingRef = ref;
    },
    show: (msg?: string) => {
        if (loadingRef && loadingRef.show) {
            loadingRef.show(msg);
        }
    },
    hide: () => {
        if (loadingRef && loadingRef.hide) {
            loadingRef.hide();
        }
    },
};

// 包装一个全局组件，放在 App 根节点
export const LoadingProvider: React.FC = () => {
    const handleRef = (ref: LoadingRef | null) => {
        if (ref) {
            LoadingManager.setRef(ref);
        }
    };

    return (
        <Loading ref={handleRef} />
    );
};