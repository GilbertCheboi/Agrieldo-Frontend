import React, {useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  Alert,
  ToastAndroid,
  Image,
  Text,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Clipboard from '@react-native-clipboard/clipboard';
import AgrieldoLogo from '../assets/logo.png'; // 👉 update path if needed

const MessageBubble = ({
  id,
  text,
  isUser,
  timestamp,
  onDelete,
  onRegenerate, // only for AI messages
  showAvatar = true,
  userInitials = 'GK', // TODO: replace with dynamic initials
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isAi = !isUser;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleCopy = () => {
    if (!text) return;
    Clipboard.setString(text);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Message copied to clipboard');
    }
  };

  const handleLongPress = () => {
    const buttons = [
      {
        text: 'Copy',
        onPress: handleCopy,
      },
    ];

    if (onDelete) {
      buttons.push({
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(id),
      });
    }

    if (isAi && onRegenerate) {
      buttons.push({
        text: 'Regenerate response',
        onPress: () => onRegenerate(id),
      });
    }

    buttons.push({text: 'Cancel', style: 'cancel'});

    Alert.alert('Message actions', 'What would you like to do?', buttons, {
      cancelable: true,
    });
  };

  const formatTime = ts => {
    if (!ts) return '';
    const d = new Date(ts);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hh = ((hours + 11) % 12) + 1;
    return `${hh}:${minutes} ${ampm}`;
  };

  const timeText = formatTime(timestamp);

  return (
    <Animated.View
      style={[
        styles.row,
        isUser ? styles.rowRight : styles.rowLeft,
        {opacity: fadeAnim},
      ]}>
      {/* Avatar */}
      {showAvatar && !isUser && (
        <View style={styles.avatarContainer}>
          <Image source={AgrieldoLogo} style={styles.aiAvatar} />
        </View>
      )}

      {showAvatar && isUser && (
        <View style={[styles.avatarContainer, styles.avatarRight]}>
          <View style={styles.userAvatarCircle}>
            <Text style={styles.userAvatarText}>{userInitials}</Text>
          </View>
        </View>
      )}

      {/* Bubble */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleCopy}
        onLongPress={handleLongPress}
        delayLongPress={250}
        style={[
          styles.bubbleContainer,
          isUser ? styles.alignRight : styles.alignLeft,
        ]}>
        <View
          style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Markdown
            style={isUser ? markdownUser : markdownAI}
            mergeStyle={true}>
            {text || ''}
          </Markdown>

          {/* Timestamp */}
          {!!timeText && (
            <Text
              style={[
                styles.timestamp,
                isUser ? styles.timestampUser : styles.timestampAI,
              ]}>
              {timeText}
            </Text>
          )}

          {/* Tail */}
          <View
            style={[styles.tail, isUser ? styles.userTail : styles.aiTail]}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  row: {
    marginVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowLeft: {
    justifyContent: 'flex-start',
  },
  rowRight: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginHorizontal: 4,
  },
  avatarRight: {
    order: 2,
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  userAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  bubbleContainer: {
    maxWidth: '95%',
    paddingBottom: 10, // space for tail + timestamp
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  alignLeft: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
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
    bottom: -2,
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  userTail: {
    right: -6,
    borderLeftWidth: 8,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderBottomColor: '#333333',
  },
  aiTail: {
    left: -6,
    borderRightWidth: 8,
    borderBottomWidth: 10,
    borderRightColor: 'transparent',
    borderBottomColor: '#F8F8F8',
  },

  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  timestampUser: {
    color: '#ccc',
    alignSelf: 'flex-end',
  },
  timestampAI: {
    color: '#999',
    alignSelf: 'flex-start',
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
  heading2: {
    color: '#ffa500',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
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
