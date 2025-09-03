import React from 'react';
import Loading from './Loading';

let loadingRef = null;

export const LoadingManager = {
    setRef: (ref) => {
        loadingRef = ref;
    },
    show: (msg) => {
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
export const LoadingProvider = () => {
    return (
        <Loading
            ref={(ref) => {
                if (ref) {
                    LoadingManager.setRef(ref);
                }
            }}
        />
    );
};
