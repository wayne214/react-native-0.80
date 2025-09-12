import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export interface LoadingRef {
    show: (msg?: string) => void;
    hide: () => void;
}

interface LoadingProps {}

const Loading = forwardRef<LoadingRef, LoadingProps>((props, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    useImperativeHandle(ref, () => ({
        show(msg: string = '加载中...') {
            setMessage(msg);
            setVisible(true);
        },
        hide() {
            setVisible(false);
        },
    }));

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <ActivityIndicator size="large" color="#fff" />
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                </View>
            </View>
        </Modal>
    );
});

Loading.displayName = 'Loading';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 120,
    },
    message: {
        color: '#fff',
        marginTop: 10,
        fontSize: 14,
    },
});

export default Loading;