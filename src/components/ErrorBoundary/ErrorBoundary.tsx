import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {monitoring} from '@services/monitoring';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {hasError: false};

  static getDerivedStateFromError(): State {
    return {hasError: true};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    monitoring.logError(error, {component_stack: info.componentStack?.slice(0, 200) ?? ''});
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Algo deu errado</Text>
          <Text style={styles.description}>
            Um erro inesperado ocorreu. Por favor, reinicie o aplicativo.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({hasError: false})}>
            <Text style={styles.buttonLabel}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#F8F8F8',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#3B82F6',
    borderRadius: 999,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
