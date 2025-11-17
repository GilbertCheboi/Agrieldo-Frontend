import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import Markdown from 'react-native-markdown-display';

const MessageBubble = ({text, isUser}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        isUser ? styles.alignRight : styles.alignLeft,
        {opacity: fadeAnim},
      ]}>
      <View
        style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Markdown style={isUser ? markdownUser : markdownAI} mergeStyle={true}>
          {text}
        </Markdown>
        <View style={[styles.tail, isUser ? styles.userTail : styles.aiTail]} />
      </View>
    </Animated.View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  bubbleContainer: {
    marginVertical: 6,
    maxWidth: '90%',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#333333',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#F8F8F8',
    borderBottomLeftRadius: 4,
  },
  tail: {
    position: 'absolute',
    bottom: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  userTail: {
    right: -6,
    borderRightWidth: 0,
    borderLeftWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderBottomColor: '#333333',
  },
  aiTail: {
    left: -6,
    borderLeftWidth: 0,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderRightColor: 'transparent',
    borderBottomColor: '#F8F8F8',
  },
});

/* Markdown Styles */
const markdownAI = {
  body: {color: '#1c1c1e', fontSize: 15, lineHeight: 22},
  heading1: {
    color: '#0a6847',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  heading2: {color: '#ffa500', fontSize: 18, fontWeight: 'bold', marginTop: 10},
  heading3: {color: '#0a6847', fontSize: 16, fontWeight: '600', marginTop: 8},
  strong: {color: '#333333'},
  em: {color: '#555', fontStyle: 'italic'},
  bullet_list: {marginLeft: 10, marginTop: 6},
  list_item: {marginVertical: 2},
  table: {borderWidth: 1, borderColor: '#ccc', borderRadius: 6},
  table_row: {borderBottomWidth: 1, borderColor: '#eee'},
  table_cell: {padding: 4},
  code_inline: {
    backgroundColor: '#f2f2f2',
    padding: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: '#ffa500',
    paddingLeft: 10,
    color: '#555',
    fontStyle: 'italic',
  },
};

const markdownUser = {
  body: {color: '#fff', fontSize: 15, lineHeight: 22},
};
