import React, {useRef, useEffect, useState} from 'react';
import {
    View,
    Animated,
    StyleSheet,
    SectionList,
    SectionListProps, Text,
} from 'react-native';
import {
    PanGestureHandler,
    NativeViewGestureHandler,
    State, GestureHandlerRootView,
} from 'react-native-gesture-handler';

export enum RefreshState {
    Idle = 'idle',               // 初始 / 回弹完成
    Pulling = 'pulling',         // 下拉中（未到阈值）
    Ready = 'ready',             // 超过阈值，松手即可刷新
    Refreshing = 'refreshing',   // 正在刷新
    Finished = 'finished',       // 刷新完成（短暂态）
}


interface Props<T> extends SectionListProps<T> {
    refreshing: boolean;
    onRefresh: () => void | Promise<void>;
    renderRefreshHeader: (progress: Animated.Value) => React.ReactNode;
    refreshThreshold?: number;
    headerHeight?: number;
}

export function RefreshSectionList<T>({
                                          refreshing,
                                          onRefresh,
                                          renderRefreshHeader,
                                          refreshThreshold = 60,
                                          headerHeight = 60,
                                          ...sectionListProps
                                      }: Props<T>) {
    const translateY = useRef(new Animated.Value(0)).current;
    const dragY = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef(null);

    const refreshState = useRef<RefreshState>(RefreshState.Idle);
    const [, forceUpdate] = useState(0);

    const setState = (next: RefreshState) => {
        if (refreshState.current !== next) {
            refreshState.current = next;
            forceUpdate(v => v + 1);
        }
    };

    // const translateY = useRef(new Animated.Value(0)).current;
    // const dragY = useRef(new Animated.Value(0)).current;

    const progress = Animated.divide(
        translateY,
        new Animated.Value(refreshThreshold),
    );

    const updatePullState = (offsetY: number) => {
        if (refreshState.current === RefreshState.Refreshing) return;

        if (offsetY <= 0) {
            setState(RefreshState.Idle);
        } else if (offsetY < refreshThreshold) {
            setState(RefreshState.Pulling);
        } else {
            setState(RefreshState.Ready);
        }
    };


    /** 手势事件 */
    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: dragY } }],
        { useNativeDriver: true,
            listener: (e: any) => {
                const y = Math.max(0, e.nativeEvent.translationY);
                translateY.setValue(Math.min(y, headerHeight * 1.5));

                updatePullState(y);
            }
        },
    );

    /** 监听 dragY */
    useEffect(() => {
        const id = dragY.addListener(({ value }) => {
            if (value > 0 && !refreshing) {
                translateY.setValue(Math.min(value, headerHeight * 1.5));
            }
        });
        return () => dragY.removeListener(id);
    }, [refreshing]);

    /** refreshing 状态变化 */
    useEffect(() => {
        // if (refreshing) {
        //     Animated.timing(translateY, {
        //         toValue: headerHeight,
        //         duration: 500,
        //         useNativeDriver: true,
        //     }).start();
        // } else {
        //     Animated.timing(translateY, {
        //         toValue: 0,
        //         duration: 300,
        //         useNativeDriver: true,
        //     }).start();
        // }
        if (
            !refreshing &&
            refreshState.current === RefreshState.Refreshing
        ) {
            setState(RefreshState.Finished);

            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setState(RefreshState.Idle);
            });
        }
    }, [refreshing]);

    const reset = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
        }).start(() => {
            setState(RefreshState.Idle);
        });
    };


    const onHandlerStateChange = ({ nativeEvent }: any) => {
        // if (nativeEvent.state === State.END) {
        //     if (nativeEvent.translationY >= refreshThreshold && !refreshing) {
        //         onRefresh();
        //     } else if (!refreshing) {
        //         Animated.spring(translateY, {
        //             toValue: 0,
        //             useNativeDriver: true,
        //         }).start();
        //     }
        // }

        if (nativeEvent.state !== State.END) return;

        if (refreshState.current === RefreshState.Ready) {
            // 进入刷新
            setState(RefreshState.Refreshing);

            Animated.timing(translateY, {
                toValue: headerHeight,
                duration: 200,
                useNativeDriver: true,
            }).start();

            onRefresh?.();
        } else {
            reset();
        }

    };

    const renderRefreshHeaderView = () => {
        const state = refreshState.current
        let text = ''
        switch (state){
            case RefreshState.Pulling:
                text = '下拉刷新'
                break;
            case RefreshState.Ready:
                text = '释放立即刷新'
                break;
            case RefreshState.Refreshing:
                text = '正常刷新'
                break;
            case RefreshState.Finished:
                text = '刷新完成'
                break;
        }
        return (
            <Animated.View
                style={[
                    styles.refreshHeader,
                    {
                        height: headerHeight,
                        transform: [
                            {
                                translateY: Animated.add(
                                    translateY,
                                    new Animated.Value(-headerHeight),
                                ),
                            },
                        ],
                    },
                ]}
            >
                {/*<Text style={styles.refreshText}>{refreshing ? '正在加载' : '下拉刷新'}</Text>*/}
                <Text style={styles.refreshText}>{text}</Text>
            </Animated.View>
        )
    };

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <View style={styles.container}>
                {/* 刷新头部 */}
                {renderRefreshHeaderView()}

                <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onHandlerStateChange}
                    enabled={!refreshing}
                    simultaneousHandlers={scrollRef}
                >
                    <Animated.View
                        style={{
                            flex: 1,
                            transform: [{ translateY }],
                        }}
                    >
                        <NativeViewGestureHandler
                            ref={scrollRef}
                            simultaneousHandlers={scrollRef}
                        >
                            <SectionList
                                {...sectionListProps}
                                scrollEnabled={!refreshing}
                            />
                        </NativeViewGestureHandler>

                    </Animated.View>
                </PanGestureHandler>
            </View>
        </GestureHandlerRootView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    refreshHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        alignItems: 'center'
    },
    refreshText: {
        color: '#fff',
        fontSize: 15
    }
});
