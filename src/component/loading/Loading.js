import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const Loading = forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    useImperativeHandle(ref, () => ({
        show(msg = '加载中...') {
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
